import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

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
  failedLoginLimit: Number(process.env.ADMIN_FAILED_LOGIN_LIMIT || 5),
  lockoutSeconds: Number(process.env.ADMIN_LOCKOUT_SECONDS || 60 * 5),
  sessionSecret: process.env.ADMIN_SESSION_SECRET || "",
  allowedHosts: parseCsv(process.env.ALLOWED_HOSTS, "localhost,127.0.0.1,.vercel.app"),
};

function secureEquals(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

function getSigningSecret() {
  return config.sessionSecret || `dev-secret-${config.adminPassword}`;
}

function signTokenPayload(payload) {
  return createHmac("sha256", getSigningSecret()).update(payload).digest("base64url");
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

export function createSession() {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = config.tokenTtlSeconds;
  const payload = Buffer.from(
    JSON.stringify({ exp: now + expiresIn, nonce: randomBytes(12).toString("base64url") })
  ).toString("base64url");
  const signature = signTokenPayload(payload);

  return { token: `${payload}.${signature}`, expiresIn };
}

export function verifyToken(_store, authorizationHeader) {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return { ok: false, status: 401, detail: "Missing or invalid token" };
  }

  const token = authorizationHeader.slice(7).trim();
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return { ok: false, status: 401, detail: "Session expired. Please login again." };
  }

  const expectedSignature = signTokenPayload(payload);
  if (!secureEquals(signature, expectedSignature)) {
    return { ok: false, status: 401, detail: "Session expired. Please login again." };
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);

    if (!decoded?.exp || now > decoded.exp) {
      return { ok: false, status: 401, detail: "Session expired. Please login again." };
    }
  } catch {
    return { ok: false, status: 401, detail: "Session expired. Please login again." };
  }

  return { ok: true, token };
}

export function verifyAdminCredentials(username, password) {
  return secureEquals(username, config.adminUsername) && secureEquals(password, config.adminPassword);
}
