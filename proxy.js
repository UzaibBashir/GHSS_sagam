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

export function proxy(request) {
  const response = NextResponse.next();
  const environment = (process.env.ENVIRONMENT || process.env.NODE_ENV || "").toLowerCase();
  const isProduction = environment === "production" || process.env.VERCEL_ENV === "production";

  const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const hostName = normalizeHost(hostHeader);
  const allowedHosts = parseAllowedHosts();

  // Keep strict host checks in production, but avoid blocking local/dev setups.
  if (isProduction && hostName && !hostAllowed(hostName, allowedHosts)) {
    return new NextResponse("Invalid host header", { status: 400 });
  }

  if (isProduction) {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
