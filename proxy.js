import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

const defaultAllowedHosts = ["localhost", "127.0.0.1", ".vercel.app"];

function normalizeHost(value) {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .split(",")[0]
    .split("/")[0]
    .split(":")[0];
}

function parseAllowedHosts() {
  const envHosts = (process.env.ALLOWED_HOSTS || "")
    .split(",")
    .map((item) => normalizeHost(item))
    .filter(Boolean);

  const deploymentHosts = [
    normalizeHost(process.env.VERCEL_URL),
    normalizeHost(process.env.VERCEL_BRANCH_URL),
    normalizeHost(process.env.VERCEL_PROJECT_PRODUCTION_URL),
  ].filter(Boolean);

  return [...new Set([...defaultAllowedHosts, ...envHosts, ...deploymentHosts])];
}

function hostAllowed(hostname, allowlist) {
  if (allowlist.includes("*")) {
    return true;
  }

  return allowlist.some((allowed) => {
    if (allowed.startsWith(".")) {
      return hostname.endsWith(allowed);
    }
    return hostname === allowed;
  });
}

function createNonce() {
  return randomBytes(16).toString("base64");
}

function buildCsp({ isProduction }) {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    "img-src 'self' data: blob: https://images.unsplash.com https://images.meesho.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    `script-src 'self' 'unsafe-inline'${isProduction ? "" : " 'unsafe-eval'"}`,
    `connect-src 'self'${isProduction ? "" : " ws: wss:"}`,
    "frame-src https://maps.google.com https://www.google.com",
    "worker-src 'self' blob:",
  ];
  if (isProduction) {
    directives.push("upgrade-insecure-requests");
  }
  return directives.join("; ");
}

export function proxy(request) {
  const nonce = createNonce();
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  const environment = (process.env.ENVIRONMENT || process.env.NODE_ENV || "").toLowerCase();
  const isProduction = environment === "production" || process.env.VERCEL_ENV === "production";
  const strictHostCheck = String(process.env.STRICT_HOST_CHECK || "0").trim() === "1";

  const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const hostName = normalizeHost(hostHeader);
  const allowedHosts = parseAllowedHosts();

  // Keep strict host checks in production, but avoid blocking local/dev setups.
  if (isProduction && strictHostCheck && hostName && !hostAllowed(hostName, allowedHosts)) {
    return new NextResponse("Invalid host header", { status: 400 });
  }

  response.headers.set("Content-Security-Policy", buildCsp({ isProduction }));
  response.headers.set("x-nonce", nonce);

  if (isProduction) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
