const SITE_URL = String(process.env.NEXT_PUBLIC_SITE_URL || "https://ghhssagam.in").trim().replace(/\/+$/, "");

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admission/receipt"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
