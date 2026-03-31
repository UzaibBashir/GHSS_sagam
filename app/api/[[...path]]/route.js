export const runtime = "nodejs";
import {
  clearSessions,
  config,
  createSession,
  ensureSecureConfig,
  getClientIp,
  getOrCreateLoginBucket,
  hashPassword,
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
import { loadStoredMedia, saveUploadedBuffer } from "../_lib/storage";

const PUBLIC_INSTITUTE_CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";
const MAX_ADMISSION_MULTIPART_BYTES = Number(process.env.ADMISSION_MULTIPART_MAX_BYTES || 6 * 1024 * 1024);
const MAX_ADMIN_IMAGE_UPLOAD_BYTES = Number(process.env.ADMIN_IMAGE_UPLOAD_MAX_BYTES || 2 * 1024 * 1024);
const MAX_MONITORING_POINTS = Number(process.env.MONITORING_MAX_POINTS || 500);
const MAX_BACKUP_SNAPSHOTS = Number(process.env.BACKUP_MAX_SNAPSHOTS || 20);
const BACKUP_VERSION = "2026-03-v1";

function boundedPush(list, item, limit = MAX_MONITORING_POINTS) {
  list.push(item);
  if (list.length > limit) {
    list.splice(0, list.length - limit);
  }
}

function extractBackupPayload(store) {
  return {
    contacts: structuredClone(store.contacts || []),
    admissions: structuredClone(store.admissions || []),
    students: structuredClone(store.students || []),
    instituteData: structuredClone(store.instituteData || {}),
  };
}

function createBackupSnapshot(store, label = "Manual snapshot") {
  return {
    id: createId("backup"),
    label: String(label || "Manual snapshot").trim() || "Manual snapshot",
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    payload: extractBackupPayload(store),
  };
}

function applyBackupSnapshot(store, snapshot) {
  const payload = snapshot?.payload || {};
  store.contacts = Array.isArray(payload.contacts) ? structuredClone(payload.contacts) : [];
  store.admissions = Array.isArray(payload.admissions) ? structuredClone(payload.admissions) : [];
  store.students = Array.isArray(payload.students) ? structuredClone(payload.students) : [];
  store.instituteData = payload.instituteData && typeof payload.instituteData === "object" ? structuredClone(payload.instituteData) : {};
}

function percentile(values, point) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil((point / 100) * sorted.length) - 1));
  return Number(sorted[index].toFixed(2));
}

function buildMonitoringSummary(store) {
  const apiLatency = store.monitoring?.apiLatency || [];
  const webVitals = store.monitoring?.webVitals || [];
  const latencyValues = apiLatency
    .map((item) => Number(item.durationMs || 0))
    .filter((value) => Number.isFinite(value) && value >= 0);

  const latestApiLatency = apiLatency.slice(-30).reverse();
  const latestWebVitals = webVitals.slice(-30).reverse();

  return {
    api: {
      count: latencyValues.length,
      p50: percentile(latencyValues, 50),
      p95: percentile(latencyValues, 95),
      latest: latestApiLatency,
    },
    webVitals: {
      count: webVitals.length,
      latest: latestWebVitals,
    },
  };
}

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
    about_page_enabled: Boolean(controls.about_page_enabled),
    notifications_page_enabled: Boolean(controls.notifications_page_enabled),
    academics_page_enabled: Boolean(controls.academics_page_enabled),
    admission_page_enabled: Boolean(controls.admission_page_enabled),
    admission_apply_page_enabled: Boolean(controls.admission_apply_page_enabled),
    admission_status_page_enabled: Boolean(controls.admission_status_page_enabled),
    contact_page_enabled: Boolean(controls.contact_page_enabled),
    admission_open: Boolean(controls.admission_open),
    admission_form_url: store.instituteData.admission_form_url || "/admission",
  };
}

function stripLargeInlineImage(value) {
  const text = String(value || "").trim();
  if (!text.startsWith("data:image/")) {
    return text;
  }

  // Keep public API payload light by dropping very large base64 blobs.
  // Admin endpoints still return full image data for editing.
  const maxInlineLength = 30000;
  return text.length > maxInlineLength ? "" : text;
}

