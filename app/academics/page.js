"use client";

import PageHero from "../components/common/PageHero";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

const LOGIN_FORM_URL = process.env.NEXT_PUBLIC_GHSS_LOGIN_FORM_URL || "https://docs.google.com/forms/";

export default function AcademicsPage() {
  const { institute } = useInstituteData();
  const controls = institute?.site_controls;
  const academicsEnabled = controls?.academics_page_enabled ?? true;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <PageHero
          eyebrow="Academic Life"
          title="Academic login credentials are issued through request form"
          description="If you are a student of GHSS, submit your details in the Google Form to receive your login credentials."
          stats={[
            { value: "GHSS", label: "Student Request" },
            { value: "Form", label: "Submit Details" },
            { value: "Review", label: "School Verification" },
            { value: "Login", label: "Credentials Issued" },
          ]}
          actions={[
            { label: "Open Credential Form", href: LOGIN_FORM_URL },
            { label: "Go To Admission", href: "/admission", variant: "secondary" },
          ]}
        />

        {!academicsEnabled ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Academics Page Disabled</h1>
            <p className="mt-2 text-sm">This page is currently disabled by the administrator.</p>
          </section>
        ) : (
          <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
            <p className="section-kicker">Credential Request</p>
            <h2 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">
              Submit details for login credentials (GHSS students only)
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Students of GHSS should submit their details using the Google Form below. After verification, login credentials will be shared by the school.
            </p>
            <a
              href={LOGIN_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full bg-linear-to-r from-amber-400 to-yellow-500 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-[0_16px_28px_rgba(212,166,70,0.26)] transition hover:-translate-y-0.5"
            >
              Submit Details Form
            </a>
          </section>
        )}
      </main>
    </div>
  );
}
