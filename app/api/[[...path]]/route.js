import {
  clearSessions,
  config,
  createSession,
  ensureSecureConfig,
  getOrCreateLoginBucket,
  makeLoginBucketKey,
  verifyAdminCredentials,
  verifyToken,
} from "../_lib/auth";
import { getStore } from "../_lib/store";
import {
  assertNonEmpty,
  assertOptionalHttpUrl,
  createId,
  error,
  findItemIndex,
  json,
  parseJsonBody,
} from "../_lib/utils";

function getPath(params) {
  return Array.isArray(params?.path) ? params.path : [];
}

function unauthorizedIfNeeded(request, store) {
  const result = verifyToken(store, request.headers.get("authorization") || "");
  if (!result.ok) {
    return error(result.detail, result.status);
  }
  return null;
}

function getControls(store) {
  const controls = store.instituteData.site_controls;
  return {
    notifications_page_enabled: Boolean(controls.notifications_page_enabled),
    academics_page_enabled: Boolean(controls.academics_page_enabled),
    admission_open: Boolean(controls.admission_open),
    admission_form_url: store.instituteData.admission_form_url || "https://forms.google.com",
  };
}

function parseIndex(value, label) {
  const index = Number(value);
  if (!Number.isInteger(index) || index < 0) {
    throw new Error(`${label} not found`);
  }
  return index;
}

function safeAdminError(err) {
  if (err instanceof Error) {
    if (err.message === "Set a strong ADMIN_PASSWORD for production.") {
      return error(err.message, 500);
    }
    if (err.message === "Set ADMIN_SESSION_SECRET with at least 32 characters for production.") {
      return error(err.message, 500);
    }
  }
  return null;
}

export async function GET(request, context) {
  const path = getPath(context?.params);
  const store = getStore();

  if (path.length === 0) {
    return json({ message: "Institute API is running" });
  }

  if (path[0] === "health" && path.length === 1) {
    return json({ status: "ok" });
  }

  if (path[0] === "institute" && path.length === 1) {
    return json(store.instituteData);
  }

  if (path[0] !== "admin") {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store);
  if (authError) {
    return authError;
  }

  if (path[1] === "notices" && path.length === 2) {
    return json(store.instituteData.notices.map((notice, index) => ({ index, text: notice.text })));
  }

  if (path[1] === "downloads" && path.length === 2) {
    return json(store.instituteData.downloads.map((item, index) => ({ index, ...item })));
  }

  if (path[1] === "contacts" && path.length === 2) {
    return json(store.contacts);
  }

  if (path[1] === "controls" && path.length === 2) {
    return json(getControls(store));
  }

  if (path[1] === "notification-items" && path.length === 2) {
    return json(store.instituteData.notification_items);
  }

  if (path[1] === "academics" && path[2] === "content" && path.length === 3) {
    return json(store.instituteData.academic_content);
  }

  if (path[1] === "academics" && path[2] === "noticeboard" && path.length === 3) {
    return json(store.instituteData.academic_content.noticeboard);
  }

  if (path[1] === "academics" && path[2] === "timetable" && path.length === 3) {
    return json(store.instituteData.academic_content.timetable);
  }

  if (path[1] === "academics" && path[2] === "materials" && path.length === 3) {
    return json({ materials: store.instituteData.academic_content.materials });
  }

  return error("Not found", 404);
}

