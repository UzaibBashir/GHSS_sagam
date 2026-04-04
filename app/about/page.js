"use client";

import AboutContactSection from "../components/about/AboutContactSection";
import CallToActionBanner from "../components/common/CallToActionBanner";
import LoadingSpinner from "../components/common/LoadingSpinner";
import PageHero from "../components/common/PageHero";
import ContactSection from "../components/home/ContactSection";
import HomeHighlightsSection from "../components/home/HomeHighlightsSection";
import HomeFooter from "../components/layout/HomeFooter";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { HOME_ABOUT_CONTENT } from "../lib/siteContent";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function AboutPage() {
  const { institute, loading } = useInstituteData();

  const controls = institute?.site_controls;
  const aboutEnabled = controls?.about_page_enabled ?? true;

  const instituteName = institute?.name || "Government Girls Higher Secondary School, Sagam";
  const faculty = institute?.faculties || [];
  const staff = institute?.staff || [];
  const facilities = institute?.facilities || [];
  const details = institute?.institute_details?.length ? institute.institute_details : HOME_ABOUT_CONTENT.basicDetails;
  const aboutDescription = institute?.description || institute?.about_us || HOME_ABOUT_CONTENT.intro;
  const missionItems =
    Array.isArray(institute?.home_highlights?.reasons) && institute.home_highlights.reasons.length
      ? institute.home_highlights.reasons
      : HOME_ABOUT_CONTENT.mission;
  const principalMessage = institute?.principal?.message || institute?.about_us || HOME_ABOUT_CONTENT.intro;
  const principalPriorities =
    Array.isArray(institute?.home_front_desk?.items) && institute.home_front_desk.items.length
      ? institute.home_front_desk.items
      : HOME_ABOUT_CONTENT.mission;
  const administrationItems = staff.length
    ? staff.map((item) => `${item.name || "Staff"} - ${item.role || "Role not set"}`)
    : ["Administration details will appear here once added from the admin panel."];
  const achievementItems =
    Array.isArray(institute?.home_student_achievements) && institute.home_student_achievements.length
      ? institute.home_student_achievements.map((item) => ({
          title: item.title || item.name || "Student Achievement",
          description: item.description || "Achievement details will appear here.",
        }))
      : [{ title: "No achievements added yet", description: "Add student achievements from the admin panel to show them here." }];

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        {loading && !institute ? (
          <section className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3">
            <LoadingSpinner label="Loading institute data" />
          </section>
        ) : null}
        <PageHero
          eyebrow="About The Institute"
          title="A dedicated public institution for girls' education from classes IX to XII in Sagam"
          description={institute?.about_us || HOME_ABOUT_CONTENT.intro}
          stats={[
            { value: "3", label: "Academic Streams" },
            { value: "IX-XII", label: "Classes Covered" },
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
              {aboutDescription}
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
              {missionItems.map((item) => (
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
            <p className="mt-3 text-sm leading-7 text-slate-600 overflow-hidden whitespace-nowrap"><span className="marquee-track">{principalMessage}</span></p>
            <ul className="mt-5 grid gap-3">
              {principalPriorities.map((item) => (
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

        <HomeHighlightsSection institute={institute} />

        <div className="grid gap-6 md:grid-cols-2">
          <section className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4 min-w-0">
            <h2 className="font-display text-2xl font-semibold text-slate-950">Administration</h2>
            <ul className="mt-4 grid gap-3">
              {administrationItems.map((item) => (
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
            {achievementItems.map((item, index) => (
              <li key={`${item.title}-${index}`} className="rounded-[1.2rem] border border-slate-200/70 bg-white/82 px-4 py-4 text-sm leading-6 text-slate-700">
                <p className="font-bold text-slate-900">{item.title}</p>
                <p className="mt-1">{item.description}</p>
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

