const SITE_URL = String(process.env.NEXT_PUBLIC_SITE_URL || "https://ghss-sagam.vercel.app").trim().replace(/\/+$/, "");

export default function sitemap() {
  const now = new Date();
  const staticRoutes = [
    "/",
    "/about",
    "/academics",
    "/admission",
    "/admission/apply",
    "/admission/status",
    "/contact",
    "/download",
    "/notifications",
  ];

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
