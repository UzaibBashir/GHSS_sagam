import process from "node:process";

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD || "change-me-123";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function jsonRequest(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, init);
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  if (!response.ok) {
    throw new Error(`Request failed ${response.status} ${path}: ${body?.detail || "unknown error"}`);
  }
  return body;
}

function onePixelPngBytes() {
  const base64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9H4iEAAAAASUVORK5CYII=";
  return Uint8Array.from(Buffer.from(base64, "base64"));
}

async function uploadDummyImage(token) {
  const formData = new FormData();
  const blob = new Blob([onePixelPngBytes()], { type: "image/png" });
  formData.append("file", blob, "smoke-slide.png");

  const response = await fetch(`${baseUrl}/api/admin/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Upload failed ${response.status}: ${payload?.detail || "unknown error"}`);
  }

  const url = String(payload?.upload?.url || "").trim();
  assert(url, "Upload returned empty URL");
  return url;
}

async function run() {
  console.log("Smoke: admin login");
  const login = await jsonRequest("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: adminUsername, password: adminPassword }),
  });
  const token = String(login?.token || "").trim();
  assert(token, "Login token missing");

  console.log("Smoke: upload image");
  const uploadedUrl = await uploadDummyImage(token);

  const stamp = `smoke-${Date.now()}`;
  const slides = [
    {
      src: uploadedUrl,
      title: `Slide ${stamp}`,
      subtitle: `Subtitle ${stamp}`,
    },
  ];

  console.log("Smoke: update institute slideshow");
  await jsonRequest("/api/admin/institute", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ hero_slides: slides }),
  });

  console.log("Smoke: read admin institute");
  const adminInstitute = await jsonRequest("/api/admin/institute", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const adminSlides = Array.isArray(adminInstitute?.hero_slides) ? adminInstitute.hero_slides : [];
  assert(adminSlides.length >= 1, "Admin institute has no hero slides after update");
  assert(
    adminSlides.some((item) => String(item?.title || "") === `Slide ${stamp}`),
    "Saved hero slide missing in admin response"
  );

  console.log("Smoke: read public institute");
  const publicInstitute = await jsonRequest("/api/institute");
  const publicSlides = Array.isArray(publicInstitute?.hero_slides) ? publicInstitute.hero_slides : [];
  assert(publicSlides.length >= 1, "Public institute has no hero slides after update");
  assert(
    publicSlides.some((item) => String(item?.title || "") === `Slide ${stamp}`),
    "Saved hero slide missing in public response"
  );

  console.log("Smoke: update additional content");
  await jsonRequest("/api/admin/institute", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      home_front_desk: {
        title: `Desk ${stamp}`,
        items: ["Item A", "Item B"],
      },
    }),
  });

  const verify = await jsonRequest("/api/admin/institute", {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert(String(verify?.home_front_desk?.title || "") === `Desk ${stamp}`, "Institute detail update did not persist");

  console.log("Smoke PASS: admin upload + content update + readback verified");
}

run().catch((error) => {
  console.error(`Smoke FAIL: ${error.message}`);
  process.exit(1);
});

