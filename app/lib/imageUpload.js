import { API_BASE } from "./api";

const ONE_MB = 1024 * 1024;

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

function createCanvas(width, height) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(width, height);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

async function canvasToBlob(canvas, quality) {
  if (typeof canvas.convertToBlob === "function") {
    return canvas.convertToBlob({ type: "image/webp", quality });
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image optimization failed"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality
    );
  });
}

function getAdminToken() {
  if (typeof window === "undefined") return "";
  try {
    return String(sessionStorage.getItem("admin_token") || "").trim();
  } catch {
    return "";
  }
}

async function uploadImageBlob(blob, originalName = "upload.webp") {
  const token = getAdminToken();
  if (!token) {
    throw new Error("Admin session expired. Please sign in again.");
  }

  const ext = String(originalName || "")
    .split(".")
    .pop()
    ?.toLowerCase();
  const normalizedName =
    ext && ext !== "bin" ? originalName : `${String(originalName || "upload").replace(/\.[^/.]+$/, "") || "upload"}.webp`;
  const file = new File([blob], normalizedName, { type: blob.type || "image/webp" });
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_BASE}/admin/uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (response.ok) {
      const url = String(payload?.upload?.url || "").trim();
      if (url) {
        return url;
      }
    }

    // Auth failures should still surface so the user can login again.
    if (response.status === 401 || response.status === 403) {
      throw new Error(payload?.detail || "Admin session expired. Please sign in again.");
    }

    // Non-auth upload failures fallback to inline URL so edits are not blocked.
    return readAsDataUrl(file);
  } catch (error) {
    if (/session expired|sign in again|unauthorized|forbidden/i.test(String(error?.message || ""))) {
      throw error;
    }
    return readAsDataUrl(file);
  }
}

export async function fileToOptimizedDataUrl(file, options = {}) {
  if (!file) {
    throw new Error("Image file is required");
  }

  const isImage = String(file.type || "").startsWith("image/");
  const isPdf = String(file.type || "").toLowerCase() === "application/pdf";

  if (!isImage && !isPdf) {
    throw new Error("Only image or PDF files are supported");
  }

  if (isPdf) {
    if (file.size > ONE_MB) {
      throw new Error("PDF must be less than 1 MB");
    }
    return readAsDataUrl(file);
  }

  const maxBytes = Number(options.maxBytes || ONE_MB);
  const maxWidth = Number(options.maxWidth || 1440);
  const maxHeight = Number(options.maxHeight || 1440);
  const quality = Number(options.quality || 0.78);

  if (file.size <= maxBytes) {
    return uploadImageBlob(file, file.name || "upload");
  }

  let imageBitmap;
  try {
    imageBitmap = await createImageBitmap(file);
  } catch {
    // Fallback for browsers/file types that cannot be decoded by createImageBitmap.
    return uploadImageBlob(file, file.name || "upload");
  }
  const ratio = Math.min(maxWidth / imageBitmap.width, maxHeight / imageBitmap.height, 1);
  const targetWidth = Math.max(1, Math.round(imageBitmap.width * ratio));
  const targetHeight = Math.max(1, Math.round(imageBitmap.height * ratio));

  const canvas = createCanvas(targetWidth, targetHeight);
  const context = canvas.getContext("2d", { alpha: false });

  if (!context) {
    throw new Error("Image optimization failed");
  }

  context.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

  let output = await canvasToBlob(canvas, quality);

  // Final guard in case the compressed output is still large.
  if (output.size > maxBytes) {
    output = await canvasToBlob(canvas, Math.max(0.55, quality - 0.2));
  }

  return uploadImageBlob(output, `${String(file.name || "upload").replace(/\.[^/.]+$/, "")}.webp`);
}
