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
  admission_form_url: "https://docs.google.com/forms/d/e/1FAIpQLSdvS2PlCZL8kHiXKlZZ3yrPCmG9diiOGj1SUl4QvIA8DFlYIw/viewform?usp=publish-editor",
  site_controls: {
    notifications_page_enabled: true,
    academics_page_enabled: true,
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
  faculties: [
    {
      name: "Peer Nisar Ahmad",
      department: "Faculty",
      qualification: "M.A., B.Ed.",
      photo: "/faculty/Peer_Nisar_Ahmad.jpeg",
    },
    {
      name: "Sajad Ahmad Dar",
      department: "Faculty",
      qualification: "M.A. (Economics), B.Ed.",
      photo: "/faculty/Sajad_Ahmad_Dar.jpeg",
    },
    {
      name: "Mudassir Gulzar",
      department: "Faculty",
      qualification: "B.Ed., M.A., M.Phil.",
      photo: "/faculty/Mudassir_Gulzar.jpeg",
    },
    {
      name: "Aijaz Ahmad Rather",
      department: "Faculty",
      qualification: "M.Sc., B.Ed.",
      photo: "/faculty/Aijaz_Ahmad_Rather.jpeg",
    },
    {
      name: "Raies Ahmad Wani",
      department: "Faculty",
      qualification: "M.Sc. (EVS), M.A., M.Ed., NET, SET.",
      photo: "/faculty/Raies_Ahmad_Wani.jpeg",
    },
    {
      name: "Ashak Hussain Bhat",
      department: "Faculty",
      qualification: "MA, MPhil, BEd, NET, SET",
      photo: "/faculty/Ashak_Hussain_Khan.jpeg",
    },
    {
      name: "Muzafar Rashid Khan",
      department: "Faculty",
      qualification: "MSc Zoology, MA Political Science, BEd",
      photo: "/faculty/Muzafar_Rashid_Khan.jpeg",
    },
  ],
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
      link_url: "https://docs.google.com/forms/d/e/1FAIpQLSdvS2PlCZL8kHiXKlZZ3yrPCmG9diiOGj1SUl4QvIA8DFlYIw/viewform?usp=publish-editor",
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

function resetControlsShape(store) {
  if (!store.instituteData.site_controls || typeof store.instituteData.site_controls !== "object") {
    store.instituteData.site_controls = {
      notifications_page_enabled: true,
      academics_page_enabled: true,
      admission_open: true,
    };
  }
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
  const defaults = DEFAULT_INSTITUTE_DATA.faculties || [];

  if (!Array.isArray(store.instituteData.faculties)) {
    store.instituteData.faculties = structuredClone(defaults);
    return;
  }

  for (const item of defaults) {
    const index = store.instituteData.faculties.findIndex(
      (faculty) =>
        (faculty.name && faculty.name === item.name) ||
        (faculty.photo && item.photo && faculty.photo === item.photo)
    );

    if (index === -1) {
      store.instituteData.faculties.push(structuredClone(item));
    } else {
      store.instituteData.faculties[index] = {
        ...store.instituteData.faculties[index],
        ...structuredClone(item),
      };
    }
  }
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

export function getStore() {
  const globalStoreKey = "__ghhs_store_v1__";
  if (!globalThis[globalStoreKey]) {
    globalThis[globalStoreKey] = structuredClone(DEFAULT_STATE);
  }

  const store = globalThis[globalStoreKey];
  resetControlsShape(store);
  resetContentShape(store);
  resetFacultyShape(store);
  resetStudentShape(store);
  resetAdmissionsShape(store);
  resetRateLimitShape(store);
  return store;
}
















