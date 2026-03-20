"use client";

import AboutContactSection from "../components/about/AboutContactSection";
import CallToActionBanner from "../components/common/CallToActionBanner";
import PageHero from "../components/common/PageHero";
import ContactSection from "../components/home/ContactSection";
import HomeHighlightsSection from "../components/home/HomeHighlightsSection";
import HomeFooter from "../components/layout/HomeFooter";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { ABOUT_PAGE_CONTENT, HOME_ABOUT_CONTENT } from "../lib/siteContent";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function AboutPage() {
  const { institute } = useInstituteData();

  const controls = institute?.site_controls;
  const aboutEnabled = controls?.about_page_enabled ?? true;

  const instituteName = institute?.name || "Government Girls Higher Secondary School, Sagam";
  const faculty = institute?.faculties || [];
  const staff = institute?.staff || [];
  const facilities = institute?.facilities || [];
  const details = institute?.institute_details?.length ? institute.institute_details : HOME_ABOUT_CONTENT.basicDetails;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <PageHero
          eyebrow="About The Institute"
          title="A dedicated public institution for girls' higher secondary education in Sagam"
          description={institute?.about_us || HOME_ABOUT_CONTENT.intro}
          stats={[
            { value: "3", label: "Academic Streams" },
            { value: "XI-XII", label: "Higher Secondary Classes" },
            { value: "Girls First", label: "Safe Learning Focus" },
            { value: "Community", label: "Local Educational Service" },
          ]}
          actions={[
            { label: "Explore Academics", href: "/academics" },
            { label: "Contact Details", href: "/about#contact", variant: "secondary" },
          ]}
        />
        {!aboutEnabled ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">About Page Disabled</h1>
            <p className="mt-2 text-sm">This page is currently turned off by the administrator.</p>
          </section>
        ) : (
          <>
        <section className="glass-panel grid gap-6 rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="section-kicker">Institutional Overview</p>
            <h2 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">Why families trust {instituteName}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 break-words text-left w-full">
              The institute combines academic discipline, caring mentorship, and a supportive environment that helps
              girls prepare for board examinations, scholarships, and future studies with confidence.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <article className="rounded-[1.5rem] border border-slate-200/80 bg-white/82 p-4">
                <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Vision</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{HOME_ABOUT_CONTENT.vision}</p>
              </article>
              <article className="rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white">
                <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-amber-300 uppercase">Motto</p>
                <p className="font-display mt-2 text-2xl font-semibold">{HOME_ABOUT_CONTENT.motto}</p>
              </article>
            </div>
          </div>

          <div className="rounded-[1.7rem] border border-slate-200/80 bg-white/82 p-5 shadow-[0_18px_36px_rgba(15,23,42,0.05)]">
            <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Mission In Action</p>
            <ul className="mt-4 grid gap-3">
              {HOME_ABOUT_CONTENT.mission.map((item) => (
                <li key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-slate-50/85 px-4 py-3 text-sm leading-6 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>


        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 min-w-0">
            <p className="section-kicker">Principal Desk</p>
            <h2 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">
              Leadership rooted in care, discipline, and aspiration
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 overflow-hidden whitespace-nowrap"><span className="marquee-track">{ABOUT_PAGE_CONTENT.principalDesk.message}</span></p>
            <ul className="mt-5 grid gap-3">
              {ABOUT_PAGE_CONTENT.principalDesk.priorities.map((item) => (
                <li key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 px-4 py-3 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)] max-md:p-4 min-w-0">
            <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-amber-300 uppercase">Institute Snapshot</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {details.map((item) => (
                <div key={item} className="rounded-[1.2rem] border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <HomeHighlightsSection />

        <div className="grid gap-6 md:grid-cols-2">
          <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 min-w-0">
            <h2 className="font-display text-2xl font-semibold text-slate-950">Administration</h2>
            <ul className="mt-4 grid gap-3">
              {ABOUT_PAGE_CONTENT.administration.map((item) => (
                <li key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 px-4 py-3 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 min-w-0">
            <h2 className="font-display text-2xl font-semibold text-slate-950">Facilities</h2>
            <ul className="mt-4 grid gap-3">
              {facilities.map((item) => (
                <li key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 px-4 py-3 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 min-w-0">
            <h2 className="font-display text-2xl font-semibold text-slate-950">Faculty</h2>
            <div className="mt-4 grid gap-3">
              {faculty.map((item) => (
                <div key={item.name} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 p-4 text-sm text-slate-700">
                  <p className="m-0 font-bold text-slate-900">{item.name}</p>
                  <p className="m-0 mt-1">{item.designation || item.department}</p>
                  <p className="m-0 mt-1 text-xs text-slate-500">{item.qualification}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 min-w-0">
            <h2 className="font-display text-2xl font-semibold text-slate-950">Staff Support</h2>
            <div className="mt-4 grid gap-3">
              {staff.map((item) => (
                <div key={item.name} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 p-4 text-sm text-slate-700">
                  <p className="m-0 font-bold text-slate-900">{item.name}</p>
                  <p className="m-0 mt-1">{item.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 min-w-0">
          <h2 className="font-display text-2xl font-semibold text-slate-950">Achievements</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {ABOUT_PAGE_CONTENT.achievements.map((item) => (
              <li key={item} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 px-4 py-4 text-sm leading-6 text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </section>


        <CallToActionBanner
          title="Visit the school, explore streams, and speak with the front desk"
          description="Families looking for admission, transfer guidance, or stream selection support can connect directly with the institute for clear next steps."
          primaryAction={{ label: "Open Admission Page", href: "/admission" }}
          secondaryAction={{ label: "Jump To Contact", href: "/about#contact" }}
        />

        <AboutContactSection institute={institute} />
        <ContactSection institute={institute} />
          </>
        )}
      </main>
      <HomeFooter institute={institute} />
    </div>
  );
}

