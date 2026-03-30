import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

function parseCsv(value, fallback) {
  const source = value || fallback;
  return source
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const config = {
  environment: (process.env.ENVIRONMENT || process.env.NODE_ENV || "development").toLowerCase(),
  adminUsername: process.env.ADMIN_USERNAME || "admin",
  adminPassword: process.env.ADMIN_PASSWORD || "change-me-123",
  tokenTtlSeconds: Number(process.env.ADMIN_TOKEN_TTL_SECONDS || 60 * 60 * 8),
  studentTokenTtlSeconds: Number(process.env.STUDENT_TOKEN_TTL_SECONDS || 60 * 60 * 4),
  failedLoginLimit: Number(process.env.ADMIN_FAILED_LOGIN_LIMIT || 5),
  lockoutSeconds: Number(process.env.ADMIN_LOCKOUT_SECONDS || 60 * 5),
  sessionSecret: process.env.ADMIN_SESSION_SECRET || "",
  allowedHosts: parseCsv(process.env.ALLOWED_HOSTS, "localhost,127.0.0.1,.vercel.app"),
  rateLimitWindowSeconds: Number(process.env.RATE_LIMIT_WINDOW_SECONDS || 60),
  adminRateLimit: Number(process.env.ADMIN_RATE_LIMIT || 8),
  studentRateLimit: Number(process.env.STUDENT_RATE_LIMIT || 10),
  contactRateLimit: Number(process.env.CONTACT_RATE_LIMIT || 5),
  monitoringRateLimit: Number(process.env.MONITORING_RATE_LIMIT || 60),
  monitoringIngestKey: String(process.env.MONITORING_INGEST_KEY || "").trim(),
};

function secureEquals(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

const PASSWORD_HASH_PREFIX = "scrypt$v1";

function toBase64Url(buffer) {
  return Buffer.from(buffer).toString("base64url");
}

function fromBase64Url(value) {
  return Buffer.from(String(value || ""), "base64url");
}

export function isPasswordHash(value) {
  return String(value || "").startsWith(`${PASSWORD_HASH_PREFIX}$`);
}

export function hashPassword(password) {
  const plain = String(password || "");
  if (!plain) {
    throw new Error("Password cannot be empty");
  }
  const salt = randomBytes(16);
  const digest = scryptSync(plain, salt, 64);
  return `${PASSWORD_HASH_PREFIX}$${toBase64Url(salt)}$${toBase64Url(digest)}`;
}

function verifyPasswordHash(password, encoded) {
  const parts = String(encoded || "").split("$");
  if (parts.length !== 4 || `${parts[0]}$${parts[1]}` !== PASSWORD_HASH_PREFIX) {
    return false;
  }
  const salt = fromBase64Url(parts[2]);
  const expected = fromBase64Url(parts[3]);
  const actual = scryptSync(String(password || ""), salt, expected.length || 64);
  if (actual.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(actual, expected);
}

export function verifyPasswordValue(inputPassword, storedValue) {
  const stored = String(storedValue || "");
  if (!stored) {
    return false;
  }
  if (isPasswordHash(stored)) {
    return verifyPasswordHash(inputPassword, stored);
  }
  return secureEquals(inputPassword, stored);
}

function getSigningSecrets() {
  if (config.sessionSecret) {
    return [config.sessionSecret];
  }
  if (config.environment === "production") {
    return [];
  }
  const fallback = `dev-secret-${config.adminPassword}`;
  const secrets = [fallback].filter(Boolean);
  return [...new Set(secrets)];
}

function getPrimarySigningSecret() {
  const secrets = getSigningSecrets();
  if (secrets.length) {
    return secrets[0];
  }
  return `dev-secret-${config.adminPassword}`;
}

function signTokenPayload(payload, secret = getPrimarySigningSecret()) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function ensureSecureConfig() {
  if (config.environment !== "production") {
    return;
  }

  if (config.adminPassword === "change-me-123") {
    throw new Error("Set a strong ADMIN_PASSWORD for production.");
  }

  if (config.sessionSecret.length < 32) {
    throw new Error("Set ADMIN_SESSION_SECRET with at least 32 characters for production.");
  }
}

export function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export function makeLoginBucketKey(username, request) {
  return `${username}:${getClientIp(request)}`;
}

export function getOrCreateLoginBucket(store, key) {
  const existing = store.loginFailures[key];
  if (existing) {
    return existing;
  }

  const bucket = { count: 0, lockedUntil: 0 };
  store.loginFailures[key] = bucket;
  return bucket;
}

export function clearSessions() {
  // Stateless tokens are valid across serverless instances, so there is no in-memory session map to clear.
}

export function createSession(subject = {}) {
  const now = Math.floor(Date.now() / 1000);
  const role = subject.role || "admin";
  const expiresIn = role === "student" ? config.studentTokenTtlSeconds : config.tokenTtlSeconds;
  const payload = Buffer.from(
    JSON.stringify({
      exp: now + expiresIn,
      nonce: randomBytes(12).toString("base64url"),
      role,
      rollNumber: subject.rollNumber || "",
      name: subject.name || "",
      stream: subject.stream || "",
      className: subject.className || "",
    })
  ).toString("base64url");
  const signature = signTokenPayload(payload);

  return { token: `${payload}.${signature}`, expiresIn };
}

export function verifyToken(_store, authorizationHeader, requiredRole = null) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return { ok: false, status: 401, detail: "Missing or invalid token" };
  }

  const token = authorizationHeader.slice(7).trim();
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return { ok: false, status: 401, detail: "Session expired. Please login again." };
  }

  const validSignature = getSigningSecrets().some((secret) => secureEquals(signature, signTokenPayload(payload, secret)));
  if (!validSignature) {
    return { ok: false, status: 401, detail: "Session expired. Please login again." };
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);

    if (!decoded?.exp || now > decoded.exp) {
      return { ok: false, status: 401, detail: "Session expired. Please login again." };
    }

    if (requiredRole && decoded.role !== requiredRole) {
      return { ok: false, status: 403, detail: "You are not authorized to access this resource." };
    }

    return { ok: true, token, session: decoded };
  } catch {
    return { ok: false, status: 401, detail: "Session expired. Please login again." };
  }
}

export function verifyAdminCredentials(username, password) {
  return secureEquals(username, config.adminUsername) && verifyPasswordValue(password, config.adminPassword);
}

export function verifyStudentCredentials(store, rollNumber, password) {
  const student = (store.students || []).find((item) => secureEquals(item.rollNumber, rollNumber));
  if (!student) {
    return null;
  }

  const storedPassword = student.passwordHash || student.password || "";
  if (!verifyPasswordValue(password, storedPassword)) {
    return null;
  }

  return {
    rollNumber: student.rollNumber,
    name: student.name,
    className: student.className,
    stream: student.stream,
  };
}
