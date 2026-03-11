import hmac
import os
import secrets
import time
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, Header, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.middleware.trustedhost import TrustedHostMiddleware


def parse_csv_env(env_name: str, default: str) -> List[str]:
    value = os.getenv(env_name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "change-me-123")
TOKEN_TTL_SECONDS = int(os.getenv("ADMIN_TOKEN_TTL_SECONDS", str(60 * 60 * 8)))
FAILED_LOGIN_LIMIT = int(os.getenv("ADMIN_FAILED_LOGIN_LIMIT", "5"))
LOCKOUT_SECONDS = int(os.getenv("ADMIN_LOCKOUT_SECONDS", str(60 * 5)))
CORS_ORIGINS = parse_csv_env("CORS_ALLOW_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
ALLOWED_HOSTS = parse_csv_env("ALLOWED_HOSTS", "localhost,127.0.0.1")

if ENVIRONMENT == "production" and ADMIN_PASSWORD == "change-me-123":
    raise RuntimeError("Set a strong ADMIN_PASSWORD before running in production.")

app = FastAPI(title="Institute API", version="2.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if ALLOWED_HOSTS and "*" not in ALLOWED_HOSTS:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Cross-Origin-Resource-Policy"] = "same-origin"
    if ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


class AcademicItem(BaseModel):
    title: str
    description: str


class Notice(BaseModel):
    text: str


class DownloadItem(BaseModel):
    title: str
    url: str


class ContactInfo(BaseModel):
    email: str
    phone: str
    address: str


class FacultyItem(BaseModel):
    name: str
    department: str
    qualification: str


class StreamItem(BaseModel):
    stream: str
    subjects: List[str]


class StaffItem(BaseModel):
    name: str
    role: str


class SiteControls(BaseModel):
    notifications_page_enabled: bool
    academics_page_enabled: bool
    admission_open: bool


class NotificationItem(BaseModel):
    id: str
    title: str
    category: str
    date: str
    summary: str
    details: str
    image_url: str = ""
    link_label: str = ""
    link_url: str = ""


class AcademicNoticeItem(BaseModel):
    id: str
    headline: str
    description: str
    time: str
    image_url: str = ""
    link_label: str = ""
    link_url: str = ""


class TimetableItem(BaseModel):
    id: str
    period: str
    time: str
    detail: str
    class_name: str
    stream: str


class SubjectMaterial(BaseModel):
    name: str
    drive: str


class StreamMaterials(BaseModel):
    stream: str
    subjects: List[SubjectMaterial]


class ClassMaterials(BaseModel):
    class_name: str
    streams: List[StreamMaterials]


class AcademicContent(BaseModel):
    noticeboard: List[AcademicNoticeItem]
    timetable: List[TimetableItem]
    materials: List[ClassMaterials]


class InstituteResponse(BaseModel):
    name: str
    tagline: str
    description: str
    about_us: str
    institute_details: List[str]
    admission_form_url: str
    site_controls: SiteControls
    academics: List[AcademicItem]
    faculties: List[FacultyItem]
    streams_subjects: List[StreamItem]
    staff: List[StaffItem]
    facilities: List[str]
    notices: List[Notice]
    downloads: List[DownloadItem]
    contact: ContactInfo
    notification_items: List[NotificationItem]
    academic_content: AcademicContent


class ContactRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    program_interest: str
    message: str


class LoginRequest(BaseModel):
    username: str
    password: str


class NoticeCreate(BaseModel):
    text: str


class DownloadCreate(BaseModel):
    title: str
    url: str


class AdminControlUpdate(BaseModel):
    notifications_page_enabled: Optional[bool] = None
    academics_page_enabled: Optional[bool] = None
    admission_open: Optional[bool] = None
    admission_form_url: Optional[str] = None


class NotificationItemCreate(BaseModel):
    title: str
    category: str
    date: str
    summary: str
    details: str
    image_url: str = ""
    link_label: str = ""
    link_url: str = ""


class NotificationItemUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    summary: Optional[str] = None
    details: Optional[str] = None
    image_url: Optional[str] = None
    link_label: Optional[str] = None
    link_url: Optional[str] = None


class AcademicNoticeCreate(BaseModel):
    headline: str
    description: str
    time: str
    image_url: str = ""
    link_label: str = ""
    link_url: str = ""


class AcademicNoticeUpdate(BaseModel):
    headline: Optional[str] = None
    description: Optional[str] = None
    time: Optional[str] = None
    image_url: Optional[str] = None
    link_label: Optional[str] = None
    link_url: Optional[str] = None


class TimetableCreate(BaseModel):
    period: str
    time: str
    detail: str
    class_name: str
    stream: str


class TimetableUpdate(BaseModel):
    period: Optional[str] = None
    time: Optional[str] = None
    detail: Optional[str] = None
    class_name: Optional[str] = None
    stream: Optional[str] = None


class MaterialsUpdate(BaseModel):
    materials: List[ClassMaterials]


contacts: List[ContactRequest] = []
admin_sessions: Dict[str, float] = {}
login_failures: Dict[str, Dict[str, float]] = {}

institute_data: Dict[str, Any] = {
    "name": "Government Girls Higher Secondary School, Sagam",
    "tagline": "Learn Today, Lead Tomorrow",
    "description": "A student-first institute with practical teaching and strong outcomes.",
    "about_us": "Bright Future Institute provides value-based education with modern teaching methods, experienced faculty, and a focus on student growth.",
    "institute_details": [
        "Established in 2004 with a mission to provide holistic education.",
        "Recognized by the state education board and affiliated with national-level exam preparation partners.",
        "Consistent academic performance with strong student mentoring and career guidance.",
    ],
    "admission_form_url": "https://forms.google.com",
    "site_controls": {
        "notifications_page_enabled": True,
        "academics_page_enabled": True,
        "admission_open": True,
    },
    "academics": [
        {"title": "Science Stream", "description": "Strong foundation in Physics, Chemistry, Mathematics, and Biology."},
        {"title": "Commerce Stream", "description": "Focused courses in Accountancy, Economics, and Business Studies."},
        {"title": "Arts & Humanities", "description": "Language, social science, and creative development tracks."},
    ],
    "faculties": [
        {"name": "Dr. R. Mehta", "department": "Physics", "qualification": "PhD (Physics)"},
        {"name": "Ms. S. Iyer", "department": "Mathematics", "qualification": "M.Sc, B.Ed"},
        {"name": "Mr. A. Khan", "department": "Commerce", "qualification": "M.Com, NET"},
        {"name": "Ms. P. Roy", "department": "English", "qualification": "M.A (English)"},
    ],
    "streams_subjects": [
        {"stream": "Science", "subjects": ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"]},
        {"stream": "Commerce", "subjects": ["Accountancy", "Economics", "Business Studies", "Mathematics", "Informatics Practices"]},
        {"stream": "Arts", "subjects": ["History", "Political Science", "Geography", "Sociology", "English"]},
    ],
    "staff": [
        {"name": "Mrs. K. Sharma", "role": "Principal"},
        {"name": "Mr. D. Verma", "role": "Vice Principal"},
        {"name": "Ms. L. Dsouza", "role": "Counselor"},
        {"name": "Mr. N. Patil", "role": "Lab Assistant"},
    ],
    "facilities": [
        "Smart classrooms",
        "Science and computer laboratories",
        "Library and reading hall",
        "Sports ground and indoor games",
        "Transport and medical support",
    ],
    "notices": [
        {"text": "Admissions for 2026-27 are open now."},
        {"text": "Parent-teacher meeting on April 15, 2026."},
    ],
    "downloads": [
        {"title": "Prospectus 2026", "url": "https://example.com/prospectus.pdf"},
        {"title": "Academic Calendar", "url": "https://example.com/academic-calendar.pdf"},
    ],
    "notification_items": [
        {
            "id": "n-001",
            "category": "Admissions",
            "date": "2026-04-03",
            "title": "Admission Form Submission Window Open",
            "summary": "Online admission submissions are open for session 2026-27.",
            "details": "Students can submit admission applications through the official Google Form. Keep scanned copies of required documents ready before submission.",
            "image_url": "",
            "link_label": "Open Admission Form",
            "link_url": "https://forms.google.com",
        },
        {
            "id": "n-002",
            "category": "Examinations",
            "date": "2026-04-06",
            "title": "Unit Test Schedule Published",
            "summary": "Unit test dates for Classes 11 and 12 have been released.",
            "details": "Exams will be conducted in morning sessions. Students should check section-wise timetables and report 20 minutes before exam start.",
            "image_url": "",
            "link_label": "Download Unit Test Schedule",
            "link_url": "https://example.com/unit-test-schedule.pdf",
        },
    ],
    "academic_content": {
        "noticeboard": [
            {
                "id": "an-1",
                "headline": "Chemistry practical files submission today",
                "description": "Class XI and XII chemistry practical files must be submitted before 2:00 PM.",
                "time": "08:50 AM",
                "image_url": "",
                "link_label": "Submission Guidelines",
                "link_url": "https://example.com/chemistry-practical",
            }
        ],
        "timetable": [
            {"id": "tt-1", "period": "1", "time": "09:00 - 09:45", "detail": "Core Subject", "class_name": "Class XI", "stream": "Science"},
            {"id": "tt-2", "period": "2", "time": "09:45 - 10:30", "detail": "Core Subject", "class_name": "Class XI", "stream": "Science"},
            {"id": "tt-3", "period": "1", "time": "09:00 - 09:45", "detail": "Accountancy", "class_name": "Class XII", "stream": "Commerce"},
        ],
        "materials": [
            {
                "class_name": "Class XI",
                "streams": [
                    {
                        "stream": "Science",
                        "subjects": [
                            {"name": "Physics", "drive": "https://drive.google.com/drive/folders/physics-xi"},
                            {"name": "Chemistry", "drive": "https://drive.google.com/drive/folders/chemistry-xi"},
                        ],
                    },
                    {
                        "stream": "Commerce",
                        "subjects": [
                            {"name": "Accountancy", "drive": "https://drive.google.com/drive/folders/accountancy-xi"},
                        ],
                    },
                ],
            },
            {
                "class_name": "Class XII",
                "streams": [
                    {
                        "stream": "Science",
                        "subjects": [
                            {"name": "Physics", "drive": "https://drive.google.com/drive/folders/physics-xii"},
                            {"name": "Biology", "drive": "https://drive.google.com/drive/folders/biology-xii"},
                        ],
                    },
                    {
                        "stream": "Arts",
                        "subjects": [
                            {"name": "History", "drive": "https://drive.google.com/drive/folders/history-xii"},
                        ],
                    },
                ],
            },
        ],
    },
    "contact": {
        "email": "info@brightfuture.edu",
        "phone": "+91-9876543210",
        "address": "Main Road, City, State, India",
    },
}


def verify_admin_token(authorization: str = Header(default="")) -> None:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    token = authorization.split(" ", 1)[1].strip()
    expires_at = admin_sessions.get(token)
    if not expires_at:
        raise HTTPException(status_code=401, detail="Session expired. Please login again.")

    if time.time() > expires_at:
        admin_sessions.pop(token, None)
        raise HTTPException(status_code=401, detail="Session expired. Please login again.")


def validate_controls_shape() -> None:
    controls = institute_data.get("site_controls")
    if not isinstance(controls, dict):
        institute_data["site_controls"] = {
            "notifications_page_enabled": True,
            "academics_page_enabled": True,
            "admission_open": True,
        }


def validate_content_shape() -> None:
    if not isinstance(institute_data.get("notification_items"), list):
        institute_data["notification_items"] = []

    academic_content = institute_data.get("academic_content")
    if not isinstance(academic_content, dict):
        institute_data["academic_content"] = {"noticeboard": [], "timetable": [], "materials": []}
        return

    for key in ["noticeboard", "timetable", "materials"]:
        if not isinstance(academic_content.get(key), list):
            academic_content[key] = []


def create_id(prefix: str) -> str:
    return f"{prefix}-{secrets.token_hex(4)}"


def assert_non_empty(field_name: str, value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise HTTPException(status_code=400, detail=f"{field_name} cannot be empty")
    return cleaned


def assert_optional_http_url(field_name: str, value: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        return ""
    if not (cleaned.startswith("http://") or cleaned.startswith("https://")):
        raise HTTPException(status_code=400, detail=f"{field_name} must start with http:// or https://")
    return cleaned


def get_login_bucket(username: str) -> Dict[str, float]:
    bucket = login_failures.get(username)
    if not bucket:
        bucket = {"count": 0, "locked_until": 0.0}
        login_failures[username] = bucket
    return bucket


def find_item_index(items: List[Dict[str, Any]], item_id: str) -> int:
    for index, item in enumerate(items):
        if item.get("id") == item_id:
            return index
    raise HTTPException(status_code=404, detail="Item not found")


@app.get("/")
def home():
    return {"message": "Institute API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/institute", response_model=InstituteResponse)
def get_institute():
    validate_controls_shape()
    validate_content_shape()
    return institute_data


@app.post("/contact")
def submit_contact(payload: ContactRequest):
    contacts.append(payload)
    return {"success": True, "message": "Thanks for contacting us. Our team will reach out soon."}


@app.post("/admin/login")
def admin_login(payload: LoginRequest):
    username = payload.username.strip()
    bucket = get_login_bucket(username)
    now = time.time()

    if now < bucket["locked_until"]:
        raise HTTPException(status_code=429, detail="Account temporarily locked. Please try again later.")

    is_valid_user = hmac.compare_digest(username, ADMIN_USERNAME)
    is_valid_password = hmac.compare_digest(payload.password, ADMIN_PASSWORD)

    if not is_valid_user or not is_valid_password:
        bucket["count"] += 1
        if bucket["count"] >= FAILED_LOGIN_LIMIT:
            bucket["count"] = 0
            bucket["locked_until"] = now + LOCKOUT_SECONDS
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 5 minutes.")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    login_failures[username] = {"count": 0, "locked_until": 0.0}
    admin_sessions.clear()

    token = secrets.token_urlsafe(32)
    admin_sessions[token] = now + TOKEN_TTL_SECONDS
    return {
        "success": True,
        "token": token,
        "expires_in": TOKEN_TTL_SECONDS,
    }


@app.get("/admin/notices")
def list_admin_notices(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    notices = institute_data.get("notices", [])
    return [{"index": index, "text": notice["text"]} for index, notice in enumerate(notices)]


@app.post("/admin/notices")
def add_admin_notice(payload: NoticeCreate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Notice cannot be empty")
    institute_data["notices"].insert(0, {"text": text})
    return {"success": True, "message": "Notice published."}


@app.delete("/admin/notices/{notice_index}")
def delete_admin_notice(notice_index: int, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    notices = institute_data.get("notices", [])
    if notice_index < 0 or notice_index >= len(notices):
        raise HTTPException(status_code=404, detail="Notice not found")
    notices.pop(notice_index)
    return {"success": True, "message": "Notice removed."}


@app.get("/admin/downloads")
def list_admin_downloads(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    downloads = institute_data.get("downloads", [])
    return [{"index": index, **item} for index, item in enumerate(downloads)]


@app.post("/admin/downloads")
def add_admin_download(payload: DownloadCreate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    title = payload.title.strip()
    url = payload.url.strip()
    if not title or not url:
        raise HTTPException(status_code=400, detail="Title and URL are required")
    institute_data["downloads"].insert(0, {"title": title, "url": url})
    return {"success": True, "message": "Download item added."}


@app.delete("/admin/downloads/{download_index}")
def delete_admin_download(download_index: int, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    downloads = institute_data.get("downloads", [])
    if download_index < 0 or download_index >= len(downloads):
        raise HTTPException(status_code=404, detail="Download item not found")
    downloads.pop(download_index)
    return {"success": True, "message": "Download item removed."}


@app.get("/admin/contacts")
def get_admin_contacts(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    return contacts


@app.delete("/admin/contacts")
def clear_admin_contacts(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    contacts.clear()
    return {"success": True, "message": "All enquiries cleared."}


@app.get("/admin/controls")
def get_admin_controls(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_controls_shape()
    controls = institute_data["site_controls"]
    return {
        "notifications_page_enabled": bool(controls.get("notifications_page_enabled", True)),
        "academics_page_enabled": bool(controls.get("academics_page_enabled", True)),
        "admission_open": bool(controls.get("admission_open", True)),
        "admission_form_url": institute_data.get("admission_form_url", "https://forms.google.com"),
    }


@app.patch("/admin/controls")
def update_admin_controls(payload: AdminControlUpdate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_controls_shape()

    controls = institute_data["site_controls"]

    if payload.notifications_page_enabled is not None:
        controls["notifications_page_enabled"] = bool(payload.notifications_page_enabled)

    if payload.academics_page_enabled is not None:
        controls["academics_page_enabled"] = bool(payload.academics_page_enabled)

    if payload.admission_open is not None:
        controls["admission_open"] = bool(payload.admission_open)

    if payload.admission_form_url is not None:
        form_url = payload.admission_form_url.strip()
        if not form_url:
            raise HTTPException(status_code=400, detail="Admission form URL cannot be empty")
        if not (form_url.startswith("http://") or form_url.startswith("https://")):
            raise HTTPException(status_code=400, detail="Admission form URL must start with http:// or https://")
        institute_data["admission_form_url"] = form_url

    return {"success": True, "message": "Controls updated.", **get_admin_controls(authorization)}


@app.get("/admin/notification-items")
def list_notification_items(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()
    return institute_data["notification_items"]


@app.post("/admin/notification-items")
def add_notification_item(payload: NotificationItemCreate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    title = assert_non_empty("Title", payload.title)
    category = assert_non_empty("Category", payload.category)
    date = assert_non_empty("Date", payload.date)
    summary = assert_non_empty("Summary", payload.summary)
    details = assert_non_empty("Details", payload.details)
    image_url = assert_optional_http_url("Image URL", payload.image_url)
    link_label = payload.link_label.strip()
    link_url = assert_optional_http_url("Link URL", payload.link_url)

    if link_url and not link_label:
        raise HTTPException(status_code=400, detail="Link label is required when link URL is provided")

    item = {
        "id": create_id("n"),
        "title": title,
        "category": category,
        "date": date,
        "summary": summary,
        "details": details,
        "image_url": image_url,
        "link_label": link_label,
        "link_url": link_url,
    }
    institute_data["notification_items"].insert(0, item)
    return {"success": True, "item": item}


@app.put("/admin/notification-items/{item_id}")
def update_notification_item(item_id: str, payload: NotificationItemUpdate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    items = institute_data["notification_items"]
    index = find_item_index(items, item_id)
    current = items[index]

    if payload.title is not None:
        current["title"] = assert_non_empty("Title", payload.title)
    if payload.category is not None:
        current["category"] = assert_non_empty("Category", payload.category)
    if payload.date is not None:
        current["date"] = assert_non_empty("Date", payload.date)
    if payload.summary is not None:
        current["summary"] = assert_non_empty("Summary", payload.summary)
    if payload.details is not None:
        current["details"] = assert_non_empty("Details", payload.details)
    if payload.image_url is not None:
        current["image_url"] = assert_optional_http_url("Image URL", payload.image_url)
    if payload.link_label is not None:
        current["link_label"] = payload.link_label.strip()
    if payload.link_url is not None:
        current["link_url"] = assert_optional_http_url("Link URL", payload.link_url)

    if current.get("link_url") and not current.get("link_label"):
        raise HTTPException(status_code=400, detail="Link label is required when link URL is provided")

    return {"success": True, "item": current}


@app.delete("/admin/notification-items/{item_id}")
def delete_notification_item(item_id: str, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    items = institute_data["notification_items"]
    index = find_item_index(items, item_id)
    items.pop(index)
    return {"success": True, "message": "Notification deleted."}


@app.get("/admin/academics/content")
def get_academics_content(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()
    return institute_data["academic_content"]


@app.get("/admin/academics/noticeboard")
def list_academic_noticeboard(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()
    return institute_data["academic_content"]["noticeboard"]


@app.post("/admin/academics/noticeboard")
def add_academic_noticeboard(payload: AcademicNoticeCreate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    item = {
        "id": create_id("an"),
        "headline": assert_non_empty("Headline", payload.headline),
        "description": assert_non_empty("Description", payload.description),
        "time": assert_non_empty("Time", payload.time),
        "image_url": assert_optional_http_url("Image URL", payload.image_url),
        "link_label": payload.link_label.strip(),
        "link_url": assert_optional_http_url("Link URL", payload.link_url),
    }

    if item["link_url"] and not item["link_label"]:
        raise HTTPException(status_code=400, detail="Link label is required when link URL is provided")

    institute_data["academic_content"]["noticeboard"].insert(0, item)
    return {"success": True, "item": item}


@app.put("/admin/academics/noticeboard/{item_id}")
def update_academic_noticeboard(item_id: str, payload: AcademicNoticeUpdate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    items = institute_data["academic_content"]["noticeboard"]
    index = find_item_index(items, item_id)
    current = items[index]

    if payload.headline is not None:
        current["headline"] = assert_non_empty("Headline", payload.headline)
    if payload.description is not None:
        current["description"] = assert_non_empty("Description", payload.description)
    if payload.time is not None:
        current["time"] = assert_non_empty("Time", payload.time)
    if payload.image_url is not None:
        current["image_url"] = assert_optional_http_url("Image URL", payload.image_url)
    if payload.link_label is not None:
        current["link_label"] = payload.link_label.strip()
    if payload.link_url is not None:
        current["link_url"] = assert_optional_http_url("Link URL", payload.link_url)

    if current.get("link_url") and not current.get("link_label"):
        raise HTTPException(status_code=400, detail="Link label is required when link URL is provided")

    return {"success": True, "item": current}


@app.delete("/admin/academics/noticeboard/{item_id}")
def delete_academic_noticeboard(item_id: str, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    items = institute_data["academic_content"]["noticeboard"]
    index = find_item_index(items, item_id)
    items.pop(index)
    return {"success": True, "message": "Noticeboard item deleted."}


@app.get("/admin/academics/timetable")
def list_academic_timetable(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()
    return institute_data["academic_content"]["timetable"]


@app.post("/admin/academics/timetable")
def add_academic_timetable(payload: TimetableCreate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    item = {
        "id": create_id("tt"),
        "period": assert_non_empty("Period", payload.period),
        "time": assert_non_empty("Time", payload.time),
        "detail": assert_non_empty("Detail", payload.detail),
        "class_name": assert_non_empty("Class", payload.class_name),
        "stream": assert_non_empty("Stream", payload.stream),
    }

    institute_data["academic_content"]["timetable"].append(item)
    return {"success": True, "item": item}


@app.put("/admin/academics/timetable/{item_id}")
def update_academic_timetable(item_id: str, payload: TimetableUpdate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    items = institute_data["academic_content"]["timetable"]
    index = find_item_index(items, item_id)
    current = items[index]

    if payload.period is not None:
        current["period"] = assert_non_empty("Period", payload.period)
    if payload.time is not None:
        current["time"] = assert_non_empty("Time", payload.time)
    if payload.detail is not None:
        current["detail"] = assert_non_empty("Detail", payload.detail)
    if payload.class_name is not None:
        current["class_name"] = assert_non_empty("Class", payload.class_name)
    if payload.stream is not None:
        current["stream"] = assert_non_empty("Stream", payload.stream)

    return {"success": True, "item": current}


@app.delete("/admin/academics/timetable/{item_id}")
def delete_academic_timetable(item_id: str, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()

    items = institute_data["academic_content"]["timetable"]
    index = find_item_index(items, item_id)
    items.pop(index)
    return {"success": True, "message": "Timetable item deleted."}


@app.get("/admin/academics/materials")
def get_academic_materials(authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()
    return {"materials": institute_data["academic_content"]["materials"]}


@app.put("/admin/academics/materials")
def update_academic_materials(payload: MaterialsUpdate, authorization: str = Header(default="")):
    verify_admin_token(authorization)
    validate_content_shape()
    institute_data["academic_content"]["materials"] = [item.model_dump() for item in payload.materials]
    return {"success": True, "materials": institute_data["academic_content"]["materials"]}
