import hmac
import os
import secrets
import time
from typing import Dict, List

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Institute API", version="2.0.0")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


class InstituteResponse(BaseModel):
    name: str
    tagline: str
    description: str
    about_us: str
    institute_details: List[str]
    admission_form_url: str
    academics: List[AcademicItem]
    faculties: List[FacultyItem]
    streams_subjects: List[StreamItem]
    staff: List[StaffItem]
    facilities: List[str]
    notices: List[Notice]
    downloads: List[DownloadItem]
    contact: ContactInfo


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


ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "change-me-123")
TOKEN_TTL_SECONDS = 60 * 60 * 8

contacts: List[ContactRequest] = []
admin_sessions: Dict[str, float] = {}

institute_data = {
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


@app.get("/")
def home():
    return {"message": "Institute API is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/institute", response_model=InstituteResponse)
def get_institute():
    return institute_data


@app.post("/contact")
def submit_contact(payload: ContactRequest):
    contacts.append(payload)
    return {"success": True, "message": "Thanks for contacting us. Our team will reach out soon."}


@app.post("/admin/login")
def admin_login(payload: LoginRequest):
    if not hmac.compare_digest(payload.username, ADMIN_USERNAME) or not hmac.compare_digest(payload.password, ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = secrets.token_urlsafe(32)
    admin_sessions[token] = time.time() + TOKEN_TTL_SECONDS
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