export async function POST(request, context) {
  const path = getPath(context?.params);
  const store = getStore();

  if (path[0] === "contact" && path.length === 1) {
    try {
      const payload = await parseJsonBody(request);
      const contact = {
        full_name: assertNonEmpty("Full name", payload.full_name),
        email: assertNonEmpty("Email", payload.email),
        phone: assertNonEmpty("Phone", payload.phone),
        program_interest: assertNonEmpty("Program interest", payload.program_interest),
        message: assertNonEmpty("Message", payload.message),
      };
      store.contacts.push(contact);
      return json({ success: true, message: "Thanks for contacting us. Our team will reach out soon." });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Invalid payload", 400);
    }
  }

  if (path[0] === "admin" && path[1] === "login" && path.length === 2) {
    try {
      ensureSecureConfig();
    } catch (err) {
      return safeAdminError(err);
    }

    try {
      const payload = await parseJsonBody(request);
      const username = String(payload.username || "").trim();
      const password = String(payload.password || "");
      const bucketKey = makeLoginBucketKey(username, request);
      const bucket = getOrCreateLoginBucket(store, bucketKey);
      const now = Math.floor(Date.now() / 1000);

      if (now < bucket.lockedUntil) {
        return error("Account temporarily locked. Please try again later.", 429);
      }

      if (!verifyAdminCredentials(username, password)) {
        bucket.count += 1;
        if (bucket.count >= config.failedLoginLimit) {
          bucket.count = 0;
          bucket.lockedUntil = now + config.lockoutSeconds;
          return error("Too many failed attempts. Try again in 5 minutes.", 429);
        }
        return error("Invalid username or password", 401);
      }

      store.loginFailures[bucketKey] = { count: 0, lockedUntil: 0 };
      clearSessions(store);
      const session = createSession(store);
      return json({ success: true, token: session.token, expires_in: session.expiresIn });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Login failed", 400);
    }
  }

  if (path[0] !== "admin") {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store);
  if (authError) {
    return authError;
  }

  try {
    const payload = await parseJsonBody(request);

    if (path[1] === "notices" && path.length === 2) {
      const text = assertNonEmpty("Notice", payload.text);
      store.instituteData.notices.unshift({ text });
      return json({ success: true, message: "Notice published." });
    }

    if (path[1] === "downloads" && path.length === 2) {
      const title = assertNonEmpty("Title", payload.title);
      const url = assertNonEmpty("URL", payload.url);
      store.instituteData.downloads.unshift({ title, url });
      return json({ success: true, message: "Download item added." });
    }

    if (path[1] === "notification-items" && path.length === 2) {
      const item = {
        id: createId("n"),
        title: assertNonEmpty("Title", payload.title),
        category: assertNonEmpty("Category", payload.category),
        date: assertNonEmpty("Date", payload.date),
        summary: assertNonEmpty("Summary", payload.summary),
        details: assertNonEmpty("Details", payload.details),
        image_url: assertOptionalHttpUrl("Image URL", payload.image_url),
        link_label: String(payload.link_label || "").trim(),
        link_url: assertOptionalHttpUrl("Link URL", payload.link_url),
      };

      if (item.link_url && !item.link_label) {
        return error("Link label is required when link URL is provided", 400);
      }

      store.instituteData.notification_items.unshift(item);
      return json({ success: true, item });
    }

    if (path[1] === "academics" && path[2] === "noticeboard" && path.length === 3) {
      const item = {
        id: createId("an"),
        headline: assertNonEmpty("Headline", payload.headline),
        description: assertNonEmpty("Description", payload.description),
        time: assertNonEmpty("Time", payload.time),
        image_url: assertOptionalHttpUrl("Image URL", payload.image_url),
        link_label: String(payload.link_label || "").trim(),
        link_url: assertOptionalHttpUrl("Link URL", payload.link_url),
      };

      if (item.link_url && !item.link_label) {
        return error("Link label is required when link URL is provided", 400);
      }

      store.instituteData.academic_content.noticeboard.unshift(item);
      return json({ success: true, item });
    }

    if (path[1] === "academics" && path[2] === "timetable" && path.length === 3) {
      const item = {
        id: createId("tt"),
        period: assertNonEmpty("Period", payload.period),
        time: assertNonEmpty("Time", payload.time),
        detail: assertNonEmpty("Detail", payload.detail),
        class_name: assertNonEmpty("Class", payload.class_name),
        stream: assertNonEmpty("Stream", payload.stream),
      };

      store.instituteData.academic_content.timetable.push(item);
      return json({ success: true, item });
    }

    return error("Not found", 404);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Invalid payload", 400);
  }
}

export async function PATCH(request, context) {
  const path = getPath(context?.params);
  const store = getStore();

  if (!(path[0] === "admin" && path[1] === "controls" && path.length === 2)) {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store);
  if (authError) {
    return authError;
  }

  try {
    const payload = await parseJsonBody(request);
    const controls = store.instituteData.site_controls;

    if (payload.notifications_page_enabled !== undefined) {
      controls.notifications_page_enabled = Boolean(payload.notifications_page_enabled);
    }

    if (payload.academics_page_enabled !== undefined) {
      controls.academics_page_enabled = Boolean(payload.academics_page_enabled);
    }

    if (payload.admission_open !== undefined) {
      controls.admission_open = Boolean(payload.admission_open);
    }

    if (payload.admission_form_url !== undefined) {
      const url = assertNonEmpty("Admission form URL", payload.admission_form_url);
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        return error("Admission form URL must start with http:// or https://", 400);
      }
      store.instituteData.admission_form_url = url;
    }

    return json({ success: true, message: "Controls updated.", ...getControls(store) });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Invalid payload", 400);
  }
}

