import { useMemo, useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_DANGER,
  ADMIN_INPUT,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
} from "./adminStyles";

function StatusBadge({ status }) {
  const styles = {
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    pending: "bg-amber-100 text-amber-700",
  };
  const label = status || "pending";
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[label] || styles.pending}`}>
      {label}
    </span>
  );
}

const FILE_LABELS = {
  fees_proof: "Fees Proof",
  aadhar_file: "Aadhar File",
  ration_card_file: "Ration Card File",
  bank_copy_file: "Bank Copy File",
  applicant_photo: "Applicant Photo",
};

function formatFieldValue(value) {
  if (Array.isArray(value)) {
    return value.length ? value.join(", ") : "-";
  }
  const text = String(value ?? "").trim();
  return text || "-";
}

function getAdmissionRows(item) {
  const formData = item?.form_data && typeof item.form_data === "object" ? item.form_data : {};

  const rows = [
    ["Application ID", item?.application_id],
    ["Status", String(item?.status || "pending").toUpperCase()],
    ["Submitted At", item?.submitted_at],
    ["Applicant Name", item?.name || formData.applicant_name],
    ["Date of Birth", item?.dob || formData.dob],
    ["Father Name", formData.father_name],
    ["Mother Name", formData.mother_name],
    ["Permanent Address", formData.permanent_address],
    ["Present Address", formData.present_address],
    ["Parent Cell", formData.parent_cell],
    ["Email", formData.email],
    ["Aadhar No", formData.aadhar_no],
    ["Blood Group", formData.blood_group],
    ["Height", formData.height],
    ["Weight", formData.weight],
    ["Parents Occupation", formData.parents_occupation],
    ["Family Income", formData.family_income],
    ["Category", formData.category],
    ["Sub Category", formData.sub_category],
    ["Bank Account No", formData.bank_account_no],
    ["IFSC Code", formData.ifsc_code],
    ["Class for Admission", formData.class_for_admission],
    ["Stream", formData.stream],
    ["Subjects", Array.isArray(formData.subjects) ? formData.subjects : []],
    ["Fees Paid Via", formData.fees_paid_via],
    ["Reference No", formData.reference_no],
    ["Remarks", item?.remarks || ""],
  ];

  const uploads = item?.uploads && typeof item.uploads === "object" ? item.uploads : {};
  Object.entries(FILE_LABELS).forEach(([key, label]) => {
    const file = uploads[key];
    const fileText = file?.name ? `${file.name}${file.size ? ` (${Math.round(file.size / 1024)} KB)` : ""}` : "-";
    rows.push([label, fileText]);
  });

  return rows;
}

function getPrintAdmissionRows(item) {
  const formData = item?.form_data && typeof item.form_data === "object" ? item.form_data : {};

  const classText = formatFieldValue(formData.class_for_admission);
  const streamText = formatFieldValue(formData.stream);
  const categoryText = formatFieldValue(formData.category);
  const subCategoryText = formatFieldValue(formData.sub_category);
  const bloodText = formatFieldValue(formData.blood_group);
  const heightText = formatFieldValue(formData.height);
  const weightText = formatFieldValue(formData.weight);

  return [
    ["Application ID", item?.application_id],
    ["Status", String(item?.status || "pending").toUpperCase()],
    ["Submitted At", item?.submitted_at],
    ["Applicant Name", item?.name || formData.applicant_name],
    ["Date of Birth", item?.dob || formData.dob],
    ["Father Name", formData.father_name],
    ["Mother Name", formData.mother_name],
    ["Class / Stream", `${classText} / ${streamText}`],
    ["Subjects", Array.isArray(formData.subjects) ? formData.subjects : []],
    ["Parent Cell", formData.parent_cell],
    ["Email", formData.email],
    ["Permanent Address", formData.permanent_address],
    ["Present Address", formData.present_address],
    ["Aadhar No", formData.aadhar_no],
    ["Category / Sub Category", `${categoryText} / ${subCategoryText}`],
    ["Blood Group / Height / Weight", `${bloodText} / ${heightText} / ${weightText}`],
    ["Parents Occupation", formData.parents_occupation],
    ["Family Income", formData.family_income],
    ["Bank Account No", formData.bank_account_no],
    ["IFSC Code", formData.ifsc_code],
    ["Fees Paid Via", formData.fees_paid_via],
    ["Reference No", formData.reference_no],
    ["Remarks", item?.remarks || ""],
  ];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildFileDataUrl(file) {
  if (!file || !file.data) return "";
  const type = String(file.type || "image/jpeg").trim() || "image/jpeg";
  return `data:${type};base64,${file.data}`;
}

function printAdmissionForm(item) {
  const rows = getPrintAdmissionRows(item)
    .map(([label, value]) => {
      const safeLabel = escapeHtml(formatFieldValue(label));
      const safeValue = escapeHtml(formatFieldValue(value));
      return `<tr><td class="label">${safeLabel}</td><td class="value">${safeValue}</td></tr>`;
    })
    .join("");

  const applicantPhotoSrc = buildFileDataUrl(item?.uploads?.applicant_photo);

  const html = `
    <html>
      <head>
        <title>Admission Form - ${escapeHtml(formatFieldValue(item?.application_id))}</title>
        <style>
          @page { size: A4; margin: 9mm; }
          body {
            font-family: "Georgia", "Times New Roman", serif;
            margin: 0;
            color: #0f1e4b;
            background: linear-gradient(180deg, #f8fcf7 0%, #ffffff 50%, #f6fbf6 100%);
          }
          .sheet {
            border: 3px solid #1b2a57;
            border-radius: 14px;
            padding: 12px 14px;
            position: relative;
            overflow: hidden;
          }
          .sheet::before {
            content: "";
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 10% 10%, rgba(34, 139, 34, 0.08), transparent 35%),
                        radial-gradient(circle at 90% 92%, rgba(34, 139, 34, 0.08), transparent 35%);
            pointer-events: none;
          }
          .content { position: relative; }
          .top-badge {
            position: absolute;
            right: 8px;
            top: -8px;
            background: #4a4a73;
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 10px;
            font-weight: 700;
            padding: 5px 16px;
            border-radius: 999px;
            letter-spacing: 0.03em;
          }
          .logo-dot {
            position: absolute;
            left: 10px;
            top: 10px;
            height: 22px;
            width: 22px;
            border-radius: 999px;
            background: #2f7d32;
            border: 2px solid #d8f2d8;
          }
          .photo-wrap {
            margin: 0 0 8px auto;
            width: 106px;
            height: 136px;
            border: 1px solid #1f2d5a;
            border-radius: 2px;
            overflow: hidden;
            background: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .photo-wrap img { width: 100%; height: 100%; object-fit: cover; }
          .photo-placeholder {
            font-family: Arial, sans-serif;
            color: #64748b;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.06em;
          }
          h1 {
            margin: 8px 0 0;
            font-size: 30px;
            line-height: 1.08;
            color: #1b2a57;
            font-weight: 700;
          }
          .title-line {
            margin-top: 4px;
            width: 250px;
            height: 5px;
            border-radius: 999px;
            background: linear-gradient(90deg, #2f7d32, #4ea952);
          }
          .intro {
            margin: 8px 0 10px;
            font-family: Arial, sans-serif;
            font-size: 9px;
            line-height: 1.35;
            color: #18244f;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ccd5eb;
            border-radius: 8px;
            overflow: hidden;
            background: #ffffff;
          }
          td {
            border-bottom: 1px solid #dbe2f2;
            padding: 5px 8px;
            vertical-align: top;
          }
          tr:last-child td { border-bottom: none; }
          .label {
            width: 36%;
            font-family: Arial, sans-serif;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #4c5c8e;
            background: #f6f8ff;
          }
          .value {
            font-family: Arial, sans-serif;
            font-size: 10px;
            font-weight: 600;
            color: #1f2d5a;
          }
          .footer {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: end;
            font-family: Arial, sans-serif;
          }
          .school {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.02em;
            color: #18244f;
          }
          .sign {
            text-align: right;
            color: #14204a;
          }
          .sign-name {
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 0.03em;
          }
          .sign-role { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; }
          .page-tag {
            margin-top: 8px;
            margin-left: auto;
            width: fit-content;
            background: #c7862c;
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 9px;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="content">
            <div class="photo-wrap">
              ${applicantPhotoSrc ? `<img src="${applicantPhotoSrc}" alt="Applicant Photo" />` : `<div class="photo-placeholder">Applicant Photo</div>`}
            </div>

            <h1>Admission Form</h1>
            <div class="title-line"></div>
            <p class="intro">
              This is the official printed admission form for offline school records. All details below are captured
              from the submitted digital application and must be preserved in formal documentation.
            </p>

            <table>${rows}</table>

            <div class="footer">
              <div class="school">GOVT. GIRLS HIGHER SECONDARY SCHOOL - SAGAM</div>
              <div class="sign">
                <div class="sign-name">FAROOQ HUSSAIN ITOO</div>
                <div class="sign-role">PRINCIPAL, GHSS - SAGAM</div>
              </div>
            </div>
            <div class="page-tag">Print Copy</div>
          </div>
        </div>

        <script>
          window.onload = () => {
            window.print();
          };
        </script>
      </body>
    </html>`;

  const win = window.open("", "_blank", "width=960,height=980");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function AdmissionRow({
  item,
  section,
  onView,
  onApprove,
  onReject,
  onMovePending,
  onDelete,
}) {
  const [remarks, setRemarks] = useState(item.remarks || "");

  return (
    <tr className="border-t border-slate-200">
      <td className="px-3 py-2 text-sm text-slate-700">{item.application_id}</td>
      <td className="px-3 py-2 text-sm text-slate-700">{item.name}</td>
      <td className="px-3 py-2 text-sm text-slate-700">{item.dob}</td>
      <td className="px-3 py-2 text-sm text-slate-700">{new Date(item.submitted_at).toLocaleDateString()}</td>
      <td className="px-3 py-2">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Remarks (optional)"
        />
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <button className={ADMIN_BUTTON} onClick={() => onView(item)}>
            View Form
          </button>

          {section === "pending" ? (
            <>
              <button className={ADMIN_BUTTON} onClick={() => onApprove(item.application_id, remarks)}>
                Approve
              </button>
              <button className={ADMIN_BUTTON_DANGER} onClick={() => onReject(item.application_id, remarks)}>
                Reject
              </button>
            </>
          ) : null}

          {section === "approved" ? (
            <>
              <button className={ADMIN_BUTTON} onClick={() => onMovePending(item.application_id, remarks)}>
                Mark Pending
              </button>
              <button className={ADMIN_BUTTON_DANGER} onClick={() => onReject(item.application_id, remarks)}>
                Reject
              </button>
            </>
          ) : null}

          {section === "rejected" ? (
            <>
              <button className={ADMIN_BUTTON} onClick={() => onMovePending(item.application_id, remarks)}>
                Mark Pending
              </button>
              <button
                className={ADMIN_BUTTON_DANGER}
                onClick={() => {
                  if (window.confirm(`Delete rejected form ${item.application_id}? This cannot be undone.`)) {
                    onDelete(item.application_id);
                  }
                }}
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      </td>
    </tr>
  );
}

function AdmissionTable({
  title,
  section,
  items,
  onView,
  onApprove,
  onReject,
  onMovePending,
  onDelete,
}) {
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h3>
      {items.length === 0 ? (
        <div className={`${ADMIN_SUBCARD} mt-3 text-sm text-slate-600`}>No applications in this section.</div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Application ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">DOB</th>
                <th className="px-3 py-2">Submitted</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Remarks</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <AdmissionRow
                  key={item.application_id}
                  item={item}
                  section={section}
                  onView={onView}
                  onApprove={onApprove}
                  onReject={onReject}
                  onMovePending={onMovePending}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function AdmissionsManager({ admissions, onUpdate, onDelete }) {
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const selectedRows = useMemo(() => {
    if (!selectedAdmission) return [];
    return getAdmissionRows(selectedAdmission);
  }, [selectedAdmission]);

  const pendingAdmissions = useMemo(
    () => admissions.filter((item) => (item.status || "pending") === "pending"),
    [admissions]
  );
  const approvedAdmissions = useMemo(
    () => admissions.filter((item) => (item.status || "pending") === "approved"),
    [admissions]
  );
  const rejectedAdmissions = useMemo(
    () => admissions.filter((item) => (item.status || "pending") === "rejected"),
    [admissions]
  );

  const approveAdmission = (applicationId, remarks) => onUpdate(applicationId, { status: "approved", remarks });
  const rejectAdmission = (applicationId, remarks) => onUpdate(applicationId, { status: "rejected", remarks });
  const markPendingAdmission = (applicationId, remarks) => onUpdate(applicationId, { status: "pending", remarks });

  return (
    <section className={ADMIN_SECTION} id="admissions">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Admissions</h2>
        <p className={ADMIN_SECTION_DESC}>
          Review admission applications and manage them by status. Approved and rejected forms are listed in separate sections.
        </p>
      </div>

      <AdmissionTable
        title="Pending Applications"
        section="pending"
        items={pendingAdmissions}
        onView={setSelectedAdmission}
        onApprove={approveAdmission}
        onReject={rejectAdmission}
        onMovePending={markPendingAdmission}
        onDelete={onDelete}
      />

      <AdmissionTable
        title="Approved Applications"
        section="approved"
        items={approvedAdmissions}
        onView={setSelectedAdmission}
        onApprove={approveAdmission}
        onReject={rejectAdmission}
        onMovePending={markPendingAdmission}
        onDelete={onDelete}
      />

      <AdmissionTable
        title="Rejected Applications"
        section="rejected"
        items={rejectedAdmissions}
        onView={setSelectedAdmission}
        onApprove={approveAdmission}
        onReject={rejectAdmission}
        onMovePending={markPendingAdmission}
        onDelete={onDelete}
      />

      {selectedAdmission ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
              <div>
                <p className="text-xs font-extrabold tracking-[0.14em] text-teal-700 uppercase">Admission Form</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{selectedAdmission.application_id}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  onClick={() => printAdmissionForm(selectedAdmission)}
                >
                  Print Form
                </button>
                <button
                  type="button"
                  className={ADMIN_BUTTON_DANGER}
                  onClick={() => setSelectedAdmission(null)}
                >
                  Close
                </button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {selectedRows.map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-700">
                    <p className="text-[0.68rem] font-extrabold tracking-[0.12em] text-slate-500 uppercase">{label}</p>
                    <p className="mt-1 font-semibold text-slate-900 break-words">{formatFieldValue(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