const MAX_INLINE_IMAGE_BYTES = 1024 * 1024;
const INLINE_IMAGE_DATA_URL_RE = /^data:image\/[a-z0-9.+-]+;base64,/i;

function estimateBase64DecodedBytes(dataUrl) {
  const match = String(dataUrl || "").match(/^data:[^;]+;base64,(.+)$/i);
  if (!match) return 0;

  const base64 = match[1].replace(/\s+/g, "");
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

function assertInlineImageSize(fieldName, value) {
  const text = String(value || "").trim();
  if (!text || !INLINE_IMAGE_DATA_URL_RE.test(text)) {
    return;
  }

  const bytes = estimateBase64DecodedBytes(text);
  if (bytes > MAX_INLINE_IMAGE_BYTES) {
    throw new Error(`${fieldName} must be less than 1 MB`);
  }
}

function getPublicInstituteData(store) {
  const data = store.instituteData || {};

  return {
    ...data,
    principal: {
      ...(data.principal || {}),
      photo: stripLargeInlineImage(data?.principal?.photo),
    },
    faculties: (data.faculties || []).map((item) => ({
      ...item,
      photo: stripLargeInlineImage(item?.photo),
    })),
    hero_slides: (data.hero_slides || []).map((slide) => ({
      ...slide,
      src: stripLargeInlineImage(slide?.src),
    })),
    home_student_achievements: (data.home_student_achievements || []).map((item) => ({
      ...item,
      photo: stripLargeInlineImage(item?.photo),
    })),
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
    principal: data.principal || { name: "", role: "Principal", message: "", photo: "" },
    facilities: data.facilities || [],
    contact: data.contact || {},
    hero_slides: data.hero_slides || [],
    home_highlights: data.home_highlights || { stats: [], reasons: [] },
    home_front_desk: data.home_front_desk || { title: "", items: [] },
    home_achievements: data.home_achievements || [],
    home_student_achievements: data.home_student_achievements || [],
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

function normalizeComparable(value) {
  return String(value || "").trim().toLowerCase();
}

function safeAdminError(err) {
  if (err instanceof Error) {
    if (err.message === "State changed on the server. Please refresh and retry.") {
      return error(err.message, 409);
    }
    if (err.message === "Set a strong ADMIN_PASSWORD for production.") {
      return error(err.message, 500);
    }
    if (err.message === "Set ADMIN_SESSION_SECRET with at least 32 characters for production.") {
      return error(err.message, 500);
    }
  }
  return null;
}

function normalizeStudentPayload(payload, options = {}) {
  const requirePassword = options.requirePassword !== false;
  const passwordRaw = String(payload?.password || "").trim();
  if (requirePassword && !passwordRaw) {
    throw new Error("Password cannot be empty");
  }
  return {
    rollNumber: assertNonEmpty("Roll number", payload.rollNumber),
    password: passwordRaw,
    name: assertNonEmpty("Student name", payload.name),
    className: assertNonEmpty("Class", payload.className),
    stream: assertNonEmpty("Stream", payload.stream),
  };
}

function sanitizeStudentForAdmin(student) {
  return {
    rollNumber: String(student?.rollNumber || "").trim(),
    name: String(student?.name || "").trim(),
    className: String(student?.className || "").trim(),
    stream: String(student?.stream || "").trim(),
    password: "",
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
    .map((item, index) => {
      const photo = String(item?.photo || "").trim();
      assertInlineImageSize(`Faculty photo #${index + 1}`, photo);
      return {
        name: String(item?.name || "").trim(),
        designation: String(item?.designation || item?.department || "").trim() || "Faculty",
        qualification: String(item?.qualification || "").trim() || "Not specified",
        photo,
      };
    })
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


function normalizePrincipal(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Principal details are required");
  }

  const photo = String(payload.photo || "").trim();
  assertInlineImageSize("Principal photo", photo);

  return {
    name: String(payload.name || "").trim(),
    role: String(payload.role || "Principal").trim() || "Principal",
    message: String(payload.message || "").trim(),
    photo,
  };
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


function normalizeHomeStudentAchievements(items) {
  if (!Array.isArray(items)) {
    throw new Error("Home student achievements must be an array");
  }
  return items
    .map((item, index) => {
      const photo = String(item?.photo || "").trim();
      assertInlineImageSize(`Student achievement photo #${index + 1}`, photo);
      return {
        name: String(item?.name || "").trim() || "Student Achievement",
        className: String(item?.className || item?.class || item?.stream || "Student Recognition").trim(),
        title: String(item?.title || item?.achievement || "Award and Achievement").trim(),
        description: String(item?.description || item?.text || "").trim(),
        photo,
      };
    })
    .filter((item) => item.title && item.description)
    .map((item) => ({
      ...item,
      className: item.className || "Student Recognition",
    }));
}
function normalizeHeroSlides(items) {
  if (!Array.isArray(items)) {
    throw new Error("Hero slides must be an array");
  }
  return items
    .map((item, index) => {
      const src = String(item?.src || "").trim();
      assertInlineImageSize(`Hero slide image #${index + 1}`, src);
      return {
        src,
        title: String(item?.title || "").trim(),
        subtitle: String(item?.subtitle || "").trim(),
      };
    })
    .filter((item) => item.src && item.title && item.subtitle);
}

function parseInlineImageDataUrl(value) {
  const text = String(value || "").trim();
  const match = text.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) {
    return null;
  }

  const contentType = String(match[1] || "image/png").toLowerCase();
  const base64 = String(match[2] || "").replace(/\s+/g, "");
  if (!base64) {
    return null;
  }

  return {
    contentType,
    buffer: Buffer.from(base64, "base64"),
  };
}

async function persistInlineImageIfNeeded(value, scope) {
  const text = String(value || "").trim();
  if (!text.startsWith("data:image/")) {
    return text;
  }

  const parsed = parseInlineImageDataUrl(text);
  if (!parsed?.buffer?.length) {
    return text;
  }

  const saved = await saveUploadedBuffer({
    buffer: parsed.buffer,
    contentType: parsed.contentType,
    originalName: `${scope}.png`,
    scope,
    size: parsed.buffer.byteLength,
    maxBytes: MAX_INLINE_IMAGE_BYTES,
  });
  return saved.url;
}

async function persistInstituteMedia(data) {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (data.principal && typeof data.principal === "object") {
    data.principal.photo = await persistInlineImageIfNeeded(data.principal.photo, "principal");
  }

  if (Array.isArray(data.faculties)) {
    data.faculties = await Promise.all(
      data.faculties.map(async (item, index) => ({
        ...item,
        photo: await persistInlineImageIfNeeded(item?.photo, `faculties-${index + 1}`),
      }))
    );
  }

  if (Array.isArray(data.home_student_achievements)) {
    data.home_student_achievements = await Promise.all(
      data.home_student_achievements.map(async (item, index) => ({
        ...item,
        photo: await persistInlineImageIfNeeded(item?.photo, `student-achievement-${index + 1}`),
      }))
    );
  }

  if (Array.isArray(data.hero_slides)) {
    data.hero_slides = await Promise.all(
      data.hero_slides.map(async (item, index) => ({
        ...item,
        src: await persistInlineImageIfNeeded(item?.src, `hero-slide-${index + 1}`),
      }))
    );
  }

  return data;
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


function getClassGroupCode(classForAdmission) {
  const normalizedClass = String(classForAdmission || "").trim().toLowerCase();
  return normalizedClass === "11th" || normalizedClass === "12th" ? "1" : "0";
}

function getStreamCode(classForAdmission, stream) {
  if (getClassGroupCode(classForAdmission) === "0") {
    return "0";
  }

  const normalizedStream = String(stream || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  if (normalizedStream === "medical") return "1";
  if (normalizedStream === "non-medical" || normalizedStream === "nonmedical") return "2";
  if (normalizedStream === "arts") return "3";
  return "0";
}

function getNextAdmissionSequence(store) {
  const maxSequence = (Array.isArray(store?.admissions) ? store.admissions : []).reduce((max, item) => {
    const currentId = String(item?.application_id || "").trim();
    const match = currentId.match(/^\d{2}-\d{2}-(\d{4})$/);
    if (!match) return max;

    const numeric = Number(match[1]);
    if (!Number.isInteger(numeric)) return max;
    return Math.max(max, numeric);
  }, 0);

  if (maxSequence >= 9999) {
    throw new Error("Application ID capacity reached. Contact admin.");
  }

  return String(maxSequence + 1).padStart(4, "0");
}

function createAdmissionApplicationId(store, applicant) {
  const yearCode = new Date().getFullYear().toString().slice(-2);
  const classCode = getClassGroupCode(applicant?.form_data?.class_for_admission);
  const streamCode = getStreamCode(applicant?.form_data?.class_for_admission, applicant?.form_data?.stream);
  const sequence = getNextAdmissionSequence(store);
  return `${yearCode}-${classCode}${streamCode}-${sequence}`;
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
  const oneMb = MAX_INLINE_IMAGE_BYTES;

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
  const mime = String(value.type || "").trim().toLowerCase() || "application/octet-stream";
  const name = String(value.name || "upload").trim() || "upload";
  const buffer = Buffer.from(await value.arrayBuffer());
  const savedFile = await saveUploadedBuffer({
    buffer,
    contentType: mime,
    originalName: name,
    scope: "admissions",
    size: Number(value.size || buffer.byteLength || 0),
    maxBytes: oneMb,
  });
  return {
    name: savedFile.name,
    type: savedFile.type,
    size: savedFile.size,
    url: savedFile.url,
    storage_key: savedFile.key,
  };
}

async function normalizeMultipartAdmissionPayload(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_ADMISSION_MULTIPART_BYTES) {
    throw new Error("Admission payload is too large");
  }

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

function sanitizeAdmissionForDashboard(admission) {
  const uploads = admission?.uploads || {};
  const sanitizedUploads = Object.fromEntries(
    Object.entries(uploads).map(([key, file]) => {
      if (!file) {
        return [key, null];
      }

      return [
        key,
        {
          name: file.name || "",
          type: file.type || "",
          size: file.size || 0,
        },
      ];
    })
  );

  return {
    application_id: admission.application_id,
    name: admission.name,
    dob: admission.dob,
    status: admission.status,
    remarks: admission.remarks || "",
    submitted_at: admission.submitted_at,
    approved_at: admission.approved_at || "",
    form_data: admission.form_data || {},
    uploads: sanitizedUploads,
  };
}
function matchesAdmissionDob(admission, dob) {
  return admission.dob === dob;
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


function normalizeOptionalNotificationAttachment(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";

  if (text.startsWith("data:image/")) {
    assertInlineImageSize("Attachment image", text);
    return text;
  }

  if (text.startsWith("data:application/pdf")) {
    return text;
  }

  if (text.startsWith("http://") || text.startsWith("https://") || text.startsWith("/")) {
    return text;
  }

  throw new Error("Attachment must be an uploaded image/pdf or a valid URL");
}

function normalizeOptionalNotificationLink(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (!text.startsWith("http://") && !text.startsWith("https://") && !text.startsWith("/")) {
    throw new Error("Link URL must start with http://, https://, or /");
  }
  return text;
}

async function saveAdminImageUpload(file) {
  const mimeType = String(file?.type || "").toLowerCase();
  if (!mimeType.startsWith("image/")) {
    throw new Error("Only image uploads are supported");
  }

  const size = Number(file?.size || 0);
  if (!size) {
    throw new Error("Image file is required");
  }
  if (size > MAX_ADMIN_IMAGE_UPLOAD_BYTES) {
    throw new Error(`Image must be less than ${Math.round(MAX_ADMIN_IMAGE_UPLOAD_BYTES / (1024 * 1024))} MB`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const savedFile = await saveUploadedBuffer({
    buffer,
    contentType: mimeType,
    originalName: String(file?.name || "image-upload"),
    scope: "admin",
    size,
    maxBytes: MAX_ADMIN_IMAGE_UPLOAD_BYTES,
  });

  return {
    url: savedFile.url,
    name: savedFile.name,
    type: savedFile.type,
    size: savedFile.size,
    storage_key: savedFile.key,
  };
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
    const environment = (process.env.ENVIRONMENT || process.env.NODE_ENV || "development").toLowerCase();
    if (environment === "production") {
      return error("Not found", 404);
    }
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

  if (path[0] === "monitoring" && path[1] === "health" && path.length === 2) {
    return json({ status: "ok", metrics: buildMonitoringSummary(store) });
  }

  if (path[0] === "institute" && path.length === 1) {
    return json(getPublicInstituteData(store), 200, {
      "Cache-Control": PUBLIC_INSTITUTE_CACHE_CONTROL,
    });
  }

  if (path[0] === "admissions" && path[1] === "status" && path.length === 2) {
    const url = new URL(request.url);
    const applicationId = String(url.searchParams.get("application_id") || "").trim();
    const dob = String(url.searchParams.get("dob") || "").trim();

    if (!applicationId || !dob) {
      return error("Application ID and date of birth are required", 400);
    }

    const admission = store.admissions.find((item) => item.application_id === applicationId);
    if (!admission || !matchesAdmissionDob(admission, dob)) {
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
    try {
      ensureSecureConfig();
    } catch (err) {
      return safeAdminError(err) || error(err instanceof Error ? err.message : "Server configuration error", 500);
    }

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
      const classKey = normalizeComparable(className);
      const streamKey = normalizeComparable(stream);
      const filteredMaterials = (academicContent.materials || [])
        .filter((item) => normalizeComparable(item.class_name) === classKey)
        .map((item) => ({
          ...item,
          streams: (item.streams || []).filter(
            (streamItem) => normalizeComparable(streamItem.stream) === streamKey
          ),
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
            (item) =>
              normalizeComparable(item.class_name) === classKey &&
              normalizeComparable(item.stream) === streamKey
          ),
          timetable: (academicContent.timetable || []).filter(
            (item) =>
              normalizeComparable(item.class_name) === classKey &&
              normalizeComparable(item.stream) === streamKey
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

  if (path[1] === "dashboard" && path.length === 2) {
    const url = new URL(request.url);
    const includeInstitute = url.searchParams.get("include_institute") !== "0";

    return json({
      contacts: store.contacts || [],
      controls: getControls(store),
      notificationItems: store.instituteData.notification_items || [],
      academicContent: store.instituteData.academic_content || { noticeboard: [], timetable: [], materials: [] },
      students: (store.students || []).map(sanitizeStudentForAdmin),
      notices: (store.instituteData.notices || []).map((notice, index) => ({ index, text: notice.text })),
      downloads: (store.instituteData.downloads || []).map((item, index) => ({ index, ...item })),
      institute: includeInstitute ? getAdminInstituteData(store) : null,
      admissions: (store.admissions || []).map(sanitizeAdmissionForDashboard),
    });
  }

  if (path[1] === "monitoring" && path.length === 2) {
    return json(buildMonitoringSummary(store));
  }

  if (path[1] === "backups" && path.length === 2) {
    const snapshots = (store.backups || []).map((item) => ({
      id: item.id,
      label: item.label,
      version: item.version,
      createdAt: item.createdAt,
      admissions: item.payload?.admissions?.length || 0,
      students: item.payload?.students?.length || 0,
      contacts: item.payload?.contacts?.length || 0,
    }));
    return json(snapshots.reverse());
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
    return json((store.admissions || []).map(sanitizeAdmissionForDashboard));
  }
  if (path[1] === "institute" && path.length === 2) {
    return json(getAdminInstituteData(store));
  }

  if (path[1] === "students" && path.length === 2) {
    return json((store.students || []).map(sanitizeStudentForAdmin));
  }

  if (path[0] === "media" && path.length === 2) {
    try {
      const media = await loadStoredMedia(path[1]);
      if (!media) {
        return error("File not found", 404);
      }

      return new Response(media.buffer, {
        status: 200,
        headers: {
          "Content-Type": media.contentType,
          "Content-Length": String(media.size || media.buffer.byteLength || 0),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to load media", 500);
    }
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

  if (path[0] === "monitoring" && path[1] === "events" && path.length === 2) {
    const rateError = rateLimitOrReject(store, request, "monitoring-events", config.monitoringRateLimit);
    if (rateError) {
      return persistAndResponse(store, rateError);
    }
    if (config.monitoringIngestKey) {
      const supplied = String(request.headers.get("x-monitoring-key") || "").trim();
      if (!supplied || supplied !== config.monitoringIngestKey) {
        return persistAndResponse(store, error("Unauthorized monitoring ingest key", 401));
      }
    }
    try {
      const payload = await parseJsonBody(request);
      const kind = String(payload.kind || "").trim();

      if (kind === "web_vital") {
        boundedPush(store.monitoring.webVitals, {
          name: String(payload.name || "unknown"),
          value: Number(payload.value || 0),
          rating: String(payload.rating || ""),
          delta: Number(payload.delta || 0),
          id: String(payload.id || ""),
          page: String(payload.page || ""),
          at: String(payload.at || new Date().toISOString()),
        });
      } else if (kind === "api_latency") {
        boundedPush(store.monitoring.apiLatency, {
          route: String(payload.route || ""),
          method: String(payload.method || "GET"),
          durationMs: Number(payload.durationMs || 0),
          status: Number(payload.status || 0),
          source: String(payload.source || "web"),
          at: String(payload.at || new Date().toISOString()),
        });
      } else {
        return error("Unknown monitoring event kind", 400);
      }

      return persistAndJson(store, { success: true });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Invalid payload", 400);
    }
  }

  if (path[0] === "admissions" && path.length === 1) {
    try {
      const applicant = await normalizeAdmissionSubmission(request);
      const admission = {
        application_id: createAdmissionApplicationId(store, applicant),
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
    try {
      ensureSecureConfig();
    } catch (err) {
      return safeAdminError(err) || error(err instanceof Error ? err.message : "Server configuration error", 500);
    }

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

  if (path[1] === "uploads" && path.length === 2) {
    try {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file || typeof file === "string") {
        return error("Image file is required", 400);
      }

      const upload = await saveAdminImageUpload(file);
      return json({ success: true, upload });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Upload failed", 400);
    }
  }

  if (path[1] === "backups" && path.length === 2) {
    try {
      const payload = await parseJsonBody(request);
      const snapshot = createBackupSnapshot(store, payload?.label);
      store.backups.push(snapshot);
      if (store.backups.length > MAX_BACKUP_SNAPSHOTS) {
        store.backups.splice(0, store.backups.length - MAX_BACKUP_SNAPSHOTS);
      }
      return persistAndJson(store, {
        success: true,
        snapshot: {
          id: snapshot.id,
          label: snapshot.label,
          version: snapshot.version,
          createdAt: snapshot.createdAt,
        },
      });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Invalid payload", 400);
    }
  }

  if (path[1] === "backups" && path[3] === "restore" && path.length === 4) {
    const snapshot = (store.backups || []).find((item) => item.id === path[2]);
    if (!snapshot) {
      return error("Snapshot not found", 404);
    }

    applyBackupSnapshot(store, snapshot);
    return persistAndJson(store, {
      success: true,
      restored: {
        id: snapshot.id,
        label: snapshot.label,
        version: snapshot.version,
        createdAt: snapshot.createdAt,
      },
    });
  }

  try {
    const payload = await parseJsonBody(request);

    if (path[1] === "students" && path.length === 2) {
      const student = normalizeStudentPayload(payload, { requirePassword: true });
      ensureUniqueRollNumber(store.students, student.rollNumber);
      const savedStudent = {
        rollNumber: student.rollNumber,
        name: student.name,
        className: student.className,
        stream: student.stream,
        passwordHash: hashPassword(student.password),
      };
      store.students.unshift(savedStudent);
      return persistAndJson(store, { success: true, student: sanitizeStudentForAdmin(savedStudent) });
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
        image_url: normalizeOptionalNotificationAttachment(payload.image_url),
        link_label: String(payload.link_label || "").trim(),
        link_url: normalizeOptionalNotificationLink(payload.link_url),
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
        image_url: normalizeOptionalNotificationAttachment(payload.image_url),
        link_label: String(payload.link_label || "").trim(),
        link_url: normalizeOptionalNotificationLink(payload.link_url),
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
      if (payload.principal !== undefined) data.principal = normalizePrincipal(payload.principal);
      if (payload.facilities !== undefined) data.facilities = normalizeStringList(payload.facilities, "Facility");
      if (payload.contact !== undefined) data.contact = normalizeContact(payload.contact);
      if (payload.home_highlights !== undefined) data.home_highlights = normalizeHomeHighlights(payload.home_highlights);
      if (payload.home_front_desk !== undefined) data.home_front_desk = normalizeHomeFrontDesk(payload.home_front_desk);
      if (payload.home_achievements !== undefined) {
        data.home_achievements = normalizeStringList(payload.home_achievements, "Achievement");
      }
      if (payload.home_student_achievements !== undefined) {
        data.home_student_achievements = normalizeHomeStudentAchievements(payload.home_student_achievements);
      }
      if (payload.home_resources !== undefined) data.home_resources = normalizeHomeResources(payload.home_resources);
      if (payload.home_testimonials !== undefined) {
        data.home_testimonials = normalizeHomeTestimonials(payload.home_testimonials);
      }
      if (payload.hero_slides !== undefined) data.hero_slides = normalizeHeroSlides(payload.hero_slides);
      if (payload.admission_content !== undefined) {
        data.admission_content = normalizeAdmissionContent(payload.admission_content);
      }

      await persistInstituteMedia(data);

      return persistAndJson(store, { success: true, institute: getAdminInstituteData(store) });
    }
    const controls = store.instituteData.site_controls;

    if (payload.about_page_enabled !== undefined) {
      controls.about_page_enabled = Boolean(payload.about_page_enabled);
    }

    if (payload.notifications_page_enabled !== undefined) {
      controls.notifications_page_enabled = Boolean(payload.notifications_page_enabled);
    }

    if (payload.academics_page_enabled !== undefined) {
      controls.academics_page_enabled = Boolean(payload.academics_page_enabled);
    }

    if (payload.admission_page_enabled !== undefined) {
      controls.admission_page_enabled = Boolean(payload.admission_page_enabled);
    }

    if (payload.admission_apply_page_enabled !== undefined) {
      controls.admission_apply_page_enabled = Boolean(payload.admission_apply_page_enabled);
    }

    if (payload.admission_status_page_enabled !== undefined) {
      controls.admission_status_page_enabled = Boolean(payload.admission_status_page_enabled);
    }

    if (payload.contact_page_enabled !== undefined) {
      controls.contact_page_enabled = Boolean(payload.contact_page_enabled);
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
      const student = normalizeStudentPayload(payload, { requirePassword: false });
      const index = store.students.findIndex((item) => item.rollNumber === path[2]);
      if (index === -1) {
        return error("Student not found", 404);
      }
      ensureUniqueRollNumber(store.students, student.rollNumber, path[2]);
      const existing = store.students[index] || {};
      const nextPasswordHash = student.password
        ? hashPassword(student.password)
        : String(existing.passwordHash || existing.password || "").trim();
      if (!nextPasswordHash) {
        return error("Password cannot be empty", 400);
      }
      const savedStudent = {
        rollNumber: student.rollNumber,
        name: student.name,
        className: student.className,
        stream: student.stream,
        passwordHash: nextPasswordHash,
      };
      store.students[index] = savedStudent;
      return persistAndJson(store, { success: true, student: sanitizeStudentForAdmin(savedStudent) });
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
      if (payload.image_url !== undefined) current.image_url = normalizeOptionalNotificationAttachment(payload.image_url);
      if (payload.link_label !== undefined) current.link_label = String(payload.link_label || "").trim();
      if (payload.link_url !== undefined) current.link_url = normalizeOptionalNotificationLink(payload.link_url);

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
      if (payload.image_url !== undefined) current.image_url = normalizeOptionalNotificationAttachment(payload.image_url);
      if (payload.link_label !== undefined) current.link_label = String(payload.link_label || "").trim();
      if (payload.link_url !== undefined) current.link_url = normalizeOptionalNotificationLink(payload.link_url);

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
    if (path[1] === "backups" && path.length === 3) {
      const index = (store.backups || []).findIndex((item) => item.id === path[2]);
      if (index === -1) {
        return error("Snapshot not found", 404);
      }
      store.backups.splice(index, 1);
      return persistAndJson(store, { success: true, message: "Snapshot deleted." });
    }

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

    if (path[1] === "admissions" && path.length === 3) {
      const index = store.admissions.findIndex((item) => item.application_id === path[2]);
      if (index === -1) {
        return error("Application not found", 404);
      }
      store.admissions.splice(index, 1);
      return persistAndJson(store, { success: true, message: "Admission form deleted." });
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











