import { NextResponse } from "next/server";

const defaultAllowedHosts = ["localhost", "127.0.0.1", ".vercel.app"];

function parseAllowedHosts() {
  const value = process.env.ALLOWED_HOSTS || defaultAllowedHosts.join(",");
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
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

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");

  if ((process.env.ENVIRONMENT || process.env.NODE_ENV) === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  const hostHeader = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  const hostName = hostHeader.split(":")[0].toLowerCase();
  const allowedHosts = parseAllowedHosts();

  if (hostName && !hostAllowed(hostName, allowedHosts)) {
    return new NextResponse("Invalid host header", { status: 400 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
