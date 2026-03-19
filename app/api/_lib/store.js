import { getDb } from "./mongodb";

const DEFAULT_INSTITUTE_DATA = {
  name: "Government Girls Higher Secondary School, Sagam",
  tagline: "Educating Girls, Building Futures",
  description:
    "A government higher secondary institution dedicated to girls' education, academic discipline, and meaningful progress in Medical, Non-Medical, and Arts streams.",
  about_us:
    "Government Girls Higher Secondary School, Sagam serves the community by providing focused higher secondary education for girls in a safe, disciplined, and encouraging environment.",
  institute_details: [
    "A government institution committed to accessible and quality girls' education.",
    "Supports higher secondary learning with Medical, Non-Medical, and Arts streams.",
    "Focused on board preparation, character formation, and future academic growth.",
  ],
  admission_form_url: "/admission",
  site_controls: {
    about_page_enabled: true,
    notifications_page_enabled: true,
    academics_page_enabled: true,
    admission_page_enabled: true,
    admission_apply_page_enabled: true,
    admission_status_page_enabled: true,
    contact_page_enabled: true,
    admission_open: true,
  },
  academics: [
    {
      title: "Medical Stream",
      description: "Higher secondary study path for students focused on Biology and life science related careers.",
    },
    {
      title: "Non-Medical Stream",
      description: "Rigorous academic pathway centered on Physics, Chemistry, and Mathematics.",
    },
    {
      title: "Arts Stream",
      description: "Humanities education that strengthens expression, awareness, and higher study readiness.",
    },
  ],
  faculties: [],
  streams_subjects: [
    {
      stream: "Medical",
      subjects: ["Biology", "Chemistry", "English", "Environmental Science"],
    },
    {
      stream: "Non-Medical",
      subjects: ["Physics", "Chemistry", "Mathematics", "English"],
    },
    {
      stream: "Arts",
      subjects: ["History", "Political Science", "Education", "English"],
    },
  ],
  staff: [
    { name: "Farooq Hussain Itoo", role: "Principal" },
    { name: "Mr. D. Verma", role: "Vice Principal" },
    { name: "Ms. L. Dsouza", role: "Counselor" },
    { name: "Mr. N. Patil", role: "Lab Assistant" },
  ],
  facilities: [
    "Well-managed classrooms for higher secondary learning",
    "Science laboratory support for practical work",
    "Library and reading resources for girls",
    "Counseling and academic guidance support",
    "School-based co-curricular and awareness activities",
  ],
  notices: [
    { text: "Admissions are open for Medical, Non-Medical, and Arts streams." },
    { text: "Students are advised to follow the current academic and attendance schedule." },
  ],
  downloads: [
    { title: "Academic Calendar", url: "https://example.com/academic-calendar.pdf" },
    { title: "Scholarship Guidance", url: "https://example.com/scholarships" },
  ],
  notification_items: [
    {
      id: "n-001",
      category: "Admissions",
      date: "2026-04-03",
      title: "Admissions Open for Higher Secondary Classes",
      summary: "Admission process is open for eligible students in the new academic session.",
      details:
        "Students seeking admission to Medical, Non-Medical, and Arts streams should complete the admission process within the announced dates.",
      image_url: "",
      link_label: "Open Admission Form",
      link_url: "/admission",
    },
    {
      id: "n-002",
      category: "Examinations",
      date: "2026-04-06",
      title: "Unit Test Schedule Released",
      summary: "The schedule for internal assessment and unit tests has been issued.",
      details:
        "Students are advised to check their class-wise schedule and prepare according to the timetable shared by the school.",
      image_url: "",
      link_label: "Download Schedule",
      link_url: "https://example.com/unit-test-schedule.pdf",
    },
  ],
  academic_content: {
    noticeboard: [
      {
        id: "an-1",
        headline: "Scholarship and admission guidance available this week",
        description:
          "Students and parents can contact the school for support regarding admissions, stream placement, and scholarship documentation.",
        time: "09:00 AM",
        class_name: "Class XI",
        stream: "Medical",
        image_url: "",
        link_label: "Support Details",
        link_url: "https://example.com/scholarships",
      },
    ],
    timetable: [
      {
        id: "tt-1",
        period: "1",
        time: "09:00 - 09:45",
        detail: "Core Subject",
        class_name: "Class XI",
        stream: "Medical",
      },
      {
        id: "tt-2",
        period: "2",
        time: "09:45 - 10:30",
        detail: "Core Subject",
        class_name: "Class XI",
        stream: "Non-Medical",
      },
      {
        id: "tt-3",
        period: "3",
        time: "10:30 - 11:15",
        detail: "Humanities Subject",
        class_name: "Class XII",
        stream: "Arts",
      },
    ],
    materials: [
      {
        class_name: "Class XI",
        streams: [
          {
            stream: "Medical",
            subjects: [
              { name: "Biology", drive: "https://drive.google.com/drive/folders/biology-xi" },
              { name: "Chemistry", drive: "https://drive.google.com/drive/folders/chemistry-xi" },
            ],
          },
          {
            stream: "Non-Medical",
            subjects: [
              { name: "Physics", drive: "https://drive.google.com/drive/folders/physics-xi" },
              { name: "Mathematics", drive: "https://drive.google.com/drive/folders/maths-xi" },
            ],
          },
          {
            stream: "Arts",
            subjects: [
              { name: "History", drive: "https://drive.google.com/drive/folders/history-xi" },
            ],
          },
        ],
      },
      {
        class_name: "Class XII",
        streams: [
          {
            stream: "Medical",
            subjects: [
              { name: "Biology", drive: "https://drive.google.com/drive/folders/biology-xii" },
              { name: "Chemistry", drive: "https://drive.google.com/drive/folders/chemistry-xii" },
            ],
          },
          {
            stream: "Non-Medical",
            subjects: [
              { name: "Physics", drive: "https://drive.google.com/drive/folders/physics-xii" },
              { name: "Mathematics", drive: "https://drive.google.com/drive/folders/maths-xii" },
            ],
          },
          {
            stream: "Arts",
            subjects: [
              { name: "Political Science", drive: "https://drive.google.com/drive/folders/polscience-xii" },
            ],
          },
        ],
      },
    ],
  },
  contact: {
    email: "ghhssagam@school.edu.in",
    phone: "+91-7000000000",
    address: "Government Girls Higher Secondary School, Sagam, Jammu and Kashmir, India",
  },
  hero_slides: [],
  home_highlights: {
    stats: [
      { value: "1000+", label: "Girls Enrolled" },
      { value: "30+", label: "Teachers and Staff" },
      { value: "90%+", label: "Higher Secondary Success" },
      { value: "3", label: "Streams Offered" },
    ],
    reasons: [
      "Dedicated higher secondary teaching for Medical, Non-Medical, and Arts students.",
      "A disciplined government institution supporting girls' education and progression.",
      "Academic mentoring, scholarships guidance, and a supportive campus atmosphere.",
    ],
  },
  home_front_desk: {
    title: "Visitor Essentials",
    items: [
      "Admission and stream selection guidance",
      "Scholarship and student welfare information",
      "Board exam notices and academic support links",
      "Parent communication and institutional updates",
    ],
  },
  home_achievements: [
    "Student achievements in board results, science fairs, and community competitions.",
    "Awards for academic excellence, attendance, and leadership across Medical, Non-Medical, and Arts streams.",
    "Milestones in scholarships secured and higher education admissions for graduating students.",
    "Recognition for disciplined campus culture and sustained academic performance.",
  ],
  home_student_achievements: [
    {
      name: "Aaliya Bashir",
      className: "Class XII, Medical",
      title: "Top Board Performer",
      description: "Secured distinction in board exams with excellent subject-wise consistency.",
      photo: "",
    },
    {
      name: "Sana Jan",
      className: "Class XI, Non-Medical",
      title: "Science Fair Winner",
      description: "Won district-level science fair for an innovative low-cost model project.",
      photo: "",
    },
    {
      name: "Insha Yousuf",
      className: "Class XII, Arts",
      title: "Debate Champion",
      description: "Recognized for outstanding communication and leadership in inter-school debates.",
      photo: "",
    },
  ],
  home_resources: [
    {
      title: "Scholarship Information",
      description: "Important guidance for girls applying under scholarship and support schemes.",
      href: "https://example.com/scholarships",
      label: "View Scholarships",
    },
    {
      title: "Admission Updates",
      description: "Latest information for admissions, stream selection, and student entry requirements.",
      href: "/admission",
      label: "Open Admission Form",
    },
    {
      title: "Academic Calendar",
      description: "Board preparation dates, school activities, and important institutional events.",
      href: "https://example.com/academic-calendar.pdf",
      label: "Open Calendar",
    },
    {
      title: "Student Notices",
      description: "Circulars, exam updates, and school announcements relevant to students and parents.",
      href: "https://example.com/student-notices",
      label: "Open Notices",
    },
  ],
  home_testimonials: [
    {
      name: "Student Voice",
      role: "Class XII, Medical",
      quote:
        "Our teachers guide us seriously for board exams and always encourage us to stay focused and confident.",
    },
    {
      name: "Parent Feedback",
      role: "Parent",
      quote:
        "The school provides a disciplined environment for girls and gives real attention to both studies and values.",
    },
    {
      name: "Alumna Reflection",
      role: "Former Student",
      quote:
        "This school gave me the confidence to continue my education and believe in my own potential.",
    },
  ],
  admission_content: {
    sessionYear: "2026",
    guidelines: [
      "Open the admission form on the school website.",
      "Enter student details exactly as per certificates (name, date of birth, class).",
      "Select the correct stream and class based on eligibility.",
      "Provide parent or guardian contact details with an active phone number and email.",
      "Upload clear scans/photos of all required documents (marksheet, TC, photo, ID).",
      "Upload the payment screenshot or receipt in the form and mention the transaction/reference ID.",
      "Review all entries carefully, submit the form, and save the acknowledgement.",
    ],
    eligibility: [
      "Students must have passed the qualifying examination from a recognized board.",
      "Admission without fee payment will be considered incomplete.",
      "Documents will be verified during admission and must be original and valid as per norms.",
      "Final admission is subject to seat availability and institutional norms.",
    ],
    requiredDocuments: [
      "Previous class marksheet",
      "School leaving or transfer certificate",
      "Aadhar, Bank Account photocopy and Ration Card photocopy",
      "Domicile and identity proof",
      "Recent passport-size photographs",
    ],
  },
};

