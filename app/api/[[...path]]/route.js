export const runtime = "nodejs";
import {
  clearSessions,
  config,
  createSession,
  ensureSecureConfig,
  getClientIp,
  getOrCreateLoginBucket,
  makeLoginBucketKey,
  verifyAdminCredentials,
  verifyStudentCredentials,
  verifyToken,
} from "../_lib/auth";
import { checkRateLimit, getStore, saveStore } from "../_lib/store";
import {
  assertNonEmpty,
  assertOptionalHttpUrl,
  createId,
  error,
  findItemIndex,
  json,
  parseJsonBody,
} from "../_lib/utils";
import { getDb } from "../_lib/mongodb";

async function getPath(params) {
  const resolvedParams = await params;
  return Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
}

function unauthorizedIfNeeded(request, store, requiredRole = null) {
  const result = verifyToken(store, request.headers.get("authorization") || "", requiredRole);
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
    admission_form_url: store.instituteData.admission_form_url || "/admission",
  };
}

function getPublicInstituteData(store) {
  return {
    ...store.instituteData,
    academic_content: undefined,
  };
}
function getAdminInstituteData(store) {
  const data = store.instituteData || {};
  return {
    name: data.name,
    tagline: data.tagline,
    description: data.description,
    about_us: data.about_us,
    institute_details: data.institute_details || [],
    academics: data.academics || [],
    faculties: data.faculties || [],
    streams_subjects: data.streams_subjects || [],
    staff: data.staff || [],
    facilities: data.facilities || [],
    contact: data.contact || {},
    hero_slides: data.hero_slides || [],
    home_highlights: data.home_highlights || { stats: [], reasons: [] },
    home_front_desk: data.home_front_desk || { title: "", items: [] },
    home_achievements: data.home_achievements || [],
    home_resources: data.home_resources || [],
    home_testimonials: data.home_testimonials || [],
    admission_content: data.admission_content || {
      sessionYear: "2026",
      guidelines: [],
      eligibility: [],
      requiredDocuments: [],
    },
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

function normalizeStudentPayload(payload) {
  return {
    rollNumber: assertNonEmpty("Roll number", payload.rollNumber),
    password: assertNonEmpty("Password", payload.password),
    name: assertNonEmpty("Student name", payload.name),
    className: assertNonEmpty("Class", payload.className),
    stream: assertNonEmpty("Stream", payload.stream),
  };
}
function normalizeStringList(items, label) {
  if (!Array.isArray(items)) {
    throw new Error(`${label} must be an array`);
  }
  return items
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function normalizePrograms(items) {
  if (!Array.isArray(items)) {
    throw new Error("Programs must be an array");
  }
  return items
    .map((item) => ({
      title: String(item?.title || "").trim(),
      description: String(item?.description || "").trim(),
    }))
    .filter((item) => item.title && item.description);
}

function normalizeFaculties(items) {
  if (!Array.isArray(items)) {
    throw new Error("Faculties must be an array");
  }
  return items
    .map((item) => ({
      name: String(item?.name || "").trim(),
      department: String(item?.department || "").trim() || "Faculty",
      qualification: String(item?.qualification || "").trim() || "Not specified",
      photo: String(item?.photo || "").trim(),
    }))
    .filter((item) => item.name);
}

function normalizeStreams(items) {
  if (!Array.isArray(items)) {
    throw new Error("Streams must be an array");
  }
  return items
    .map((item) => ({
      stream: String(item?.stream || "").trim(),
      subjects: (Array.isArray(item?.subjects) ? item.subjects : [])
        .map((subject) => String(subject || "").trim())
        .filter(Boolean),
    }))
    .filter((item) => item.stream && item.subjects.length);
}

function normalizeStaff(items) {
  if (!Array.isArray(items)) {
    throw new Error("Staff list must be an array");
  }
  return items
    .map((item) => ({
      name: String(item?.name || "").trim(),
      role: String(item?.role || "").trim(),
    }))
    .filter((item) => item.name && item.role);
}

function normalizeContact(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Contact details are required");
  }
  return {
    email: String(payload.email || "").trim(),
    phone: String(payload.phone || "").trim(),
    address: String(payload.address || "").trim(),
  };
}

function normalizeHomeHighlights(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Home highlights are required");
  }
  const stats = (Array.isArray(payload.stats) ? payload.stats : [])
    .map((item) => ({
      value: String(item?.value || "").trim(),
      label: String(item?.label || "").trim(),
    }))
    .filter((item) => item.value && item.label);
  const reasons = normalizeStringList(payload.reasons || [], "Highlight reason");
  return { stats, reasons };
}

function normalizeHomeFrontDesk(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Front desk content is required");
  }
  return {
    title: String(payload.title || "").trim() || "Visitor Essentials",
    items: normalizeStringList(payload.items || [], "Front desk item"),
  };
}

