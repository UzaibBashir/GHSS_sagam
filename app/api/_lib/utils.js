import { randomBytes } from "node:crypto";

export function json(data, status = 200, headers = undefined) {
  return Response.json(data, { status, headers });
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
