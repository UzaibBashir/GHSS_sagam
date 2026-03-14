"use client";

import { ACADEMICS_CONTENT, ABOUT_PAGE_CONTENT } from "../../lib/siteContent";

export default function PrincipalMessageFlash({ institute }) {
  const principalFromStaff = (institute?.staff || []).find((item) =>
    String(item.role || "").toLowerCase().includes("principal")
  );

  const principalName =
    principalFromStaff?.name || ACADEMICS_CONTENT.principal.name || "Principal";

  const principalMessage =
    ABOUT_PAGE_CONTENT.principalDesk.message ||
    ACADEMICS_CONTENT.principal.message ||
    "Our school is committed to academic excellence, values, and the all-round growth of every student.";

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-amber-200/75 bg-[linear-gradient(120deg,#fff8e7_0%,#fff1c7_16%,#fff8e7_35%,#fff1c7_58%,#fff8e7_100%)] p-5 shadow-[0_14px_32px_rgba(180,120,10,0.12)] max-sm:rounded-[1.35rem] max-sm:p-4">
      <div
        className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/3 animate-[pulse_2.8s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)] blur-md"
        aria-hidden="true"
      />
      <div className="relative flex flex-wrap items-start gap-4 max-sm:gap-3">
        <div className="rounded-full border border-amber-300/80 bg-amber-500 px-4 py-2 text-xs font-black tracking-[0.22em] text-white uppercase shadow-[0_8px_18px_rgba(217,119,6,0.25)] max-sm:px-3 max-sm:py-1.5 max-sm:text-[0.62rem] max-sm:tracking-[0.18em]">
          Principal&apos;s Message
        </div>
        <div className="w-full">
          <p className="text-lg font-black text-slate-900 max-md:text-base max-sm:text-[0.95rem]">{principalName}</p>
          <p className="mt-2 text-sm leading-7 text-slate-700 max-md:leading-6 max-sm:text-[0.82rem] max-sm:leading-5">{principalMessage}</p>
        </div>
      </div>
    </section>
  );
}






