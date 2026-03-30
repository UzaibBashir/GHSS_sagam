import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const LOCAL_PUBLIC_ROOT = path.join(process.cwd(), "public", "uploads");
const DEFAULT_STORAGE_DRIVER = (process.env.STORAGE_DRIVER || "local").trim().toLowerCase();

function safeSegment(value, fallback = "file") {
  const cleaned = String(value || "").trim().toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const normalized = cleaned.replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function getFileExtension(contentType, originalName) {
  const byName = String(originalName || "").trim();
  const hasExt = byName.includes(".");
  if (hasExt) {
    const ext = byName.split(".").pop().toLowerCase();
    if (/^[a-z0-9]{1,8}$/.test(ext)) {
      return ext;
    }
  }

  const mime = String(contentType || "").toLowerCase();
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "application/pdf") return "pdf";
  return "bin";
}

function buildObjectKey(scope, contentType, originalName) {
  const ext = getFileExtension(contentType, originalName);
  const date = new Date();
  const yyyy = String(date.getUTCFullYear());
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const safeScope = safeSegment(scope, "misc");
  return `${safeScope}/${yyyy}/${mm}/${dd}/${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;
}

async function saveToLocalStorage(params) {
  const { buffer, contentType, originalName, scope } = params;
  const key = buildObjectKey(scope, contentType, originalName);
  const targetPath = path.join(LOCAL_PUBLIC_ROOT, key);
  const targetDir = path.dirname(targetPath);
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(targetPath, buffer);

  return {
    key,
    url: `/uploads/${key.replace(/\\/g, "/")}`,
  };
}

function toDataUrl(contentType, buffer) {
  const safeType = String(contentType || "application/octet-stream").trim().toLowerCase();
  return `data:${safeType};base64,${Buffer.from(buffer).toString("base64")}`;
}

async function loadAwsS3Client() {
  const moduleName = "@aws-sdk/client-s3";
  const dynamicImport = new Function("name", "return import(name);");
  try {
    return await dynamicImport(moduleName);
  } catch {
    throw new Error("S3 driver requires @aws-sdk/client-s3. Run: npm install @aws-sdk/client-s3");
  }
}

function buildS3PublicUrl(key) {
  const customBase = String(process.env.STORAGE_PUBLIC_BASE_URL || "").trim();
  if (customBase) {
    return `${customBase.replace(/\/+$/, "")}/${key}`;
  }

  const bucket = String(process.env.S3_BUCKET || "").trim();
  const region = String(process.env.S3_REGION || "us-east-1").trim();
  const endpoint = String(process.env.S3_ENDPOINT || "").trim();
  if (endpoint) {
    return `${endpoint.replace(/\/+$/, "")}/${bucket}/${key}`;
  }
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

async function saveToS3Storage(params) {
  const { S3Client, PutObjectCommand } = await loadAwsS3Client();
  const bucket = String(process.env.S3_BUCKET || "").trim();
  const region = String(process.env.S3_REGION || "us-east-1").trim();
  const endpoint = String(process.env.S3_ENDPOINT || "").trim();
  const accessKeyId = String(process.env.S3_ACCESS_KEY_ID || "").trim();
  const secretAccessKey = String(process.env.S3_SECRET_ACCESS_KEY || "").trim();
  const forcePathStyle = String(process.env.S3_FORCE_PATH_STYLE || "").trim() === "1";

  if (!bucket || !accessKeyId || !secretAccessKey) {
    throw new Error("S3 storage is not fully configured (S3_BUCKET/S3_ACCESS_KEY_ID/S3_SECRET_ACCESS_KEY).");
  }

  const { buffer, contentType, originalName, scope } = params;
  const key = buildObjectKey(scope, contentType, originalName);
  const client = new S3Client({
    region,
    endpoint: endpoint || undefined,
    forcePathStyle,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: buildS3PublicUrl(key),
  };
}

export async function saveUploadedBuffer(params) {
  const size = Number(params?.size || params?.buffer?.byteLength || 0);
  const maxBytes = Number(params?.maxBytes || 0);
  if (!size || !params?.buffer) {
    throw new Error("Upload file is missing");
  }
  if (maxBytes > 0 && size > maxBytes) {
    throw new Error(`File must be less than ${Math.ceil(maxBytes / (1024 * 1024))} MB`);
  }

  const payload = {
    buffer: params.buffer,
    contentType: String(params.contentType || "application/octet-stream"),
    originalName: String(params.originalName || "upload"),
    scope: String(params.scope || "misc"),
  };

  let saved;
  if (DEFAULT_STORAGE_DRIVER === "s3") {
    saved = await saveToS3Storage(payload);
  } else {
    try {
      saved = await saveToLocalStorage(payload);
    } catch (err) {
      const code = String(err?.code || "").toUpperCase();
      const noWritableFs = code === "ENOENT" || code === "EROFS" || code === "EACCES" || code === "EPERM";
      if (!noWritableFs) {
        throw err;
      }

      // Serverless deployments may not allow writing under /var/task/public.
      // Fallback to inline data URL so uploads still work without crashing.
      saved = {
        key: `inline/${Date.now()}-${randomUUID().slice(0, 8)}`,
        url: toDataUrl(payload.contentType, payload.buffer),
      };
    }
  }

  return {
    ...saved,
    name: payload.originalName,
    type: payload.contentType,
    size,
  };
}
