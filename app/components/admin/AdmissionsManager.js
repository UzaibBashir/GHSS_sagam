import { useState } from "react";
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

function AdmissionRow({ item, onUpdate }) {
  const [status, setStatus] = useState(item.status || "pending");
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
        <select className={ADMIN_INPUT} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
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
          <button className={ADMIN_BUTTON} onClick={() => onUpdate(item.application_id, { status, remarks })}>
            Save
          </button>
          <button className={ADMIN_BUTTON_DANGER} onClick={() => onUpdate(item.application_id, { status: "rejected", remarks })}>
            Reject
          </button>
        </div>
      </td>
    </tr>
  );
}

function EnquiryRow({ item, index }) {
  return (
    <tr className="border-t border-slate-200">
      <td className="px-3 py-2 font-semibold text-slate-900 break-words">{item.full_name}</td>
      <td className="px-3 py-2 break-all text-slate-700">{item.email}</td>
      <td className="px-3 py-2 text-slate-700 break-words">{item.phone}</td>
      <td className="px-3 py-2 text-slate-700 break-words">{item.program_interest}</td>
      <td className="px-3 py-2 text-slate-600 break-words">{item.message}</td>
      <td className="px-3 py-2 text-slate-500">{index + 1}</td>
    </tr>
  );
}

export default function AdmissionsManager({ admissions, onUpdate, enquiries = [], onClearEnquiries }) {
  return (
    <section className={ADMIN_SECTION} id="admissions">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Admissions & Enquiries</h2>
        <p className={ADMIN_SECTION_DESC}>
          Approve admission applications and manage incoming admission enquiries in one place.
        </p>
      </div>

      <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-600">Admission Applications</h3>
      {admissions.length === 0 ? (
        <div className={`${ADMIN_SUBCARD} mt-4 text-sm text-slate-600`}>No admission applications yet.</div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] table-fixed border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Application ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">DOB</th>
                <th className="px-3 py-2">Submitted</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Update status</th>
                <th className="px-3 py-2">Remarks</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((item) => (
                <AdmissionRow key={item.application_id} item={item} onUpdate={onUpdate} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Admission Enquiries</h3>
        <button className={ADMIN_BUTTON_DANGER} onClick={onClearEnquiries}>
          Clear all enquiries
        </button>
      </div>

      {enquiries.length === 0 ? (
        <div className={`${ADMIN_SUBCARD} mt-4 text-sm text-slate-600`}>No enquiries found.</div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Program</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">#</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((item, index) => (
                <EnquiryRow key={`${item.email}-${index}`} item={item} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
