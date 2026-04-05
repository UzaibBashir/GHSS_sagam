import { getDb } from "./mongodb";
import { hashPassword, isPasswordHash } from "./auth";

const DEFAULT_INSTITUTE_DATA = {
  name: "Government Girls Higher Secondary School, Sagam",
  tagline: "Educating Girls, Building Futures",
  description:
    "A government institution dedicated to girls' education from classes 9th to 12th, with academic discipline and meaningful progress across all levels.",
  about_us:
    "Government Girls Higher Secondary School, Sagam serves the community by providing focused education for girls from classes 9th to 12th in a safe, disciplined, and encouraging environment.",
  institute_details: [
    "A government institution committed to accessible and quality girls' education.",
    "Supports learning from classes 9th to 12th, including stream options for senior secondary levels.",
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
      description: "Senior secondary study path for students focused on Biology and life science related careers.",
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
      subjects: ["Biology", "Chemistry", "Physics", "English"],
    },
    {
      stream: "Non-Medical",
      subjects: ["Mathematics", "Physics", "Chemistry", "English"],
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
  principal: {
    name: "Farooq Hussain Itoo",
    role: "Principal",
    message:
      "Our school is committed to academic excellence, values, and the all-round growth of every student.",
    photo: "",
  },
  facilities: [
    "Well-managed classrooms for classes 9th to 12th",
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
    { title: "Scholarship Guidance", url: "https://scholarships.gov.in/" },
  ],
  notification_items: [
    {
      id: "n-001",
      category: "Admissions",
      date: "2026-04-03",
      title: "Admissions Open for Classes 9th to 12th",
      summary: "Admission process is open for eligible students in the new academic session.",
      details:
        "Students seeking admission to classes 9th to 12th should complete the admission process within the announced dates. Stream selection applies to 11th and 12th classes.",
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
        link_url: "https://scholarships.gov.in/",
      },
    ],
    timetable: [
      {
        id: "tt-1",
        period: "1",
        time: "09:00 - 09:45",
        subject: "English",
        teacher: "Ms. P. Roy",
        detail: "English - Ms. P. Roy",
        class_name: "Class IX",
        stream: "General",
      },
      {
        id: "tt-2",
        period: "2",
        time: "09:45 - 10:30",
        subject: "Mathematics",
        teacher: "Ms. S. Iyer",
        detail: "Mathematics - Ms. S. Iyer",
        class_name: "Class IX",
        stream: "General",
      },
      {
        id: "tt-3",
        period: "3",
        time: "10:30 - 11:15",
        subject: "Science",
        teacher: "Mr. T. Ali",
        detail: "Science - Mr. T. Ali",
        class_name: "Class X",
        stream: "General",
      },
      {
        id: "tt-4",
        period: "4",
        time: "11:35 - 12:20",
        subject: "Social Science",
        teacher: "Mr. F. Ahmad",
        detail: "Social Science - Mr. F. Ahmad",
        class_name: "Class X",
        stream: "General",
      },
      {
        id: "tt-5",
        period: "1",
        time: "09:00 - 09:45",
        subject: "Biology",
        teacher: "Ms. N. Jan",
        detail: "Biology - Ms. N. Jan",
        class_name: "Class XI",
        stream: "Medical",
      },
      {
        id: "tt-6",
        period: "2",
        time: "09:45 - 10:30",
        subject: "Physics",
        teacher: "Dr. R. Mehta",
        detail: "Physics - Dr. R. Mehta",
        class_name: "Class XI",
        stream: "Medical",
      },
      {
        id: "tt-7",
        period: "1",
        time: "09:00 - 09:45",
        subject: "Mathematics",
        teacher: "Ms. S. Iyer",
        detail: "Mathematics - Ms. S. Iyer",
        class_name: "Class XI",
        stream: "Non-Medical",
      },
      {
        id: "tt-8",
        period: "2",
        time: "09:45 - 10:30",
        subject: "Physics",
        teacher: "Dr. R. Mehta",
        detail: "Physics - Dr. R. Mehta",
        class_name: "Class XI",
        stream: "Non-Medical",
      },
      {
        id: "tt-9",
        period: "1",
        time: "09:00 - 09:45",
        subject: "History",
        teacher: "Mr. F. Ahmad",
        detail: "History - Mr. F. Ahmad",
        class_name: "Class XI",
        stream: "Arts",
      },
      {
        id: "tt-10",
        period: "2",
        time: "09:45 - 10:30",
        subject: "English",
        teacher: "Ms. P. Roy",
        detail: "English - Ms. P. Roy",
        class_name: "Class XI",
        stream: "Arts",
      },
      {
        id: "tt-11",
        period: "1",
        time: "09:00 - 09:45",
        subject: "Biology",
        teacher: "Ms. N. Jan",
        detail: "Biology - Ms. N. Jan",
        class_name: "Class XII",
        stream: "Medical",
      },
      {
        id: "tt-12",
        period: "2",
        time: "09:45 - 10:30",
        subject: "Chemistry",
        teacher: "Mr. T. Ali",
        detail: "Chemistry - Mr. T. Ali",
        class_name: "Class XII",
        stream: "Medical",
      },
      {
        id: "tt-13",
        period: "1",
        time: "09:00 - 09:45",
        subject: "Mathematics",
        teacher: "Ms. S. Iyer",
        detail: "Mathematics - Ms. S. Iyer",
        class_name: "Class XII",
        stream: "Non-Medical",
      },
      {
        id: "tt-14",
        period: "2",
        time: "09:45 - 10:30",
        subject: "Chemistry",
        teacher: "Mr. T. Ali",
        detail: "Chemistry - Mr. T. Ali",
        class_name: "Class XII",
        stream: "Non-Medical",
      },
      {
        id: "tt-15",
        period: "1",
        time: "09:00 - 09:45",
        subject: "Political Science",
        teacher: "Mr. F. Ahmad",
        detail: "Political Science - Mr. F. Ahmad",
        class_name: "Class XII",
        stream: "Arts",
      },
      {
        id: "tt-16",
        period: "2",
        time: "09:45 - 10:30",
        subject: "English",
        teacher: "Ms. P. Roy",
        detail: "English - Ms. P. Roy",
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
              { name: "Physics", drive: "https://drive.google.com/drive/folders/physics-xi" },
              { name: "English", drive: "https://drive.google.com/drive/folders/english-xi" },
            ],
          },
          {
            stream: "Non-Medical",
            subjects: [
              { name: "Mathematics", drive: "https://drive.google.com/drive/folders/maths-xi" },
              { name: "Physics", drive: "https://drive.google.com/drive/folders/physics-xi" },
              { name: "Chemistry", drive: "https://drive.google.com/drive/folders/chemistry-xi" },
              { name: "English", drive: "https://drive.google.com/drive/folders/english-xi" },
            ],
          },
          {
            stream: "Arts",
            subjects: [
              { name: "History", drive: "https://drive.google.com/drive/folders/history-xi" },
              { name: "English", drive: "https://drive.google.com/drive/folders/english-xi" },
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
              { name: "Physics", drive: "https://drive.google.com/drive/folders/physics-xii" },
              { name: "English", drive: "https://drive.google.com/drive/folders/english-xii" },
            ],
          },
          {
            stream: "Non-Medical",
            subjects: [
              { name: "Mathematics", drive: "https://drive.google.com/drive/folders/maths-xii" },
              { name: "Physics", drive: "https://drive.google.com/drive/folders/physics-xii" },
              { name: "Chemistry", drive: "https://drive.google.com/drive/folders/chemistry-xii" },
              { name: "English", drive: "https://drive.google.com/drive/folders/english-xii" },
            ],
          },
          {
            stream: "Arts",
            subjects: [
              { name: "Political Science", drive: "https://drive.google.com/drive/folders/polscience-xii" },
              { name: "English", drive: "https://drive.google.com/drive/folders/english-xii" },
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
      { value: "IX-XII", label: "Classes Covered" },
      { value: "3", label: "Streams Offered" },
    ],
    reasons: [
      "Dedicated teaching from classes 9th to 12th, with stream specialization in senior classes.",
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
      href: "https://scholarships.gov.in/",
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

function getBootstrapStudentsFromEnv() {
  const raw = String(process.env.STUDENT_BOOTSTRAP_JSON || "").trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        const userId = String(item?.userId || item?.rollNumber || "").trim();
        const name = String(item?.name || "").trim();
        const dob = String(item?.dob || "").trim();
        const className = String(item?.className || "").trim();
        const stream = String(item?.stream || "").trim();
        const plainPassword = String(item?.password || "").trim();
        const providedHash = String(item?.passwordHash || "").trim();

        const passwordHash =
          providedHash && isPasswordHash(providedHash)
            ? providedHash
            : plainPassword
              ? hashPassword(plainPassword)
              : "";

        if (!userId || !name || !dob || !className || !stream || !passwordHash) {
          return null;
        }

        return {
          userId,
          rollNumber: userId,
          name,
          dob,
          className,
          stream,
          passwordHash,
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

const CSV_IMPORTED_STUDENTS = [
  { userId: "Malik1014", rollNumber: "Malik1014", name: "Malik Huma Gulzar", dob: "2012-03-27", className: "Class X", stream: "General", password: "M4l!k914" },
  { userId: "Saika1137", rollNumber: "Saika1137", name: "Saika amin", dob: "2010-03-10", className: "Class XI", stream: "Medical", password: "S@iKa137" },
  { userId: "Sehrish1043", rollNumber: "Sehrish1043", name: "Sehrish Mukthar", dob: "2012-06-21", className: "Class X", stream: "General", password: "Seh#1043" },
  { userId: "Imza1008", rollNumber: "Imza1008", name: "Imza Jan", dob: "2012-05-16", className: "Class X", stream: "General", password: "Imz@1008" },
  { userId: "Arbeena1009", rollNumber: "Arbeena1009", name: "Arbeena jan", dob: "2012-05-15", className: "Class X", stream: "General", password: "Arb!1009" },
  { userId: "Simran1106", rollNumber: "Simran1106", name: "Simran gulzar", dob: "2011-08-11", className: "Class XI", stream: "Arts", password: "Sim#1106" },
  { userId: "Salika1026", rollNumber: "Salika1026", name: "Salika jan", dob: "2012-06-22", className: "Class X", stream: "General", password: "Sal@1026" },
  { userId: "Athar1001", rollNumber: "Athar1001", name: "Athar Iqbal", dob: "2026-03-23", className: "Class X", stream: "General", password: "Ath!1001" },
  { userId: "Arbeena0907", rollNumber: "Arbeena0907", name: "Arbeena fayaz", dob: "2013-03-02", className: "Class IX", stream: "General", password: "ArB@0907" },
  { userId: "Seerat1106", rollNumber: "Seerat1106", name: "Seerat ashraf", dob: "2011-03-07", className: "Class XI", stream: "Arts", password: "See#1106" },
  { userId: "Suraya1005", rollNumber: "Suraya1005", name: "Suraya nabi bhat", dob: "2012-04-10", className: "Class X", stream: "General", password: "Sur@1005" },
  { userId: "Irtiza1030", rollNumber: "Irtiza1030", name: "Irtiza farooq", dob: "2011-08-07", className: "Class X", stream: "General", password: "Irt#1030" },
  { userId: "Aisha1032", rollNumber: "Aisha1032", name: "Aisha shafi", dob: "2011-10-24", className: "Class X", stream: "General", password: "Ais@1032" },
  { userId: "Simran1002", rollNumber: "Simran1002", name: "Simran jan", dob: "2012-07-03", className: "Class X", stream: "General", password: "Sim!1002" },
  { userId: "Talha1019", rollNumber: "Talha1019", name: "Talha jahan", dob: "2012-10-21", className: "Class X", stream: "General", password: "Tal@1019" },
  { userId: "Talha1047", rollNumber: "Talha1047", name: "Talha nisar", dob: "2010-12-18", className: "Class X", stream: "General", password: "TaL#1047" },
];

const DEFAULT_STUDENTS = (() => {
  const fromEnv = getBootstrapStudentsFromEnv();
  return fromEnv.length ? fromEnv : CSV_IMPORTED_STUDENTS;
})();

function getBootstrapTeachersFromEnv() {
  const raw = String(process.env.TEACHER_BOOTSTRAP_JSON || "").trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        const username = String(item?.username || item?.userId || "").trim();
        const name = String(item?.name || "").trim();
        const className = String(item?.className || "").trim();
        const stream = String(item?.stream || "").trim();
        const subjects = Array.isArray(item?.subjects)
          ? item.subjects.map((subject) => String(subject || "").trim()).filter(Boolean)
          : [];
        const plainPassword = String(item?.password || "").trim();
        const providedHash = String(item?.passwordHash || "").trim();

        const passwordHash =
          providedHash && isPasswordHash(providedHash)
            ? providedHash
            : plainPassword
              ? hashPassword(plainPassword)
              : "";

        if (!username || !name || !className || !stream || !subjects.length || !passwordHash) {
          return null;
        }

        return {
          userId: username,
          username,
          name,
          className,
          stream,
          subjects,
          passwordHash,
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

const IMPORTED_TEACHERS = [
  { userId: "MudasirG", username: "MudasirG", name: "Mudasir Gulzar", className: "All", stream: "All", subjects: ["English"], password: "MuD@5139" },
  { userId: "MuzafarR", username: "MuzafarR", name: "Muzafar Rashid", className: "All", stream: "All", subjects: ["Science"], password: "MuZ#7421" },
  { userId: "AjazR", username: "AjazR", name: "Ajaz Ahmad Rather", className: "All", stream: "All", subjects: ["Biology"], password: "AjR@6385" },
  { userId: "AshakB", username: "AshakB", name: "Ashak Hussain Bhat", className: "All", stream: "All", subjects: ["Urdu"], password: "AsH!9042" },
  { userId: "AshrafB", username: "AshrafB", name: "Mohammad Ashraf Bhat", className: "All", stream: "All", subjects: ["Chemistry"], password: "AsB#7754" },
  { userId: "KhursheedS", username: "KhursheedS", name: "Khursheed Ahmad Sheikh", className: "All", stream: "All", subjects: ["Botany"], password: "KhS@4682" },
  { userId: "SajadB", username: "SajadB", name: "Sajad Ahmad Bhat", className: "All", stream: "All", subjects: ["Mathematics"], password: "SaB!3579" },
  { userId: "YousufB", username: "YousufB", name: "Mohammad Yousuf Bhat", className: "All", stream: "All", subjects: ["Physics"], password: "YoB#8264" },
  { userId: "ShabirS", username: "ShabirS", name: "Shabir Ahmad Sheikh", className: "All", stream: "All", subjects: ["Zoology"], password: "ShS@5917" },
];

const DEFAULT_TEACHERS = (() => {
  const fromEnv = getBootstrapTeachersFromEnv();
  return fromEnv.length ? fromEnv : IMPORTED_TEACHERS;
})();

const DEFAULT_STATE = {
  contacts: [],
  developerInbox: [],
  admissions: [],
  adminSessions: {},
  loginFailures: {},
  rateLimits: {},
  backups: [],
  monitoring: {
    webVitals: [],
    apiLatency: [],
  },
  students: structuredClone(DEFAULT_STUDENTS),
  teachers: structuredClone(DEFAULT_TEACHERS),
  instituteData: structuredClone(DEFAULT_INSTITUTE_DATA),
  __meta: {
    version: 0,
  },
};
const allowMemoryFallback = process.env.ALLOW_MEMORY_STORE_FALLBACK
  ? String(process.env.ALLOW_MEMORY_STORE_FALLBACK).trim() !== "0"
  : process.env.NODE_ENV !== "production";
const dbOperationTimeoutMs = Number(process.env.DB_OPERATION_TIMEOUT_MS || 12000);
let memoryStore = null;
let warnedMemoryFallback = false;

function withTimeout(promise, timeoutMs, label) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

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
  }

  store.instituteData.faculties = store.instituteData.faculties.map((item) => ({
    name: String(item?.name || "").trim(),
    designation: String(item?.designation || item?.department || "").trim(),
    qualification: String(item?.qualification || "").trim(),
    photo: String(item?.photo || "").trim(),
  }));

  const principal =
    store.instituteData.principal && typeof store.instituteData.principal === "object"
      ? store.instituteData.principal
      : {};

  store.instituteData.principal = {
    name: String(principal.name || "").trim(),
    role: String(principal.role || "Principal").trim() || "Principal",
    message: String(principal.message || "").trim(),
    photo: String(principal.photo || DEFAULT_INSTITUTE_DATA.principal.photo || "").trim(),
  };
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

  store.students = (store.students || [])
    .map((item) => {
      const userId = String(item?.userId || item?.rollNumber || "").trim();
      const name = String(item?.name || "").trim();
      const dob = String(item?.dob || "").trim();
      const className = String(item?.className || "").trim();
      const stream = String(item?.stream || "").trim();
      const legacyPassword = String(item?.password || "").trim();
      const existingHash = String(item?.passwordHash || "").trim();

      let passwordHash = existingHash;
      if (!passwordHash) {
        if (isPasswordHash(legacyPassword)) {
          passwordHash = legacyPassword;
        } else if (legacyPassword) {
          passwordHash = hashPassword(legacyPassword);
        }
      } else if (!isPasswordHash(passwordHash)) {
        passwordHash = hashPassword(passwordHash);
      }

      if (!userId || !name || !className || !stream || !passwordHash) {
        return null;
      }

      return {
        userId,
        rollNumber: userId,
        name,
        dob,
        className,
        stream,
        stars: Number.isFinite(Number(item?.stars)) ? Math.max(0, Math.floor(Number(item.stars))) : 0,
        passwordHash,
      };
    })
    .filter(Boolean);

  if (!store.students.length) {
    store.students = structuredClone(DEFAULT_STUDENTS).map((item) => ({
      userId: item.userId || item.rollNumber,
      rollNumber: item.userId || item.rollNumber,
      name: item.name,
      dob: item.dob || "",
      className: item.className,
      stream: item.stream,
      stars: Number.isFinite(Number(item?.stars)) ? Math.max(0, Math.floor(Number(item.stars))) : 0,
      passwordHash: item.passwordHash || (item.password ? hashPassword(item.password) : ""),
    }));
  }

  // Ensure CSV-imported students are present even when older persisted data already exists.
  const existingByUserId = new Set((store.students || []).map((item) => String(item?.userId || "").trim().toLowerCase()));
  for (const item of CSV_IMPORTED_STUDENTS) {
    const userId = String(item?.userId || "").trim();
    if (!userId || existingByUserId.has(userId.toLowerCase())) {
      continue;
    }
    store.students.push({
      userId,
      rollNumber: userId,
      name: String(item?.name || "").trim(),
      dob: String(item?.dob || "").trim(),
      className: String(item?.className || "").trim(),
      stream: String(item?.stream || "").trim(),
      stars: Number.isFinite(Number(item?.stars)) ? Math.max(0, Math.floor(Number(item.stars))) : 0,
      passwordHash: item?.passwordHash || (item?.password ? hashPassword(String(item.password)) : ""),
    });
    existingByUserId.add(userId.toLowerCase());
  }
}

function resetTeacherShape(store) {
  if (!Array.isArray(store.teachers)) {
    store.teachers = [];
  }

  store.teachers = (store.teachers || [])
    .map((item) => {
      const username = String(item?.username || item?.userId || "").trim();
      const name = String(item?.name || "").trim();
      const className = String(item?.className || "").trim();
      const stream = String(item?.stream || "").trim();
      const subjects = Array.isArray(item?.subjects)
        ? item.subjects.map((subject) => String(subject || "").trim()).filter(Boolean)
        : [];
      const legacyPassword = String(item?.password || "").trim();
      const existingHash = String(item?.passwordHash || "").trim();

      let passwordHash = existingHash;
      if (!passwordHash) {
        if (isPasswordHash(legacyPassword)) {
          passwordHash = legacyPassword;
        } else if (legacyPassword) {
          passwordHash = hashPassword(legacyPassword);
        }
      } else if (!isPasswordHash(passwordHash)) {
        passwordHash = hashPassword(passwordHash);
      }

      if (!username || !name || !className || !stream || !subjects.length || !passwordHash) {
        return null;
      }

      return {
        userId: username,
        username,
        name,
        className,
        stream,
        subjects,
        passwordHash,
      };
    })
    .filter(Boolean);

  const existingByUsername = new Set((store.teachers || []).map((item) => String(item?.username || item?.userId || "").trim().toLowerCase()));
  for (const item of IMPORTED_TEACHERS) {
    const username = String(item?.username || item?.userId || "").trim();
    if (!username || existingByUsername.has(username.toLowerCase())) {
      continue;
    }
    store.teachers.push({
      userId: username,
      username,
      name: String(item?.name || "").trim(),
      className: String(item?.className || "").trim(),
      stream: String(item?.stream || "").trim(),
      subjects: Array.isArray(item?.subjects) ? item.subjects.map((subject) => String(subject || "").trim()).filter(Boolean) : [],
      passwordHash: item?.passwordHash || (item?.password ? hashPassword(String(item.password)) : ""),
    });
    existingByUsername.add(username.toLowerCase());
  }
}

function resetRateLimitShape(store) {
  if (!store.rateLimits || typeof store.rateLimits !== "object") {
    store.rateLimits = {};
  }
}

function resetBackupsShape(store) {
  if (!Array.isArray(store.backups)) {
    store.backups = [];
  }
}

function resetMonitoringShape(store) {
  if (!store.monitoring || typeof store.monitoring !== "object") {
    store.monitoring = { webVitals: [], apiLatency: [] };
    return;
  }

  if (!Array.isArray(store.monitoring.webVitals)) {
    store.monitoring.webVitals = [];
  }

  if (!Array.isArray(store.monitoring.apiLatency)) {
    store.monitoring.apiLatency = [];
  }
}

function resetMetaShape(store) {
  const version = Number(store?.__meta?.version || 0);
  store.__meta = {
    version: Number.isFinite(version) && version >= 0 ? Math.floor(version) : 0,
  };
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
  resetTeacherShape(store);
  resetAdmissionsShape(store);
  resetRateLimitShape(store);
  resetBackupsShape(store);
  resetMonitoringShape(store);
  resetMetaShape(store);
  if (!Array.isArray(store.contacts)) {
    store.contacts = [];
  }
  if (!Array.isArray(store.developerInbox)) {
    store.developerInbox = [];
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

function getCollectionNames() {
  const base = getCollectionName();
  return {
    meta: `${base}_meta`,
    contacts: `${base}_contacts`,
    developerInbox: `${base}_developer_inbox`,
    admissions: `${base}_admissions`,
    students: `${base}_students`,
    teachers: `${base}_teachers`,
    instituteData: `${base}_institute`,
    adminSessions: `${base}_admin_sessions`,
    loginFailures: `${base}_login_failures`,
    rateLimits: `${base}_rate_limits`,
    backups: `${base}_backups`,
    monitoring: `${base}_monitoring`,
  };
}

function getDefaultStateForPersistence() {
  return normalizeStoreShape(structuredClone(DEFAULT_STATE));
}

async function findMainDoc(collection, label) {
  return withTimeout(collection.findOne({ _id: "main" }), dbOperationTimeoutMs, label);
}

async function readCollectionState(db) {
  const names = getCollectionNames();
  const [
    metaDoc,
    contactsDoc,
    developerInboxDoc,
    admissionsDoc,
    studentsDoc,
    teachersDoc,
    instituteDoc,
    adminSessionsDoc,
    loginFailuresDoc,
    rateLimitsDoc,
    backupsDoc,
    monitoringDoc,
  ] = await Promise.all([
    findMainDoc(db.collection(names.meta), "Read state meta"),
    findMainDoc(db.collection(names.contacts), "Read contacts"),
    findMainDoc(db.collection(names.developerInbox), "Read developer inbox"),
    findMainDoc(db.collection(names.admissions), "Read admissions"),
    findMainDoc(db.collection(names.students), "Read students"),
    findMainDoc(db.collection(names.teachers), "Read teachers"),
    findMainDoc(db.collection(names.instituteData), "Read institute data"),
    findMainDoc(db.collection(names.adminSessions), "Read admin sessions"),
    findMainDoc(db.collection(names.loginFailures), "Read login failures"),
    findMainDoc(db.collection(names.rateLimits), "Read rate limits"),
    findMainDoc(db.collection(names.backups), "Read backups"),
    findMainDoc(db.collection(names.monitoring), "Read monitoring"),
  ]);

  return {
    hasExistingState: Boolean(metaDoc),
    state: {
      contacts: contactsDoc?.items || [],
      developerInbox: developerInboxDoc?.items || [],
      admissions: admissionsDoc?.items || [],
      students: studentsDoc?.items || [],
      teachers: teachersDoc?.items || [],
      instituteData: instituteDoc?.value || {},
      adminSessions: adminSessionsDoc?.value || {},
      loginFailures: loginFailuresDoc?.value || {},
      rateLimits: rateLimitsDoc?.value || {},
      backups: backupsDoc?.items || [],
      monitoring: monitoringDoc?.value || { webVitals: [], apiLatency: [] },
      __meta: {
        version: Number(metaDoc?.version || 0),
      },
    },
  };
}

async function writeCollectionState(db, normalized, expectedVersion) {
  const names = getCollectionNames();
  const now = new Date().toISOString();
  const metaCollection = db.collection(names.meta);

  const currentMeta = await findMainDoc(metaCollection, "Read state meta");
  const currentVersion = Number(currentMeta?.version || 0);
  const baselineVersion =
    Number.isFinite(expectedVersion) && expectedVersion > 0 ? expectedVersion : currentVersion;

  if (baselineVersion !== currentVersion) {
    const conflict = new Error("State changed on the server. Please refresh and retry.");
    conflict.code = "STATE_CONFLICT";
    throw conflict;
  }

  const nextVersion = currentVersion + 1;

  const metaWriteResult = await withTimeout(
    metaCollection.updateOne(
      { _id: "main", version: currentVersion },
      { $set: { version: nextVersion, updatedAt: now } },
      { upsert: !currentMeta }
    ),
    dbOperationTimeoutMs,
    "Write state meta"
  );

  const metaMatched = Number(metaWriteResult?.matchedCount || 0);
  const metaUpserted = Number(metaWriteResult?.upsertedCount || 0);
  if (!metaMatched && !metaUpserted) {
    const conflict = new Error("State changed on the server. Please refresh and retry.");
    conflict.code = "STATE_CONFLICT";
    throw conflict;
  }

  await Promise.all([
    withTimeout(
      db
        .collection(names.contacts)
        .updateOne({ _id: "main" }, { $set: { items: normalized.contacts, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write contacts"
    ),
    withTimeout(
      db
        .collection(names.developerInbox)
        .updateOne({ _id: "main" }, { $set: { items: normalized.developerInbox, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write developer inbox"
    ),
    withTimeout(
      db
        .collection(names.admissions)
        .updateOne({ _id: "main" }, { $set: { items: normalized.admissions, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write admissions"
    ),
    withTimeout(
      db
        .collection(names.students)
        .updateOne({ _id: "main" }, { $set: { items: normalized.students, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write students"
    ),
    withTimeout(
      db
        .collection(names.teachers)
        .updateOne({ _id: "main" }, { $set: { items: normalized.teachers, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write teachers"
    ),
    withTimeout(
      db
        .collection(names.instituteData)
        .updateOne({ _id: "main" }, { $set: { value: normalized.instituteData, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write institute data"
    ),
    withTimeout(
      db
        .collection(names.adminSessions)
        .updateOne({ _id: "main" }, { $set: { value: normalized.adminSessions, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write admin sessions"
    ),
    withTimeout(
      db
        .collection(names.loginFailures)
        .updateOne({ _id: "main" }, { $set: { value: normalized.loginFailures, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write login failures"
    ),
    withTimeout(
      db.collection(names.rateLimits).updateOne({ _id: "main" }, { $set: { value: normalized.rateLimits, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write rate limits"
    ),
    withTimeout(
      db.collection(names.backups).updateOne({ _id: "main" }, { $set: { items: normalized.backups, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write backups"
    ),
    withTimeout(
      db
        .collection(names.monitoring)
        .updateOne({ _id: "main" }, { $set: { value: normalized.monitoring, version: nextVersion, updatedAt: now } }, { upsert: true }),
      dbOperationTimeoutMs,
      "Write monitoring"
    ),
  ]);

  return nextVersion;
}

export async function getStore() {
  try {
    const db = await withTimeout(getDb(), dbOperationTimeoutMs, "Database connection");
    const { state, hasExistingState } = await readCollectionState(db);
    const store = normalizeStoreShape({
      ...structuredClone(DEFAULT_STATE),
      ...state,
      __meta: {
        version: Number(state?.__meta?.version || 0),
      },
    });
    if (!hasExistingState) {
      const version = await writeCollectionState(db, store, 0);
      store.__meta.version = version;
      return store;
    }
    return store;
  } catch (err) {
    if (!allowMemoryFallback) {
      throw err;
    }
    if (!memoryStore) {
      memoryStore = getDefaultStateForPersistence();
    }
    if (!warnedMemoryFallback) {
      warnedMemoryFallback = true;
      console.warn(
        "[store] MongoDB unavailable. Falling back to in-memory state. Data will reset on server restart.",
        err instanceof Error ? err.message : err
      );
    }
    return memoryStore;
  }
}

export async function saveStore(store) {
  const normalized = normalizeStoreShape(store);
  try {
    const db = await withTimeout(getDb(), dbOperationTimeoutMs, "Database connection");
    const expectedVersion = Number(normalized?.__meta?.version || 0);
    const nextVersion = await writeCollectionState(db, normalized, expectedVersion);
    normalized.__meta.version = nextVersion;
    store.__meta = { version: nextVersion };
  } catch (err) {
    if (!allowMemoryFallback) {
      throw err;
    }
    const currentVersion = Number(memoryStore?.__meta?.version || 0);
    const nextVersion = currentVersion + 1;
    normalized.__meta.version = nextVersion;
    store.__meta = { version: nextVersion };
    memoryStore = normalized;
    if (!warnedMemoryFallback) {
      warnedMemoryFallback = true;
      console.warn(
        "[store] MongoDB unavailable. Continuing with in-memory state.",
        err instanceof Error ? err.message : err
      );
    }
  }
}