function normalizeHomeResources(items) {
  if (!Array.isArray(items)) {
    throw new Error("Home resources must be an array");
  }
  return items
    .map((item) => ({
      title: String(item?.title || "").trim(),
      description: String(item?.description || "").trim(),
      href: String(item?.href || "").trim(),
      label: String(item?.label || "").trim(),
    }))
    .filter((item) => item.title && item.description && item.href && item.label);
}

function normalizeHomeTestimonials(items) {
  if (!Array.isArray(items)) {
    throw new Error("Home testimonials must be an array");
  }
  return items
    .map((item) => ({
      name: String(item?.name || "").trim(),
      role: String(item?.role || "").trim(),
      quote: String(item?.quote || "").trim(),
    }))
    .filter((item) => item.name && item.role && item.quote);
}

function normalizeHeroSlides(items) {
  if (!Array.isArray(items)) {
    throw new Error("Hero slides must be an array");
  }
  return items
    .map((item) => ({
      src: String(item?.src || "").trim(),
      title: String(item?.title || "").trim(),
      subtitle: String(item?.subtitle || "").trim(),
    }))
    .filter((item) => item.src && item.title && item.subtitle);
}

function normalizeAdmissionContent(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Admission content is required");
  }
  return {
    sessionYear: String(payload.sessionYear || "").trim() || "2026",
    guidelines: normalizeStringList(payload.guidelines || [], "Admission guideline"),
    eligibility: normalizeStringList(payload.eligibility || [], "Admission eligibility"),
    requiredDocuments: normalizeStringList(payload.requiredDocuments || [], "Required document"),
  };
}
function normalizeAdmissionPayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Admission details are required");
  }
  return {
    name: assertNonEmpty("Student name", payload.name),
    dob: assertNonEmpty("Date of birth", payload.dob),
  };
}


function getFormText(formData, key) {
  return String(formData.get(key) || "").trim();
}

function getRequiredFormText(formData, key, label) {
  return assertNonEmpty(label, getFormText(formData, key));
}