export async function PUT(request, context) {
  const path = getPath(context?.params);
  const store = getStore();

  if (path[0] !== "admin") {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store);
  if (authError) {
    return authError;
  }

  try {
    const payload = await parseJsonBody(request);

    if (path[1] === "notification-items" && path.length === 3) {
      const items = store.instituteData.notification_items;
      const index = findItemIndex(items, path[2]);
      const current = items[index];

      if (payload.title !== undefined) current.title = assertNonEmpty("Title", payload.title);
      if (payload.category !== undefined) current.category = assertNonEmpty("Category", payload.category);
      if (payload.date !== undefined) current.date = assertNonEmpty("Date", payload.date);
      if (payload.summary !== undefined) current.summary = assertNonEmpty("Summary", payload.summary);
      if (payload.details !== undefined) current.details = assertNonEmpty("Details", payload.details);
      if (payload.image_url !== undefined) current.image_url = assertOptionalHttpUrl("Image URL", payload.image_url);
      if (payload.link_label !== undefined) current.link_label = String(payload.link_label || "").trim();
      if (payload.link_url !== undefined) current.link_url = assertOptionalHttpUrl("Link URL", payload.link_url);

      if (current.link_url && !current.link_label) {
        return error("Link label is required when link URL is provided", 400);
      }

      return json({ success: true, item: current });
    }

    if (path[1] === "academics" && path[2] === "noticeboard" && path.length === 4) {
      const items = store.instituteData.academic_content.noticeboard;
      const index = findItemIndex(items, path[3]);
      const current = items[index];

      if (payload.headline !== undefined) current.headline = assertNonEmpty("Headline", payload.headline);
      if (payload.description !== undefined)
        current.description = assertNonEmpty("Description", payload.description);
      if (payload.time !== undefined) current.time = assertNonEmpty("Time", payload.time);
      if (payload.image_url !== undefined) current.image_url = assertOptionalHttpUrl("Image URL", payload.image_url);
      if (payload.link_label !== undefined) current.link_label = String(payload.link_label || "").trim();
      if (payload.link_url !== undefined) current.link_url = assertOptionalHttpUrl("Link URL", payload.link_url);

      if (current.link_url && !current.link_label) {
        return error("Link label is required when link URL is provided", 400);
      }

      return json({ success: true, item: current });
    }

    if (path[1] === "academics" && path[2] === "timetable" && path.length === 4) {
      const items = store.instituteData.academic_content.timetable;
      const index = findItemIndex(items, path[3]);
      const current = items[index];

      if (payload.period !== undefined) current.period = assertNonEmpty("Period", payload.period);
      if (payload.time !== undefined) current.time = assertNonEmpty("Time", payload.time);
      if (payload.detail !== undefined) current.detail = assertNonEmpty("Detail", payload.detail);
      if (payload.class_name !== undefined) current.class_name = assertNonEmpty("Class", payload.class_name);
      if (payload.stream !== undefined) current.stream = assertNonEmpty("Stream", payload.stream);

      return json({ success: true, item: current });
    }

    if (path[1] === "academics" && path[2] === "materials" && path.length === 3) {
      if (!Array.isArray(payload.materials)) {
        return error("materials must be an array", 400);
      }
      store.instituteData.academic_content.materials = payload.materials;
      return json({ success: true, materials: store.instituteData.academic_content.materials });
    }

    return error("Not found", 404);
  } catch (err) {
    if (err instanceof Error && err.message === "Item not found") {
      return error(err.message, 404);
    }
    return error(err instanceof Error ? err.message : "Invalid payload", 400);
  }
}

export async function DELETE(request, context) {
  const path = getPath(context?.params);
  const store = getStore();

  if (path[0] !== "admin") {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store);
  if (authError) {
    return authError;
  }

  try {
    if (path[1] === "notices" && path.length === 3) {
      const index = parseIndex(path[2], "Notice");
      if (index >= store.instituteData.notices.length) {
        return error("Notice not found", 404);
      }
      store.instituteData.notices.splice(index, 1);
      return json({ success: true, message: "Notice removed." });
    }

    if (path[1] === "downloads" && path.length === 3) {
      const index = parseIndex(path[2], "Download item");
      if (index >= store.instituteData.downloads.length) {
        return error("Download item not found", 404);
      }
      store.instituteData.downloads.splice(index, 1);
      return json({ success: true, message: "Download item removed." });
    }

    if (path[1] === "contacts" && path.length === 2) {
      store.contacts = [];
      return json({ success: true, message: "All enquiries cleared." });
    }

    if (path[1] === "notification-items" && path.length === 3) {
      const index = findItemIndex(store.instituteData.notification_items, path[2]);
      store.instituteData.notification_items.splice(index, 1);
      return json({ success: true, message: "Notification deleted." });
    }

    if (path[1] === "academics" && path[2] === "noticeboard" && path.length === 4) {
      const index = findItemIndex(store.instituteData.academic_content.noticeboard, path[3]);
      store.instituteData.academic_content.noticeboard.splice(index, 1);
      return json({ success: true, message: "Noticeboard item deleted." });
    }

    if (path[1] === "academics" && path[2] === "timetable" && path.length === 4) {
      const index = findItemIndex(store.instituteData.academic_content.timetable, path[3]);
      store.instituteData.academic_content.timetable.splice(index, 1);
      return json({ success: true, message: "Timetable item deleted." });
    }

    return error("Not found", 404);
  } catch (err) {
    if (err instanceof Error && err.message === "Item not found") {
      return error(err.message, 404);
    }
    return error(err instanceof Error ? err.message : "Invalid request", 400);
  }
}
