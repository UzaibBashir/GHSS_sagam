"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import PageHero from "../../components/common/PageHero";
import { PAGE_MAIN } from "../../lib/uiClasses";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

function buildReceiptRows(submission, details = {}) {
  return [
    ["Application ID", submission?.application_id],
    ["Status", (submission?.status || "pending").toUpperCase()],
    ["Submitted At", formatDate(submission?.submitted_at)],
    ["Applicant Name", details.applicantName || submission?.name],
    ["Father Name", details.fatherName],
    ["Mother Name", details.motherName],
    ["DOB", details.dob || submission?.dob],
    ["Present Address", details.presentAddress],
    ["Permanent Address", details.permanentAddress],
    ["WhatsApp Contact", details.parentCell],
    ["Email", details.email],
    ["Aadhar No", details.aadharNo],
    ["Blood Group", details.bloodGroup],
    ["Family Income", details.familyIncome],
    ["Category", details.category],
    ["Sub-Category", details.subCategory],
    ["Class for Admission", details.classForAdmission || submission?.class_for_admission],
    ["Stream", details.stream || submission?.stream],
    ["Subjects", Array.isArray(details.subjects) ? details.subjects.join(", ") : ""],
    ["Bank Account No", details.bankAccountNo],
    ["IFSC Code", details.ifscCode],
    ["Fees Paid Via", details.feesPaidVia || submission?.fees_paid_via],
    ["Reference No", details.referenceNo],
  ];
}

function escapePdfText(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildSimplePdf(contentLines) {
  const lineHeight = 14;
  const pageHeight = 842;
  const topMargin = 56;
  const bottomMargin = 50;
  const maxLinesPerPage = Math.max(1, Math.floor((pageHeight - topMargin - bottomMargin) / lineHeight));

  const pages = [];
  for (let i = 0; i < contentLines.length; i += maxLinesPerPage) {
    pages.push(contentLines.slice(i, i + maxLinesPerPage));
  }

  const objects = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");

  const pageObjectNumbers = pages.map((_, index) => 3 + index);
  const firstContentObject = 3 + pages.length;
  const fontObjectNumber = firstContentObject + pages.length;

  objects.push(`<< /Type /Pages /Count ${pages.length} /Kids [${pageObjectNumbers.map((n) => `${n} 0 R`).join(" ")}] >>`);

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectNumber = pageObjectNumbers[pageIndex];
    const contentObjectNumber = firstContentObject + pageIndex;
    objects[pageObjectNumber - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjectNumber} 0 R >> >> /Contents ${contentObjectNumber} 0 R >>`;

    const commands = ["BT", "/F1 11 Tf", `50 ${pageHeight - topMargin} Td`];
    pageLines.forEach((line, lineIndex) => {
      const safeLine = escapePdfText(line);
      if (lineIndex === 0) {
        commands.push(`(${safeLine}) Tj`);
      } else {
        commands.push(`0 -${lineHeight} Td`);
        commands.push(`(${safeLine}) Tj`);
      }
    });
    commands.push("ET");

    const streamContent = commands.join("\n");
    objects[contentObjectNumber - 1] = `<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`;
  });

  objects[fontObjectNumber - 1] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((objectBody, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${objectBody}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

function downloadReceipt(submission, details = {}) {
  const rows = buildReceiptRows(submission, details);
  const lines = [
    "GOVT GIRLS HIGHER SECONDARY SCHOOL, SAGAM",
    "Admission Receipt",
    "",
    ...rows.map(([label, value]) => `${label}: ${String(value ?? "-") || "-"}`),
    "",
    "This is a system generated receipt.",
  ];

  const pdfBlob = buildSimplePdf(lines);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `admission-receipt-${submission?.application_id || "pending"}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}


export default function AdmissionReceiptPage() {
  const [payload] = useState(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("latest_admission_receipt");
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      return parsed?.submission ? parsed : null;
    } catch {
      return null;
    }
  });

  const rows = useMemo(() => {
    if (!payload?.submission) return [];
    return buildReceiptRows(payload.submission, payload.details || {});
  }, [payload]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <PageHero
          eyebrow="Admissions"
          title="Submission complete"
          description="Your details are submitted successfully. You can now download your receipt."
          stats={[
            { value: "Done", label: "Final Submission" },
            { value: "Receipt", label: "Ready to Download" },
            { value: "Track", label: "Use Status Page" },
          ]}
          actions={[{ label: "Open Status Page", href: "/admission/status", variant: "secondary" }]}
        />

        {!payload?.submission ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Receipt Not Available</h1>
            <p className="mt-2 text-sm">Submit the admission form first to generate and view your receipt here.</p>
            <Link href="/admission/apply" className="mt-4 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">
              Go To Admission Form
            </Link>
          </section>
        ) : (
          <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_18px_36px_rgba(15,23,42,0.1)] max-md:p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold tracking-[0.16em] text-slate-500 uppercase">Admission Receipt</p>
                <h2 className="font-display mt-2 text-2xl font-semibold text-slate-950">Application ID: {payload.submission.application_id}</h2>
              </div>
              <button
                type="button"
                onClick={() => downloadReceipt(payload.submission, payload.details || {})}
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
              >
                Download Receipt
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {rows.map(([label, value]) => (
                <div key={label} className="rounded-[1.2rem] border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900">
                  <p className="font-bold">{label}</p>
                  <p className="mt-1">{String(value || "-")}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