const DEFAULT_STUDENTS = [
  {
    rollNumber: "230363",
    password: "uzaib",
    name: "Uzaib",
    className: "Class XII",
    stream: "Medical",
  },
  {
    rollNumber: "GGHSS-XI-M-101",
    password: "medical101",
    name: "Aaliya Bashir",
    className: "Class XI",
    stream: "Medical",
  },
  {
    rollNumber: "GGHSS-XI-NM-102",
    password: "nonmedical102",
    name: "Sana Jan",
    className: "Class XI",
    stream: "Non-Medical",
  },
  {
    rollNumber: "GGHSS-XII-A-103",
    password: "arts103",
    name: "Insha Yousuf",
    className: "Class XII",
    stream: "Arts",
  },
];

const DEFAULT_STATE = {
  contacts: [],
  admissions: [],
  adminSessions: {},
  loginFailures: {},
  rateLimits: {},
  students: structuredClone(DEFAULT_STUDENTS),
  instituteData: structuredClone(DEFAULT_INSTITUTE_DATA),
};

function resetIdentityShape(store) {
  if (!store.instituteData || typeof store.instituteData !== "object") {
    store.instituteData = structuredClone(DEFAULT_INSTITUTE_DATA);
    return;
  }

  store.instituteData.name = DEFAULT_INSTITUTE_DATA.name;
  store.instituteData.tagline = DEFAULT_INSTITUTE_DATA.tagline;
}
function resetControlsShape(store) {
  const existing =
    store.instituteData.site_controls && typeof store.instituteData.site_controls === "object"
      ? store.instituteData.site_controls
      : {};

  store.instituteData.site_controls = {
    about_page_enabled: existing.about_page_enabled ?? true,
    notifications_page_enabled: existing.notifications_page_enabled ?? true,
    academics_page_enabled: existing.academics_page_enabled ?? true,
    admission_page_enabled: existing.admission_page_enabled ?? true,
    admission_apply_page_enabled: existing.admission_apply_page_enabled ?? true,
    admission_status_page_enabled: existing.admission_status_page_enabled ?? true,
    contact_page_enabled: existing.contact_page_enabled ?? true,
    admission_open: existing.admission_open ?? true,
  };
}

