import { randomBytes } from "node:crypto";

export function json(data, status = 200, headers = undefined) {
  const responseHeaders = new Headers(headers || {});
  responseHeaders.set("X-API-Version", "2026-03");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  return Response.json(data, { status, headers: responseHeaders });
}

export function error(detail, status = 400, headers = undefined) {
  return json({ detail }, status, headers);
}

export function createId(prefix) {
  return `${prefix}-${randomBytes(4).toString("hex")}`;
}

export function assertNonEmpty(field, value) {
  const text = String(value ?? "").trim();
  if (!text) {
    throw new Error(`${field} cannot be empty`);
  }
  return text;
}

export function assertOptionalHttpUrl(field, value) {
  const text = String(value ?? "").trim();
  if (!text) {
    return "";
  }
  if (!text.startsWith("http://") && !text.startsWith("https://")) {
    throw new Error(`${field} must start with http:// or https://`);
  }
  return text;
}

export function parseJsonBody(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    throw new Error("Content-Type must be application/json");
  }

  const maxBytes = Number(process.env.JSON_BODY_MAX_BYTES || 1024 * 1024);
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error("JSON payload is too large");
  }

  return request.json().catch(() => {
    throw new Error("Invalid JSON payload");
  });
}

export function findItemIndex(items, itemId) {
  const index = items.findIndex((item) => item.id === itemId);
  if (index < 0) {
    throw new Error("Item not found");
  }
  return index;
}
