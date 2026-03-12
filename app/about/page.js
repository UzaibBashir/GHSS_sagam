"use client";

import HomeFooter from "../components/layout/HomeFooter";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { ABOUT_PAGE_CONTENT, HOME_ABOUT_CONTENT } from "../lib/siteContent";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function AboutPage() {
  const { institute } = useInstituteData();

  const instituteName = institute?.name || "Government Girls Higher Secondary School, Sagam";
  const faculty = institute?.faculties || [];
  const staff = institute?.staff || [];
  const facilities = institute?.facilities || [];
  const details = institute?.institute_details?.length ? institute.institute_details : HOME_ABOUT_CONTENT.basicDetails;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
          <h1 className="text-2xl font-extrabold text-slate-900 max-md:text-xl">About Us</h1>
          <p className="mt-2 text-slate-700">{institute?.about_us || HOME_ABOUT_CONTENT.intro}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Institute</h2>
              <p className="mt-2 text-sm font-semibold text-slate-900">{instituteName}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Vision</h2>
              <p className="mt-2 text-sm text-slate-700">{HOME_ABOUT_CONTENT.vision}</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Motto</h2>
              <p className="mt-2 text-sm font-bold text-slate-900">{HOME_ABOUT_CONTENT.motto}</p>
            </article>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
          <h2 className="text-xl font-extrabold text-slate-900">Principal Desk</h2>
          <p className="mt-2 text-slate-700">{ABOUT_PAGE_CONTENT.principalDesk.message}</p>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-700">
            {ABOUT_PAGE_CONTENT.principalDesk.priorities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
            <h2 className="text-lg font-extrabold text-slate-900">Administration</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-700">
              {ABOUT_PAGE_CONTENT.administration.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
            <h2 className="text-lg font-extrabold text-slate-900">Mission</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-700">
              {HOME_ABOUT_CONTENT.mission.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
            <h2 className="text-lg font-extrabold text-slate-900">Faculty</h2>
            <div className="mt-3 grid gap-2">
              {faculty.map((item) => (
                <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="m-0 font-bold text-slate-900">{item.name}</p>
                  <p className="m-0">{item.department}</p>
                  <p className="m-0 text-xs text-slate-600">{item.qualification}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
            <h2 className="text-lg font-extrabold text-slate-900">Staff</h2>
            <div className="mt-3 grid gap-2">
              {staff.map((item) => (
                <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="m-0 font-bold text-slate-900">{item.name}</p>
                  <p className="m-0">{item.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
            <h2 className="text-lg font-extrabold text-slate-900">Basic Details</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-700">
              {details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
            <h2 className="text-lg font-extrabold text-slate-900">Facilities</h2>
            <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-700">
              {facilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
          <h2 className="text-lg font-extrabold text-slate-900">Achievements</h2>
          <ul className="mt-3 grid list-disc gap-2 pl-5 text-sm text-slate-700">
            {ABOUT_PAGE_CONTENT.achievements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
      <HomeFooter institute={institute} />
    </div>
  );
}