function resetContentShape(store) {
  if (!Array.isArray(store.instituteData.notification_items)) {
    store.instituteData.notification_items = [];
  }

  if (!store.instituteData.academic_content || typeof store.instituteData.academic_content !== "object") {
    store.instituteData.academic_content = { noticeboard: [], timetable: [], materials: [] };
    return;
  }

  for (const key of ["noticeboard", "timetable", "materials"]) {
    if (!Array.isArray(store.instituteData.academic_content[key])) {
      store.instituteData.academic_content[key] = [];
    }
  }
}

function resetFacultyShape(store) {
  if (!Array.isArray(store.instituteData.faculties)) {
    store.instituteData.faculties = [];
    return;
  }

  store.instituteData.faculties = store.instituteData.faculties.map((item) => ({
    name: String(item?.name || "").trim(),
    designation: String(item?.designation || item?.department || "").trim(),
    qualification: String(item?.qualification || "").trim(),
    photo: String(item?.photo || "").trim(),
  }));
}
function resetHomeContentShape(store) {
  const data = store.instituteData || {};

  if (!Array.isArray(data.hero_slides)) {
    data.hero_slides = structuredClone(DEFAULT_INSTITUTE_DATA.hero_slides || []);
  }

  if (!data.home_highlights || typeof data.home_highlights !== "object") {
    data.home_highlights = structuredClone(DEFAULT_INSTITUTE_DATA.home_highlights);
  }
  if (!Array.isArray(data.home_highlights.stats)) {
    data.home_highlights.stats = structuredClone(DEFAULT_INSTITUTE_DATA.home_highlights.stats || []);
  }
  if (!Array.isArray(data.home_highlights.reasons)) {
    data.home_highlights.reasons = structuredClone(DEFAULT_INSTITUTE_DATA.home_highlights.reasons || []);
  }

  if (!data.home_front_desk || typeof data.home_front_desk !== "object") {
    data.home_front_desk = structuredClone(DEFAULT_INSTITUTE_DATA.home_front_desk);
  }
  if (!Array.isArray(data.home_front_desk.items)) {
    data.home_front_desk.items = structuredClone(DEFAULT_INSTITUTE_DATA.home_front_desk.items || []);
  }

  if (!Array.isArray(data.home_achievements)) {
    data.home_achievements = structuredClone(DEFAULT_INSTITUTE_DATA.home_achievements || []);
  }
  if (!Array.isArray(data.home_student_achievements)) {
    data.home_student_achievements = structuredClone(DEFAULT_INSTITUTE_DATA.home_student_achievements || []);
  }
  if (!Array.isArray(data.home_resources)) {
    data.home_resources = structuredClone(DEFAULT_INSTITUTE_DATA.home_resources || []);
  }
  if (!Array.isArray(data.home_testimonials)) {
    data.home_testimonials = structuredClone(DEFAULT_INSTITUTE_DATA.home_testimonials || []);
  }

  if (!data.admission_content || typeof data.admission_content !== "object") {
    data.admission_content = structuredClone(DEFAULT_INSTITUTE_DATA.admission_content || {});
  }
  if (!Array.isArray(data.admission_content.guidelines)) {
    data.admission_content.guidelines = structuredClone(DEFAULT_INSTITUTE_DATA.admission_content.guidelines || []);
  }
  if (!Array.isArray(data.admission_content.eligibility)) {
    data.admission_content.eligibility = structuredClone(DEFAULT_INSTITUTE_DATA.admission_content.eligibility || []);
  }
  if (!Array.isArray(data.admission_content.requiredDocuments)) {
    data.admission_content.requiredDocuments = structuredClone(DEFAULT_INSTITUTE_DATA.admission_content.requiredDocuments || []);
  }
  if (!data.admission_content.sessionYear) {
    data.admission_content.sessionYear = DEFAULT_INSTITUTE_DATA.admission_content.sessionYear || "2026";
  }

  store.instituteData = data;
}
function resetAdmissionsShape(store) {
  if (!Array.isArray(store.admissions)) {
    store.admissions = [];
  }
}

