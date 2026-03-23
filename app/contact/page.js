"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function ContactPage() {
  const router = useRouter();
  const { institute, loading } = useInstituteData();
  const controls = institute?.site_controls;
  const contactPageEnabled = controls?.contact_page_enabled;

  useEffect(() => {
    if (contactPageEnabled === true) {
      router.replace("/about#contact");
    }
  }, [contactPageEnabled, router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        {loading && !institute ? (
          <section className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3">
            <LoadingSpinner label="Loading institute data" />
          </section>
        ) : null}
        {contactPageEnabled === false ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Contact Page Disabled</h1>
            <p className="mt-2 text-sm">This page is currently turned off by the administrator.</p>
          </section>
         ) : contactPageEnabled === true ? (
          <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-6 text-slate-700 shadow-[0_18px_36px_rgba(15,23,42,0.06)]">
            <h1 className="text-xl font-extrabold text-slate-900">Redirecting to contact details...</h1>
            <p className="mt-2 text-sm">Taking you to the contact section on the About page.</p>
          </section>
        ) : null}
      </main>
    </div>
  );
}

