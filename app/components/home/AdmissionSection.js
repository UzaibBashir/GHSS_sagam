"use client";

import { useMemo, useState } from "react";
import { ADMISSION_CONTENT } from "../../lib/siteContent";
import { API_BASE } from "../../lib/api";
import { INPUT, PRIMARY_BUTTON } from "../../lib/uiClasses";

const MAX_FILE_SIZE = 1024 * 1024;

function isAllowedFileType(file) {
  if (!file) return false;
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();
  const isPdf = type === "application/pdf" || name.endsWith(".pdf");
  const isImage = type.startsWith("image/");
  return isPdf || isImage;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Not Known"];
const CATEGORY_OPTIONS = ["OM", "RBA", "SC", "ST", "OSC", "PH"];
const SUB_CATEGORY_OPTIONS = ["APL", "BPL", "AAY"];
const CLASS_OPTIONS = ["9th", "10th", "11th", "12th", "below class 8th"];
const STREAM_OPTIONS = ["Medical", "Non-Medical", "Arts", "Others"];
const SUBJECT_OPTIONS = [
  "English",
  "Physics",
  "Chemistry",
  "Biology",
  "Math",
  "Phy Edu",
  "Phy Edu & Sports",
  "Economics",
  "Education",
  "Urdu",
];

const DEFAULT_FORM = {
  sessionYear: "2026",
  applicantName: "",
  fatherName: "",
  motherName: "",
  dob: "",
  confirmDob: "",
  permanentAddress: "",
  presentAddress: "",
  parentCell: "",
  email: "",
  aadharNo: "",
  confirmAadharNo: "",
  bloodGroup: "A+",
  height: "",
  weight: "",
  parentsOccupation: "",
  familyIncome: "",
  category: "",
  subCategory: "APL",
  bankAccountNo: "",
  ifscCode: "",
  classForAdmission: "",
  stream: "",
  feesPaidVia: "",
  referenceNo: "",
};

function ContactIcon({ type }) {
  const common = {
    className: "h-4 w-4",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (type === "email") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L8 9.99a16 16 0 0 0 6 6l1.54-1.23a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function FileInput({ label, required, accept, onChange }) {
  return (
    <label className="text-sm font-semibold text-slate-700">
      {label} {required ? <span className="text-rose-600">*</span> : null}
      <input type="file" accept={accept} onChange={onChange} className={`${INPUT} mt-2`} required={required} />
      <p className="mt-1 text-xs text-slate-500">Max file size: 1 MB</p>
    </label>
  );
}

function downloadAutoReceipt(submission, details = {}) {
  const now = new Date().toLocaleString();
  const safe = (value) => {
    const text = String(value ?? "").trim();
    return text || "-";
  };

  const rows = [
    ["Application ID", submission.application_id],
    ["Status", (submission.status || "pending").toUpperCase()],
    ["Submitted At", submission.submitted_at || now],
    ["Applicant Name", details.applicantName || submission.name],
    ["Father Name", details.fatherName],
    ["Mother Name", details.motherName],
    ["DOB", details.dob || submission.dob],
    ["Present Address", details.presentAddress],
    ["Permanent Address", details.permanentAddress],
    ["WhatsApp Contact", details.parentCell],
    ["Email", details.email],
    ["Aadhar No", details.aadharNo],
    ["Blood Group", details.bloodGroup],
    ["Family Income", details.familyIncome],
    ["Category", details.category],
    ["Sub-Category", details.subCategory],
    ["Class for Admission", details.classForAdmission || submission.class_for_admission],
    ["Stream", details.stream || submission.stream],
    ["Subjects", Array.isArray(details.subjects) ? details.subjects.join(", ") : ""],
    ["Bank Account No", details.bankAccountNo],
    ["IFSC Code", details.ifscCode],
    ["Fees Paid Via", details.feesPaidVia || submission.fees_paid_via],
    ["Reference No", details.referenceNo],
    ["Fees Proof File", details.feesProofName],
    ["Aadhar File", details.aadharFileName],
    ["Ration Card File", details.rationCardFileName],
    ["Bank Copy File", details.bankCopyFileName],
    ["Applicant Photo File", details.applicantPhotoName],
  ]
    .map(([label, value]) => `<tr><td class="label">${label}</td><td class="value">${safe(value)}</td></tr>`)
    .join("");

  const html = `
  <html>
    <head>
      <title>Admission Receipt</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
        h1 { font-size: 20px; margin-bottom: 8px; }
        .meta { margin-bottom: 16px; font-size: 12px; color: #475569; }
        table { width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        td { border-bottom: 1px solid #e2e8f0; padding: 10px 12px; vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        .label { width: 35%; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; background: #f8fafc; }
        .value { font-size: 14px; font-weight: 600; }
      </style>
    </head>
    <body>
      <h1>Admission Receipt</h1>
      <div class="meta">Auto generated after form submission</div>
      <table>${rows}</table>
    </body>
  </html>`;

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `admission-receipt-${submission.application_id || "pending"}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
export default function AdmissionSection({ institute = null, initialOpen = false, compact = false }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showApplyForm, setShowApplyForm] = useState(initialOpen || compact);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [files, setFiles] = useState({
    feesProof: null,
    aadharFile: null,
    rationCardFile: null,
    bankCopyFile: null,
    applicantPhoto: null,
  });
  const [submission, setSubmission] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const [statusLookup, setStatusLookup] = useState({ applicationId: "", name: "", dob: "" });
  const [statusData, setStatusData] = useState(null);
  const [statusError, setStatusError] = useState("");

  const admissionContent = useMemo(() => {
    const fromDb = institute?.admission_content;
    if (!fromDb || typeof fromDb !== "object") {
      return ADMISSION_CONTENT;
    }

    return {
      guidelines: Array.isArray(fromDb.guidelines) && fromDb.guidelines.length ? fromDb.guidelines : ADMISSION_CONTENT.guidelines,
      eligibility: Array.isArray(fromDb.eligibility) && fromDb.eligibility.length ? fromDb.eligibility : ADMISSION_CONTENT.eligibility,
      requiredDocuments:
        Array.isArray(fromDb.requiredDocuments) && fromDb.requiredDocuments.length
          ? fromDb.requiredDocuments
          : ADMISSION_CONTENT.requiredDocuments,
      sessionYear: String(fromDb.sessionYear || "2026"),
    };
  }, [institute]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((item) => item !== subject) : [...prev, subject]
    );
  };

  const setFile = (key, file) => {
    if (file && !isAllowedFileType(file)) {
      setStatusMessage("Only PDF or image files are allowed.");
      return;
    }
    if (file && file.size > MAX_FILE_SIZE) {
      setStatusMessage(`${key} exceeds 1 MB limit.`);
      return;
    }
    setFiles((prev) => ({ ...prev, [key]: file || null }));
  };

  const validateBeforeSubmit = () => {
    if (!form.applicantName || !form.fatherName || !form.motherName || !form.dob) {
      return "Please fill applicant, father, mother name and date of birth.";
    }
    if (!form.confirmDob) {
      return "Please confirm date of birth.";
    }
    if (form.dob !== form.confirmDob) {
      return "DOB and Confirm DOB must match.";
    }
    if (!form.permanentAddress || !form.presentAddress || !form.parentCell || !form.aadharNo) {
      return "Please complete address, parent cell number, and Aadhar number.";
    }
    if (!form.confirmAadharNo) {
      return "Please confirm Aadhar number.";
    }
    if (form.aadharNo.trim() !== form.confirmAadharNo.trim()) {
      return "Aadhar No and Confirm Aadhar No must match.";
    }
    if (!form.familyIncome || !form.category || !form.bankAccountNo || !form.classForAdmission) {
      return "Please complete family income, category, bank account and class details.";
    }
    if (!form.feesPaidVia || !form.referenceNo) {
      return "Please provide fee payment mode and reference number.";
    }
    if (!selectedSubjects.length) {
      return "Please select at least one opted subject.";
    }
    if (form.feesPaidVia === "online" && !files.feesProof) {
      return "Please upload fees screenshot/PDF for online payment.";
    }
    if (!files.aadharFile || !files.bankCopyFile || !files.applicantPhoto) {
      return "Aadhar copy, bank account copy, and applicant photograph are required.";
    }
    if (["11th", "12th"].includes(form.classForAdmission) && !form.stream) {
      return "Please select stream for 11th/12th admission.";
    }
    return "";
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    setStatusMessage("");

    const validationError = validateBeforeSubmit();
    if (validationError) {
      setStatusMessage(validationError);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("session_year", admissionContent.sessionYear || "2026");
      formData.append("applicant_name", form.applicantName.trim());
      formData.append("father_name", form.fatherName.trim());
      formData.append("mother_name", form.motherName.trim());
      formData.append("dob", form.dob.trim());
      formData.append("dob_words", "");
      formData.append("permanent_address", form.permanentAddress.trim());
      formData.append("present_address", form.presentAddress.trim());
      formData.append("parent_cell", form.parentCell.trim());
      formData.append("email", form.email.trim());
      formData.append("aadhar_no", form.aadharNo.trim());
      formData.append("blood_group", form.bloodGroup);
      formData.append("height", form.height.trim());
      formData.append("weight", form.weight.trim());
      formData.append("parents_occupation", form.parentsOccupation.trim());
      formData.append("family_income", form.familyIncome.trim());
      formData.append("category", form.category);
      formData.append("sub_category", form.subCategory);
      formData.append("bank_account_no", form.bankAccountNo.trim());
      formData.append("ifsc_code", form.ifscCode.trim());
      formData.append("class_for_admission", form.classForAdmission);
      formData.append("stream", form.stream || "");
      formData.append("fees_paid_via", form.feesPaidVia);
      formData.append("reference_no", form.referenceNo.trim());
      selectedSubjects.forEach((subject) => formData.append("subjects", subject));

      if (files.feesProof) formData.append("fees_proof", files.feesProof);
      if (files.aadharFile) formData.append("aadhar_file", files.aadharFile);
      if (files.rationCardFile) formData.append("ration_card_file", files.rationCardFile);
      if (files.bankCopyFile) formData.append("bank_copy_file", files.bankCopyFile);
      if (files.applicantPhoto) formData.append("applicant_photo", files.applicantPhoto);

      const res = await fetch(`${API_BASE}/admissions`, { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Submission failed");
      }

      const receiptDetails = {
        applicantName: form.applicantName,
        fatherName: form.fatherName,
        motherName: form.motherName,
        dob: form.dob,
        permanentAddress: form.permanentAddress,
        presentAddress: form.presentAddress,
        parentCell: form.parentCell,
        email: form.email,
        aadharNo: form.aadharNo,
        bloodGroup: form.bloodGroup,
        familyIncome: form.familyIncome,
        category: form.category,
        subCategory: form.subCategory,
        bankAccountNo: form.bankAccountNo,
        ifscCode: form.ifscCode,
        classForAdmission: form.classForAdmission,
        stream: form.stream,
        feesPaidVia: form.feesPaidVia,
        referenceNo: form.referenceNo,
        subjects: [...selectedSubjects],
        feesProofName: files.feesProof?.name || "",
        aadharFileName: files.aadharFile?.name || "",
        rationCardFileName: files.rationCardFile?.name || "",
        bankCopyFileName: files.bankCopyFile?.name || "",
        applicantPhotoName: files.applicantPhoto?.name || "",
      };

      setSubmission(data);
      setStatusLookup({ applicationId: data.application_id || "", name: data.name || "", dob: data.dob || "" });
      setForm(DEFAULT_FORM);
      setSelectedSubjects([]);
      setFiles({ feesProof: null, aadharFile: null, rationCardFile: null, bankCopyFile: null, applicantPhoto: null });
      setStatusMessage("Application submitted. Receipt generated automatically.");
      downloadAutoReceipt(data, receiptDetails);
    } catch (error) {
      setStatusMessage(error.message || "Submission failed.");
    }
  };

  const checkStatus = async (event) => {
    event.preventDefault();
    setStatusError("");
    setStatusData(null);

    try {
      const params = new URLSearchParams({
        application_id: statusLookup.applicationId.trim(),
        name: statusLookup.name.trim(),
        dob: statusLookup.dob.trim(),
      });
      const res = await fetch(`${API_BASE}/admissions/status?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || "Status lookup failed");
      }
      setStatusData(data);
    } catch (err) {
      setStatusError(err.message || "Status lookup failed");
    }
  };

  const openApplyForm = () => {
    setShowApplyForm(true);
    requestAnimationFrame(() => {
      const formElement = document.getElementById("admission-apply-form");
      formElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section id="admission" className="grid gap-6">
      <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-[0.95fr_1.05fr]"}`}>
        <article className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)] max-md:p-4">
          <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-amber-300 uppercase">Admission Journey</p>
          <h2 className="font-display mt-4 text-3xl font-semibold max-md:text-2xl">Start with clear guidance and complete documents</h2>
          <p className="mt-3 text-sm leading-7 text-slate-200">
            Follow the process carefully, review stream eligibility, and keep all required documents ready before submitting the online form.
          </p>
          <ul className="mt-6 grid gap-3">
            {admissionContent.guidelines.map((item, index) => (
              <li key={item} className="flex gap-3 rounded-[1.3rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-100">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 font-bold text-slate-950">
                  {index + 1}
                </span>
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </article>

        {!compact ? (
          <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
            <p className="section-kicker">Admission Helpdesk</p>
            <h3 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">Get direct support from the school</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Families can contact the admission desk for help with stream selection, form submission, and document preparation.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="mailto:ghsssagam@gmail.com" className="rounded-[1.4rem] bg-linear-to-br from-amber-100 to-yellow-50 p-4 text-amber-900 shadow-[0_14px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
                <div className="inline-flex rounded-full bg-white/80 p-2 text-amber-700">
                  <ContactIcon type="email" />
                </div>
                <p className="mt-3 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase opacity-75">Email</p>
                <p className="mt-2 text-sm font-semibold">ghsssagam@gmail.com</p>
              </a>

              <div className="rounded-[1.4rem] bg-linear-to-br from-teal-100 to-cyan-50 p-4 text-teal-900 shadow-[0_14px_28px_rgba(15,23,42,0.06)]">
                <div className="inline-flex rounded-full bg-white/80 p-2 text-teal-700">
                  <ContactIcon type="phone" />
                </div>
                <p className="mt-3 text-[0.72rem] font-extrabold tracking-[0.16em] uppercase opacity-75">Phone Support</p>
                <div className="mt-2 grid gap-1 text-sm font-semibold">
                  <a href="tel:+919622735195" className="hover:underline">+91 96227 35195</a>
                  <a href="tel:+917006763600" className="hover:underline">+91 70067 63600</a>
                </div>
              </div>
            </div>
          </article>
        ) : null}
      </div>

      <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
        <div className={`grid gap-6 ${compact ? "" : "lg:grid-cols-[0.95fr_1.05fr] lg:items-start"}`}>
          <div>
            <p className="section-kicker">Online Form</p>
            <h3 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">GOVT GIRLS HIGHER SECONDARY SCHOOL ADMISSION FORM</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Read instructions completely before filling. Please fill out this form completely for admission to GOVT GIRLS HIGHER SECONDARY SCHOOL, SAGAM KOKERNAG ANANTNAG KMR.
            </p>
            {!compact ? (
              <button
                type="button"
                onClick={openApplyForm}
                className="mt-5 inline-flex rounded-full bg-linear-to-r from-amber-400 to-yellow-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_16px_28px_rgba(212,166,70,0.26)] transition hover:-translate-y-0.5"
              >
                Apply Now
              </button>
            ) : null}
          </div>

          <form id="admission-apply-form" onSubmit={submitApplication} className={`${showApplyForm ? "" : "hidden "}rounded-[1.7rem] border border-slate-200/80 bg-white/86 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]`}>
            <h4 className="text-[0.78rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Online Admission Form</h4>
            <p className="mt-2 text-xs text-slate-500">Fields marked with * are required.</p>

            <div className="mt-4 grid gap-3">
              <input className={INPUT} value={admissionContent.sessionYear || "2026"} readOnly aria-label="Session Year" />

              <FileInput label="Upload Screenshot or PDF of Fees (if paid online)" required={form.feesPaidVia === "online"} accept=".pdf,image/*" onChange={(e) => setFile("feesProof", e.target.files?.[0])} />

              <input className={INPUT} value={form.applicantName} onChange={(e) => updateField("applicantName", e.target.value)} placeholder="Applicant's Name *" required />
              <input className={INPUT} value={form.fatherName} onChange={(e) => updateField("fatherName", e.target.value)} placeholder="Father's Name *" required />
              <input className={INPUT} value={form.motherName} onChange={(e) => updateField("motherName", e.target.value)} placeholder="Mother's Name *" required />

              <label className="text-xs font-semibold tracking-[0.08em] text-slate-600 uppercase">DOB *</label>

              <input type="date" className={INPUT} value={form.dob} onChange={(e) => updateField("dob", e.target.value)} required />
              <input type="date" className={INPUT} value={form.confirmDob} onChange={(e) => updateField("confirmDob", e.target.value)} placeholder="Confirm DOB *" required />

              <textarea className={INPUT} value={form.permanentAddress} onChange={(e) => updateField("permanentAddress", e.target.value)} placeholder="Permanent Address *" required rows={2} />
              <textarea className={INPUT} value={form.presentAddress} onChange={(e) => updateField("presentAddress", e.target.value)} placeholder="Present Address *" required rows={2} />

              <input className={INPUT} value={form.aadharNo} onChange={(e) => updateField("aadharNo", e.target.value)} placeholder="Aadhar No: *" required />
              <input className={INPUT} value={form.confirmAadharNo} onChange={(e) => updateField("confirmAadharNo", e.target.value)} placeholder="Confirm Aadhar No: *" required />
              <FileInput label="Upload Aadhar (less than 1MB)" required accept=".pdf,image/*" onChange={(e) => setFile("aadharFile", e.target.files?.[0])} />

              <label className="text-xs font-semibold tracking-[0.08em] text-slate-600 uppercase">Blood Group</label>
              <select className={INPUT} value={form.bloodGroup} onChange={(e) => updateField("bloodGroup", e.target.value)}>
                {BLOOD_GROUPS.map((group) => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>

              <div className={`grid gap-3 ${compact ? "" : "sm:grid-cols-2"}`}>
                <input className={INPUT} value={form.height} onChange={(e) => updateField("height", e.target.value)} placeholder="Height (cm or feet/inches)" />
                <input className={INPUT} value={form.weight} onChange={(e) => updateField("weight", e.target.value)} placeholder="Weight (kg or lbs)" />
              </div>

              <input className={INPUT} value={form.parentsOccupation} onChange={(e) => updateField("parentsOccupation", e.target.value)} placeholder="Parents Occupation" />
              <input className={INPUT} value={form.familyIncome} onChange={(e) => updateField("familyIncome", e.target.value)} placeholder="Family Income (Annual) *" required />

              <select className={INPUT} value={form.category} onChange={(e) => updateField("category", e.target.value)} required>
                <option value="">Choose Category *</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <label className="text-xs font-semibold tracking-[0.08em] text-slate-600 uppercase">Sub-Category</label>
              <select className={INPUT} value={form.subCategory} onChange={(e) => updateField("subCategory", e.target.value)}>
                {SUB_CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <FileInput label="Upload Ration-Card (less than 1MB)" accept=".pdf,image/*" onChange={(e) => setFile("rationCardFile", e.target.files?.[0])} />

              <input className={INPUT} value={form.bankAccountNo} onChange={(e) => updateField("bankAccountNo", e.target.value)} placeholder="Bank Account No: *" required />
              <FileInput label="Bank Account Photo Copy (less than 1MB)" required accept=".pdf,image/*" onChange={(e) => setFile("bankCopyFile", e.target.files?.[0])} />
              <input className={INPUT} value={form.ifscCode} onChange={(e) => updateField("ifscCode", e.target.value)} placeholder="IFSC CODE" />

              <FileInput label="Upload Applicant's Photograph (less than 1MB)" required accept=".pdf,image/*" onChange={(e) => setFile("applicantPhoto", e.target.files?.[0])} />

              <select className={INPUT} value={form.classForAdmission} onChange={(e) => updateField("classForAdmission", e.target.value)} required>
                <option value="">Select Class for Admission *</option>
                {CLASS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <select className={INPUT} value={form.stream} onChange={(e) => updateField("stream", e.target.value)}>
                <option value="">Select Stream for 11th & 12th Classes</option>
                {STREAM_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <fieldset className="rounded-2xl border border-slate-300/70 bg-white/90 p-3">
                <legend className="px-2 text-xs font-bold tracking-[0.08em] text-slate-600 uppercase">Subject Opted *</legend>
                <div className={`grid gap-2 ${compact ? "" : "sm:grid-cols-2"}`}>
                  {SUBJECT_OPTIONS.map((subject) => (
                    <label key={subject} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={selectedSubjects.includes(subject)} onChange={() => toggleSubject(subject)} />
                      <span>{subject}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="rounded-2xl border border-slate-300/70 bg-white/90 p-3">
                <legend className="px-2 text-xs font-bold tracking-[0.08em] text-slate-600 uppercase">Fees paid via *</legend>
                <div className={`text-sm text-slate-700 ${compact ? "grid gap-2" : "flex flex-wrap gap-4"}`}>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="feesPaidVia" value="online" checked={form.feesPaidVia === "online"} onChange={(e) => updateField("feesPaidVia", e.target.value)} required />
                    online
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="radio" name="feesPaidVia" value="offline" checked={form.feesPaidVia === "offline"} onChange={(e) => updateField("feesPaidVia", e.target.value)} required />
                    offline
                  </label>
                </div>
              </fieldset>

              <input className={INPUT} value={form.referenceNo} onChange={(e) => updateField("referenceNo", e.target.value)} placeholder="Reference No (receipt id / transaction ref) *" required />
              <input className={INPUT} value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="Email" type="email" />
              <input className={INPUT} value={form.parentCell} onChange={(e) => updateField("parentCell", e.target.value)} placeholder="WhatsApp Contact *" required />
              <button type="submit" className={PRIMARY_BUTTON}>Submit</button>
            </div>
            {statusMessage ? <p className="mt-3 text-sm text-slate-600">{statusMessage}</p> : null}
          </form>
        </div>
      </article>

      {!compact ? (
        <article id="check-status" className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
          <p className="section-kicker">Check Status</p>
          <h3 className="font-display mt-4 text-2xl font-semibold text-slate-950">Check Admission Status</h3>
          <form onSubmit={checkStatus} className="mt-4 grid gap-3 md:grid-cols-3">
            <input className={INPUT} placeholder="Application ID" value={statusLookup.applicationId} onChange={(e) => setStatusLookup((p) => ({ ...p, applicationId: e.target.value }))} required />
            <input className={INPUT} placeholder="Applicant Name" value={statusLookup.name} onChange={(e) => setStatusLookup((p) => ({ ...p, name: e.target.value }))} required />
            <input className={INPUT} type="date" value={statusLookup.dob} onChange={(e) => setStatusLookup((p) => ({ ...p, dob: e.target.value }))} required />
            <button type="submit" className={`${PRIMARY_BUTTON} md:col-span-3`}>Check Status</button>
          </form>
          {statusError ? <p className="mt-3 text-sm text-rose-700">{statusError}</p> : null}
          {statusData ? (
            <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 text-sm">
              <p><strong>Application ID:</strong> {statusData.application_id}</p>
              <p><strong>Name:</strong> {statusData.name}</p>
              <p><strong>DOB:</strong> {statusData.dob}</p>
              <p><strong>Status:</strong> {statusData.status}</p>
              <p><strong>Remarks:</strong> {statusData.remarks || "No remarks yet"}</p>
            </div>
          ) : null}
        </article>
      ) : null}

      {submission && !compact ? (
        <article className="rounded-[2rem] border border-amber-300/80 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)] max-md:p-4">
          <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-amber-700 uppercase">Verification Pending</p>
          <h3 className="font-display mt-3 text-3xl font-semibold text-amber-950 max-md:text-2xl">Your application is under review</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[1.2rem] border border-amber-200/80 bg-white/80 px-4 py-3 text-sm"><p className="font-bold">Application ID</p><p className="mt-1">{submission.application_id}</p></div>
            <div className="rounded-[1.2rem] border border-amber-200/80 bg-white/80 px-4 py-3 text-sm"><p className="font-bold">Student Name</p><p className="mt-1">{submission.name}</p></div>
            <div className="rounded-[1.2rem] border border-amber-200/80 bg-white/80 px-4 py-3 text-sm"><p className="font-bold">Date of Birth</p><p className="mt-1">{submission.dob}</p></div>
          </div>
          <p className="mt-4 text-sm leading-6">Receipt is generated automatically on submission. Keep your Application ID for future status checks.</p>
          <a href="/admission/status" className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Open Full Status Page</a>
        </article>
      ) : null}
    </section>
  );
}