function resetStudentShape(store) {
  if (!Array.isArray(store.students) || !store.students.length) {
    store.students = structuredClone(DEFAULT_STUDENTS);
  }
}

function resetRateLimitShape(store) {
  if (!store.rateLimits || typeof store.rateLimits !== "object") {
    store.rateLimits = {};
  }
}

function getRateLimitBucket(store, key, windowSeconds) {
  const now = Date.now();
  const existing = store.rateLimits[key];

  if (existing && now <= existing.resetAt) {
    return existing;
  }

  const bucket = {
    count: 0,
    resetAt: now + windowSeconds * 1000,
  };

  store.rateLimits[key] = bucket;
  return bucket;
}

export function checkRateLimit(store, key, limit, windowSeconds) {
  if (!limit || limit <= 0) {
    return { ok: true, remaining: 0, retryAfter: 0 };
  }

  const bucket = getRateLimitBucket(store, key, windowSeconds);
  bucket.count += 1;

  if (bucket.count > limit) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - Date.now()) / 1000));
    return { ok: false, remaining: 0, retryAfter };
  }

  return { ok: true, remaining: Math.max(0, limit - bucket.count), retryAfter: 0 };
}

function normalizeStoreShape(store) {
  resetIdentityShape(store);
  resetControlsShape(store);
  resetContentShape(store);
  resetHomeContentShape(store);
  resetFacultyShape(store);
  resetStudentShape(store);
  resetAdmissionsShape(store);
  resetRateLimitShape(store);
  if (!Array.isArray(store.contacts)) {
    store.contacts = [];
  }
  if (!store.adminSessions || typeof store.adminSessions !== "object") {
    store.adminSessions = {};
  }
  if (!store.loginFailures || typeof store.loginFailures !== "object") {
    store.loginFailures = {};
  }
  return store;
}

function getCollectionName() {
  return process.env.MONGODB_STATE_COLLECTION || "app_state";
}

function stripMetaFields(doc) {
  const store = { ...doc };
  delete store._id;
  delete store.updatedAt;
  return store;
}

export async function getStore() {
  const db = await getDb();
  const collection = db.collection(getCollectionName());
  const existing = await collection.findOne({ _id: "main" });

  if (!existing) {
    const initial = normalizeStoreShape(structuredClone(DEFAULT_STATE));
    await collection.insertOne({ _id: "main", ...initial, updatedAt: new Date().toISOString() });
    return initial;
  }

  const store = normalizeStoreShape({
    ...structuredClone(DEFAULT_STATE),
    ...stripMetaFields(existing),
  });
  return store;
}

export async function saveStore(store) {
  const db = await getDb();
  const collection = db.collection(getCollectionName());
  const normalized = normalizeStoreShape(store);
  await collection.updateOne(
    { _id: "main" },
    { $set: { ...normalized, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
}