function getFormList(formData, key) {
  return formData
    .getAll(key)
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

async function parseUploadedFile(formData, key, label, required = false) {
  const value = formData.get(key);
  const oneMb = 1024 * 1024;

  if (!value || typeof value === "string") {
    if (required) {
      throw new Error(`${label} is required`);
    }
    return null;
  }

  if (!value.size) {
    if (required) {
      throw new Error(`${label} is required`);
    }
    return null;
  }

  if (value.size > oneMb) {
    throw new Error(`${label} must be less than 1 MB`);
  }

  const data = Buffer.from(await value.arrayBuffer()).toString("base64");
  return {
    name: value.name || "upload",
    type: value.type || "application/octet-stream",
    size: value.size,
    data,
  };
}

async function normalizeMultipartAdmissionPayload(request) {
  const formData = await request.formData();
  const feesPaidVia = getRequiredFormText(formData, "fees_paid_via", "Fees paid via").toLowerCase();
  const classForAdmission = getRequiredFormText(formData, "class_for_admission", "Class for admission");
  const subjects = getFormList(formData, "subjects");

  if (!subjects.length) {
    throw new Error("At least one subject must be selected");
  }

  const stream = getFormText(formData, "stream");
  if ((classForAdmission === "11th" || classForAdmission === "12th") && !stream) {
    throw new Error("Stream is required for 11th and 12th classes");
  }

  return {
    name: getRequiredFormText(formData, "applicant_name", "Applicant name"),
    dob: getRequiredFormText(formData, "dob", "Date of birth"),
    form_data: {
      session_year: getFormText(formData, "session_year") || "2026",
      applicant_name: getRequiredFormText(formData, "applicant_name", "Applicant name"),
      father_name: getRequiredFormText(formData, "father_name", "Father's name"),
      mother_name: getRequiredFormText(formData, "mother_name", "Mother's name"),
      dob: getRequiredFormText(formData, "dob", "Date of birth"),
      dob_words: getFormText(formData, "dob_words"),
      permanent_address: getRequiredFormText(formData, "permanent_address", "Permanent address"),
      present_address: getRequiredFormText(formData, "present_address", "Present address"),
      parent_cell: getRequiredFormText(formData, "parent_cell", "Parent cell number"),
      email: getFormText(formData, "email"),
      aadhar_no: getRequiredFormText(formData, "aadhar_no", "Aadhar number"),
      blood_group: getFormText(formData, "blood_group") || "Not Known",
      height: getFormText(formData, "height"),
      weight: getFormText(formData, "weight"),
      parents_occupation: getFormText(formData, "parents_occupation"),
      family_income: getRequiredFormText(formData, "family_income", "Family income"),
      category: getRequiredFormText(formData, "category", "Category"),
      sub_category: getFormText(formData, "sub_category") || "APL",
      bank_account_no: getRequiredFormText(formData, "bank_account_no", "Bank account number"),
      ifsc_code: getFormText(formData, "ifsc_code"),
      class_for_admission: classForAdmission,
      stream,
      subjects,
      fees_paid_via: feesPaidVia,
      reference_no: getRequiredFormText(formData, "reference_no", "Reference number"),
    },
    uploads: {
      fees_proof: await parseUploadedFile(formData, "fees_proof", "Fees proof", feesPaidVia === "online"),
      aadhar_file: await parseUploadedFile(formData, "aadhar_file", "Aadhar upload", true),
      ration_card_file: await parseUploadedFile(formData, "ration_card_file", "Ration card upload", false),
      bank_copy_file: await parseUploadedFile(formData, "bank_copy_file", "Bank account copy", true),
      applicant_photo: await parseUploadedFile(formData, "applicant_photo", "Applicant photograph", true),
    },
  };
}

async function normalizeAdmissionSubmission(request) {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();
  if (contentType.includes("multipart/form-data")) {
    return normalizeMultipartAdmissionPayload(request);
  }

  const payload = await parseJsonBody(request);
  const basic = normalizeAdmissionPayload(payload);
  return {
    ...basic,
    form_data: {},
    uploads: {},
  };
}

function sanitizeAdmissionForAdmin(admission) {
  const uploads = admission.uploads || {};
  const files = Object.entries(uploads)
    .filter(([, file]) => Boolean(file))
    .map(([key, file]) => ({
      key,
      name: file.name || "",
      type: file.type || "",
      size: file.size || 0,
    }));

  return {
    application_id: admission.application_id,
    name: admission.name,
    dob: admission.dob,
    status: admission.status,
    remarks: admission.remarks || "",
    submitted_at: admission.submitted_at,
    approved_at: admission.approved_at || "",
    class_for_admission: admission.form_data?.class_for_admission || "",
    stream: admission.form_data?.stream || "",
    fees_paid_via: admission.form_data?.fees_paid_via || "",
    files,
  };
}
function matchesAdmissionIdentity(admission, name, dob) {
  return admission.name.toLowerCase() === name.toLowerCase() && admission.dob === dob;
}

function ensureUniqueRollNumber(students, rollNumber, currentRollNumber = "") {
  const duplicate = students.find(
    (item) => item.rollNumber === rollNumber && item.rollNumber !== currentRollNumber
  );
  if (duplicate) {
    throw new Error("A student with this roll number already exists.");
  }
}

function rateLimitOrReject(store, request, keyPrefix, limit) {
  const key = `${keyPrefix}:${getClientIp(request)}`;
  const result = checkRateLimit(store, key, limit, config.rateLimitWindowSeconds);

  if (!result.ok) {
    return error("Too many requests. Please try again shortly.", 429, {
      "Retry-After": String(result.retryAfter),
    });
  }

  return null;
}


async function persistAndJson(store, payload, status = 200, headers = undefined) {
  await saveStore(store);
  return json(payload, status, headers);
}

async function persistAndResponse(store, response) {
  await saveStore(store);
  return response;
}

export async function GET(request, context) {
  const path = await getPath(context?.params);

  if (path.length === 0) {
    return json({ message: "Institute API is running" });
  }

  if (path[0] === "health" && path.length === 1) {
    return json({ status: "ok" });
  }

  if (path[0] === "health" && path[1] === "db" && path.length === 2) {
    try {
      const db = await getDb();
      await db.command({ ping: 1 });
      return json({ status: "ok", database: "connected" });
    } catch (err) {
      return error(err instanceof Error ? `Database connection failed: ${err.message}` : "Database connection failed", 500);
    }
  }

  if (path[0] === "health" && path[1] === "db-write" && path.length === 2) {
    try {
      const db = await getDb();
      const collection = db.collection(process.env.MONGODB_STATE_COLLECTION || "app_state");
      await collection.updateOne({ _id: "__write_test__" }, { $set: { at: new Date().toISOString() } }, { upsert: true });
      const testDoc = await collection.findOne({ _id: "__write_test__" });
      return json({ status: "ok", database: "writeable", write_test: Boolean(testDoc) });
    } catch (err) {
      return error(err instanceof Error ? `Database write failed: ${err.message}` : "Database write failed", 500);
    }
  }

  let store;
  try {
    store = await getStore();
  } catch (err) {
    return error(err instanceof Error ? `Database connection failed: ${err.message}` : "Database connection failed", 500);
  }

  if (path[0] === "institute" && path.length === 1) {
    return json(getPublicInstituteData(store));
  }

  if (path[0] === "admissions" && path[1] === "status" && path.length === 2) {
    const url = new URL(request.url);
    const applicationId = String(url.searchParams.get("application_id") || "").trim();
    const name = String(url.searchParams.get("name") || "").trim();
    const dob = String(url.searchParams.get("dob") || "").trim();

    if (!applicationId || !name || !dob) {
      return error("Application ID, name, and date of birth are required", 400);
    }

    const admission = store.admissions.find((item) => item.application_id === applicationId);
    if (!admission || !matchesAdmissionIdentity(admission, name, dob)) {
      return error("Application not found", 404);
    }

    return json({
      application_id: admission.application_id,
      name: admission.name,
      dob: admission.dob,
      status: admission.status,
      remarks: admission.remarks || "",
      submitted_at: admission.submitted_at,
      approved_at: admission.approved_at || "",
    });
  }

  if (path[0] === "student") {
    const authError = unauthorizedIfNeeded(request, store, "student");
    if (authError) {
      return authError;
    }

    const verified = verifyToken(store, request.headers.get("authorization") || "", "student");

    if (path[1] === "session" && path.length === 2) {
      return json({
        authenticated: true,
        student: {
          rollNumber: verified.session.rollNumber,
          name: verified.session.name,
          className: verified.session.className,
          stream: verified.session.stream,
        },
      });
    }

    if (path[1] === "academics" && path[2] === "content" && path.length === 3) {
      const academicContent = store.instituteData.academic_content || {};
      const className = verified.session.className;
      const stream = verified.session.stream;
      const filteredMaterials = (academicContent.materials || [])
        .filter((item) => item.class_name === className)
        .map((item) => ({
          ...item,
          streams: (item.streams || []).filter((streamItem) => streamItem.stream === stream),
        }));

      return json({
        student: {
          rollNumber: verified.session.rollNumber,
          name: verified.session.name,
          className: verified.session.className,
          stream: verified.session.stream,
        },
        academic_content: {
          ...academicContent,
          noticeboard: (academicContent.noticeboard || []).filter(
            (item) => item.class_name === className && item.stream === stream
          ),
          timetable: (academicContent.timetable || []).filter(
            (item) => item.class_name === className && item.stream === stream
          ),
          materials: filteredMaterials,
        },
      });
    }

    return error("Not found", 404);
  }

  if (path[0] !== "admin") {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store, "admin");
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
  if (path[1] === "admissions" && path.length === 2) {
    return json(store.admissions);
  }
  if (path[1] === "institute" && path.length === 2) {
    return json(getAdminInstituteData(store));
  }

  if (path[1] === "students" && path.length === 2) {
    return json(store.students);
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
  const path = await getPath(context?.params);
  let store;
  try {
    store = await getStore();
  } catch (err) {
    return error(err instanceof Error ? `Database connection failed: ${err.message}` : "Database connection failed", 500);
  }

  if (path[0] === "admissions" && path.length === 1) {
    try {
      const applicant = await normalizeAdmissionSubmission(request);
      const admission = {
        application_id: createId("app"),
        name: applicant.name,
        dob: applicant.dob,
        status: "pending",
        remarks: "",
        submitted_at: new Date().toISOString(),
        approved_at: "",
        form_data: applicant.form_data || {},
        uploads: applicant.uploads || {},
      };
      store.admissions.unshift(admission);
      return persistAndJson(store, { success: true, ...sanitizeAdmissionForAdmin(admission) });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Invalid payload", 400);
    }
  }

  if (path[0] === "contact" && path.length === 1) {
    const rateError = rateLimitOrReject(store, request, "contact", config.contactRateLimit);
    if (rateError) {
      return persistAndResponse(store, rateError);
    }

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
      return persistAndJson(store, { success: true, message: "Thanks for contacting us. Our team will reach out soon." });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Invalid payload", 400);
    }
  }

  if (path[0] === "student" && path[1] === "login" && path.length === 2) {
    const rateError = rateLimitOrReject(store, request, "student-login", config.studentRateLimit);
    if (rateError) {
      return persistAndResponse(store, rateError);
    }

    try {
      const payload = await parseJsonBody(request);
      const rollNumber = String(payload.rollNumber || "").trim();
      const password = String(payload.password || "");
      const className = String(payload.className || "").trim();
      const stream = String(payload.stream || "").trim();
      const student = verifyStudentCredentials(store, rollNumber, password);

      if (!student) {
        return persistAndResponse(store, error("Invalid roll number or password", 401));
      }

      if (student.className !== className || student.stream !== stream) {
        return persistAndResponse(store, error("Selected class or stream does not match the student record", 401));
      }

      const session = createSession({ role: "student", ...student });
      return persistAndJson(store, { success: true, token: session.token, expires_in: session.expiresIn, student });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Login failed", 400);
    }
  }

  if (path[0] === "admin" && path[1] === "login" && path.length === 2) {
    try {
      ensureSecureConfig();
    } catch (err) {
      return safeAdminError(err);
    }

    const rateError = rateLimitOrReject(store, request, "admin-login", config.adminRateLimit);
    if (rateError) {
      return persistAndResponse(store, rateError);
    }

    try {
      const payload = await parseJsonBody(request);
      const username = String(payload.username || "").trim();
      const password = String(payload.password || "");
      const bucketKey = makeLoginBucketKey(username, request);
      const bucket = getOrCreateLoginBucket(store, bucketKey);
      const now = Math.floor(Date.now() / 1000);

      if (now < bucket.lockedUntil) {
        return persistAndResponse(store, error("Account temporarily locked. Please try again later.", 429));
      }

      if (!verifyAdminCredentials(username, password)) {
        bucket.count += 1;
        if (bucket.count >= config.failedLoginLimit) {
          bucket.count = 0;
          bucket.lockedUntil = now + config.lockoutSeconds;
          return persistAndResponse(store, error("Too many failed attempts. Try again in 5 minutes.", 429));
        }
        return persistAndResponse(store, error("Invalid username or password", 401));
      }

      store.loginFailures[bucketKey] = { count: 0, lockedUntil: 0 };
      clearSessions(store);
      const session = createSession({ role: "admin" });
      return persistAndJson(store, { success: true, token: session.token, expires_in: session.expiresIn });
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

  const authError = unauthorizedIfNeeded(request, store, "admin");
  if (authError) {
    return authError;
  }

  try {
    const payload = await parseJsonBody(request);

    if (path[1] === "students" && path.length === 2) {
      const student = normalizeStudentPayload(payload);
      ensureUniqueRollNumber(store.students, student.rollNumber);
      store.students.unshift(student);
      return persistAndJson(store, { success: true, student });
    }

    if (path[1] === "notices" && path.length === 2) {
      const text = assertNonEmpty("Notice", payload.text);
      store.instituteData.notices.unshift({ text });
      return persistAndJson(store, { success: true, message: "Notice published." });
    }

    if (path[1] === "downloads" && path.length === 2) {
      const title = assertNonEmpty("Title", payload.title);
      const url = assertNonEmpty("URL", payload.url);
      store.instituteData.downloads.unshift({ title, url });
      return persistAndJson(store, { success: true, message: "Download item added." });
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
      return persistAndJson(store, { success: true, item });
    }

    if (path[1] === "academics" && path[2] === "noticeboard" && path.length === 3) {
      const item = {
        id: createId("an"),
        headline: assertNonEmpty("Headline", payload.headline),
        description: assertNonEmpty("Description", payload.description),
        time: assertNonEmpty("Time", payload.time),
        class_name: assertNonEmpty("Class", payload.class_name),
        stream: assertNonEmpty("Stream", payload.stream),
        image_url: assertOptionalHttpUrl("Image URL", payload.image_url),
        link_label: String(payload.link_label || "").trim(),
        link_url: assertOptionalHttpUrl("Link URL", payload.link_url),
      };

      if (item.link_url && !item.link_label) {
        return error("Link label is required when link URL is provided", 400);
      }

      store.instituteData.academic_content.noticeboard.unshift(item);
      return persistAndJson(store, { success: true, item });
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
      return persistAndJson(store, { success: true, item });
    }

    return error("Not found", 404);
  } catch (err) {
    return error(err instanceof Error ? err.message : "Invalid payload", 400);
  }
}

export async function PATCH(request, context) {
  const path = await getPath(context?.params);
  let store;
  try {
    store = await getStore();
  } catch (err) {
    return error(err instanceof Error ? `Database connection failed: ${err.message}` : "Database connection failed", 500);
  }

  const isControls = path[0] === "admin" && path[1] === "controls" && path.length === 2;
  const isInstitute = path[0] === "admin" && path[1] === "institute" && path.length === 2;
  const isAdmissions = path[0] === "admin" && path[1] === "admissions" && path.length === 3;

  if (!isControls && !isInstitute && !isAdmissions) {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store, "admin");
  if (authError) {
    return authError;
  }

  try {
    const payload = await parseJsonBody(request);

    if (isAdmissions) {
      const admission = store.admissions.find((item) => item.application_id === path[2]);
      if (!admission) {
        return error("Application not found", 404);
      }
      if (payload.status !== undefined) {
        const status = String(payload.status || "").trim().toLowerCase();
        if (!["pending", "approved", "rejected"].includes(status)) {
          return error("Invalid status", 400);
        }
        admission.status = status;
        if (status === "approved") {
          admission.approved_at = new Date().toISOString();
        }
      }
      if (payload.remarks !== undefined) {
        admission.remarks = String(payload.remarks || "").trim();
      }
      return persistAndJson(store, { success: true, admission: sanitizeAdmissionForAdmin(admission) });
    }

    if (isInstitute) {
      const data = store.instituteData;

      if (payload.description !== undefined) data.description = String(payload.description || "").trim();
      if (payload.about_us !== undefined) data.about_us = String(payload.about_us || "").trim();
      if (payload.institute_details !== undefined) {
        data.institute_details = normalizeStringList(payload.institute_details, "Institute detail");
      }
      if (payload.academics !== undefined) data.academics = normalizePrograms(payload.academics);
      if (payload.faculties !== undefined) data.faculties = normalizeFaculties(payload.faculties);
      if (payload.streams_subjects !== undefined) data.streams_subjects = normalizeStreams(payload.streams_subjects);
      if (payload.staff !== undefined) data.staff = normalizeStaff(payload.staff);
      if (payload.facilities !== undefined) data.facilities = normalizeStringList(payload.facilities, "Facility");
      if (payload.contact !== undefined) data.contact = normalizeContact(payload.contact);
      if (payload.home_highlights !== undefined) data.home_highlights = normalizeHomeHighlights(payload.home_highlights);
      if (payload.home_front_desk !== undefined) data.home_front_desk = normalizeHomeFrontDesk(payload.home_front_desk);
      if (payload.home_achievements !== undefined) {
        data.home_achievements = normalizeStringList(payload.home_achievements, "Achievement");
      }
      if (payload.home_resources !== undefined) data.home_resources = normalizeHomeResources(payload.home_resources);
      if (payload.home_testimonials !== undefined) {
        data.home_testimonials = normalizeHomeTestimonials(payload.home_testimonials);
      }
      if (payload.hero_slides !== undefined) data.hero_slides = normalizeHeroSlides(payload.hero_slides);
      if (payload.admission_content !== undefined) {
        data.admission_content = normalizeAdmissionContent(payload.admission_content);
      }

      return persistAndJson(store, { success: true, institute: getAdminInstituteData(store) });
    }
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
      if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
        return error("Admission form URL must start with http://, https://, or /", 400);
      }
      store.instituteData.admission_form_url = url;
    }

    return persistAndJson(store, { success: true, message: "Controls updated.", ...getControls(store) });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Invalid payload", 400);
  }
}

export async function PUT(request, context) {
  const path = await getPath(context?.params);
  let store;
  try {
    store = await getStore();
  } catch (err) {
    return error(err instanceof Error ? `Database connection failed: ${err.message}` : "Database connection failed", 500);
  }

  if (path[0] !== "admin") {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store, "admin");
  if (authError) {
    return authError;
  }

  try {
    const payload = await parseJsonBody(request);

    if (path[1] === "students" && path.length === 3) {
      const student = normalizeStudentPayload(payload);
      const index = store.students.findIndex((item) => item.rollNumber === path[2]);
      if (index === -1) {
        return error("Student not found", 404);
      }
      ensureUniqueRollNumber(store.students, student.rollNumber, path[2]);
      store.students[index] = student;
      return persistAndJson(store, { success: true, student });
    }
    if (path[1] === "notices" && path.length === 3) {
      const index = parseIndex(path[2], "Notice");
      if (index >= store.instituteData.notices.length) {
        return error("Notice not found", 404);
      }
      const textValue = assertNonEmpty("Notice", payload.text);
      store.instituteData.notices[index] = { text: textValue };
      return persistAndJson(store, { success: true, notice: store.instituteData.notices[index] });
    }

    if (path[1] === "downloads" && path.length === 3) {
      const index = parseIndex(path[2], "Download item");
      if (index >= store.instituteData.downloads.length) {
        return error("Download item not found", 404);
      }
      const title = assertNonEmpty("Title", payload.title);
      const url = assertNonEmpty("URL", payload.url);
      store.instituteData.downloads[index] = { title, url };
      return persistAndJson(store, { success: true, download: store.instituteData.downloads[index] });
    }

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

      return persistAndJson(store, { success: true, item: current });
    }

    if (path[1] === "academics" && path[2] === "noticeboard" && path.length === 4) {
      const items = store.instituteData.academic_content.noticeboard;
      const index = findItemIndex(items, path[3]);
      const current = items[index];

      if (payload.headline !== undefined) current.headline = assertNonEmpty("Headline", payload.headline);
      if (payload.description !== undefined) current.description = assertNonEmpty("Description", payload.description);
      if (payload.time !== undefined) current.time = assertNonEmpty("Time", payload.time);
      if (payload.class_name !== undefined) current.class_name = assertNonEmpty("Class", payload.class_name);
      if (payload.stream !== undefined) current.stream = assertNonEmpty("Stream", payload.stream);
      if (payload.image_url !== undefined) current.image_url = assertOptionalHttpUrl("Image URL", payload.image_url);
      if (payload.link_label !== undefined) current.link_label = String(payload.link_label || "").trim();
      if (payload.link_url !== undefined) current.link_url = assertOptionalHttpUrl("Link URL", payload.link_url);

      if (current.link_url && !current.link_label) {
        return error("Link label is required when link URL is provided", 400);
      }

      return persistAndJson(store, { success: true, item: current });
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

      return persistAndJson(store, { success: true, item: current });
    }

    if (path[1] === "academics" && path[2] === "materials" && path.length === 3) {
      if (!Array.isArray(payload.materials)) {
        return error("materials must be an array", 400);
      }
      store.instituteData.academic_content.materials = payload.materials;
      return persistAndJson(store, { success: true, materials: store.instituteData.academic_content.materials });
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
  const path = await getPath(context?.params);
  let store;
  try {
    store = await getStore();
  } catch (err) {
    return error(err instanceof Error ? `Database connection failed: ${err.message}` : "Database connection failed", 500);
  }

  if (path[0] !== "admin") {
    return error("Not found", 404);
  }

  try {
    ensureSecureConfig();
  } catch (err) {
    return safeAdminError(err);
  }

  const authError = unauthorizedIfNeeded(request, store, "admin");
  if (authError) {
    return authError;
  }

  try {
    if (path[1] === "students" && path.length === 3) {
      const index = store.students.findIndex((item) => item.rollNumber === path[2]);
      if (index === -1) {
        return error("Student not found", 404);
      }
      store.students.splice(index, 1);
      return persistAndJson(store, { success: true, message: "Student removed." });
    }

    if (path[1] === "notices" && path.length === 3) {
      const index = parseIndex(path[2], "Notice");
      if (index >= store.instituteData.notices.length) {
        return error("Notice not found", 404);
      }
      store.instituteData.notices.splice(index, 1);
      return persistAndJson(store, { success: true, message: "Notice removed." });
    }

    if (path[1] === "downloads" && path.length === 3) {
      const index = parseIndex(path[2], "Download item");
      if (index >= store.instituteData.downloads.length) {
        return error("Download item not found", 404);
      }
      store.instituteData.downloads.splice(index, 1);
      return persistAndJson(store, { success: true, message: "Download item removed." });
    }

    if (path[1] === "contacts" && path.length === 2) {
      store.contacts = [];
      return persistAndJson(store, { success: true, message: "All enquiries cleared." });
    }

    if (path[1] === "notification-items" && path.length === 3) {
      const index = findItemIndex(store.instituteData.notification_items, path[2]);
      store.instituteData.notification_items.splice(index, 1);
      return persistAndJson(store, { success: true, message: "Notification deleted." });
    }

    if (path[1] === "academics" && path[2] === "noticeboard" && path.length === 4) {
      const index = findItemIndex(store.instituteData.academic_content.noticeboard, path[3]);
      store.instituteData.academic_content.noticeboard.splice(index, 1);
      return persistAndJson(store, { success: true, message: "Noticeboard item deleted." });
    }

    if (path[1] === "academics" && path[2] === "timetable" && path.length === 4) {
      const index = findItemIndex(store.instituteData.academic_content.timetable, path[3]);
      store.instituteData.academic_content.timetable.splice(index, 1);
      return persistAndJson(store, { success: true, message: "Timetable item deleted." });
    }

    return error("Not found", 404);
  } catch (err) {
    if (err instanceof Error && err.message === "Item not found") {
      return error(err.message, 404);
    }
    return error(err instanceof Error ? err.message : "Invalid request", 400);
  }
}






















































