const DEFAULT_INSTITUTE_DATA = {
  name: "Government Girls Higher Secondary School, Sagam",
  tagline: "Learn Today, Lead Tomorrow",
  description: "A student-first institute with practical teaching and strong outcomes.",
  about_us:
    "Bright Future Institute provides value-based education with modern teaching methods, experienced faculty, and a focus on student growth.",
  institute_details: [
    "Established in 2004 with a mission to provide holistic education.",
    "Recognized by the state education board and affiliated with national-level exam preparation partners.",
    "Consistent academic performance with strong student mentoring and career guidance.",
  ],
  admission_form_url: "https://forms.google.com",
  site_controls: {
    notifications_page_enabled: true,
    academics_page_enabled: true,
    admission_open: true,
  },
  academics: [
    {
      title: "Science Stream",
      description: "Strong foundation in Physics, Chemistry, Mathematics, and Biology.",
    },
    {
      title: "Commerce Stream",
      description: "Focused courses in Accountancy, Economics, and Business Studies.",
    },
    {
      title: "Arts & Humanities",
      description: "Language, social science, and creative development tracks.",
    },
  ],
  faculties: [
    { name: "Dr. R. Mehta", department: "Physics", qualification: "PhD (Physics)" },
    { name: "Ms. S. Iyer", department: "Mathematics", qualification: "M.Sc, B.Ed" },
    { name: "Mr. A. Khan", department: "Commerce", qualification: "M.Com, NET" },
    { name: "Ms. P. Roy", department: "English", qualification: "M.A (English)" },
  ],
  streams_subjects: [
    {
      stream: "Science",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"],
    },
    {
      stream: "Commerce",
      subjects: ["Accountancy", "Economics", "Business Studies", "Mathematics", "Informatics Practices"],
    },
    {
      stream: "Arts",
      subjects: ["History", "Political Science", "Geography", "Sociology", "English"],
    },
  ],
  staff: [
    { name: "Mrs. K. Sharma", role: "Principal" },
    { name: "Mr. D. Verma", role: "Vice Principal" },
    { name: "Ms. L. Dsouza", role: "Counselor" },
    { name: "Mr. N. Patil", role: "Lab Assistant" },
  ],
  facilities: [
    "Smart classrooms",
    "Science and computer laboratories",
    "Library and reading hall",
    "Sports ground and indoor games",
    "Transport and medical support",
  ],
  notices: [
    { text: "Admissions for 2026-27 are open now." },
    { text: "Parent-teacher meeting on April 15, 2026." },
  ],
  downloads: [
    { title: "Prospectus 2026", url: "https://example.com/prospectus.pdf" },
    { title: "Academic Calendar", url: "https://example.com/academic-calendar.pdf" },
  ],
  notification_items: [
    {
      id: "n-001",
      category: "Admissions",
      date: "2026-04-03",
      title: "Admission Form Submission Window Open",
      summary: "Online admission submissions are open for session 2026-27.",
      details:
        "Students can submit admission applications through the official Google Form. Keep scanned copies of required documents ready before submission.",
      image_url: "",
      link_label: "Open Admission Form",
      link_url: "https://forms.google.com",
    },
    {
      id: "n-002",
      category: "Examinations",
      date: "2026-04-06",
      title: "Unit Test Schedule Published",
      summary: "Unit test dates for Classes 11 and 12 have been released.",
      details:
        "Exams will be conducted in morning sessions. Students should check section-wise timetables and report 20 minutes before exam start.",
      image_url: "",
      link_label: "Download Unit Test Schedule",
      link_url: "https://example.com/unit-test-schedule.pdf",
    },
  ],
  academic_content: {
    noticeboard: [
      {
        id: "an-1",
        headline: "Chemistry practical files submission today",
        description:
          "Class XI and XII chemistry practical files must be submitted before 2:00 PM.",
        time: "08:50 AM",
        image_url: "",
        link_label: "Submission Guidelines",
        link_url: "https://example.com/chemistry-practical",
      },
    ],
    timetable: [
      {
        id: "tt-1",
        period: "1",
        time: "09:00 - 09:45",
        detail: "Core Subject",
        class_name: "Class XI",
        stream: "Science",
      },
      {
        id: "tt-2",
        period: "2",
        time: "09:45 - 10:30",
        detail: "Core Subject",
        class_name: "Class XI",
        stream: "Science",
      },
      {
        id: "tt-3",
        period: "1",
        time: "09:00 - 09:45",
        detail: "Accountancy",
        class_name: "Class XII",
        stream: "Commerce",
      },
    ],
    materials: [
      {
        class_name: "Class XI",
        streams: [
          {
            stream: "Science",
            subjects: [
              { name: "Physics", drive: "https://drive.google.com/drive/folders/physics-xi" },
              { name: "Chemistry", drive: "https://drive.google.com/drive/folders/chemistry-xi" },
            ],
          },
          {
            stream: "Commerce",
            subjects: [{ name: "Accountancy", drive: "https://drive.google.com/drive/folders/accountancy-xi" }],
          },
        ],
      },
      {
        class_name: "Class XII",
        streams: [
          {
            stream: "Science",
            subjects: [
              { name: "Physics", drive: "https://drive.google.com/drive/folders/physics-xii" },
              { name: "Biology", drive: "https://drive.google.com/drive/folders/biology-xii" },
            ],
          },
          {
            stream: "Arts",
            subjects: [{ name: "History", drive: "https://drive.google.com/drive/folders/history-xii" }],
          },
        ],
      },
    ],
  },
  contact: {
    email: "info@brightfuture.edu",
    phone: "+91-9876543210",
    address: "Main Road, City, State, India",
  },
};

const DEFAULT_STATE = {
  contacts: [],
  adminSessions: {},
  loginFailures: {},
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

export function getStore() {
  const globalStoreKey = "__ghhs_store_v1__";
  if (!globalThis[globalStoreKey]) {
    globalThis[globalStoreKey] = structuredClone(DEFAULT_STATE);
  }

  const store = globalThis[globalStoreKey];
  resetControlsShape(store);
  resetContentShape(store);
  return store;
}
