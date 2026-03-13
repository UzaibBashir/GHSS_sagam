"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import CallToActionBanner from "../components/common/CallToActionBanner";
import PageHero from "../components/common/PageHero";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function NotificationsPage() {
  const { institute } = useInstituteData();
  const notificationItems = useMemo(() => institute?.notification_items || [], [institute]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openId, setOpenId] = useState("");
  const activeOpenId = openId || notificationItems[0]?.id || "";

  const controls = institute?.site_controls;
  const notificationsEnabled = controls?.notifications_page_enabled ?? true;

  const categories = useMemo(
    () => ["All", ...new Set(notificationItems.map((item) => item.category))],
    [notificationItems]
  );

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") {
      return notificationItems;
    }
    return notificationItems.filter((item) => item.category === selectedCategory);
  }, [notificationItems, selectedCategory]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <PageHero
          eyebrow="Notice Board"
          title="Stay updated with admissions, examinations, scholarships, and school announcements"
          description="This page gathers important circulars and institutional updates in one place so students and parents can quickly review what matters most."
          stats={[
            { value: `${notificationItems.length || 0}`, label: "Published Notices" },
            { value: `${categories.length - 1 || 0}`, label: "Notice Categories" },
            { value: "Current", label: "Academic Updates" },
            { value: "Parent", label: "Communication Support" },
          ]}
          actions={[
            { label: "Explore Admission", href: "/admission" },
            { label: "Contact School", href: "/contact", variant: "secondary" },
          ]}
        />

        {!notificationsEnabled ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Notifications Page Disabled</h1>
            <p className="mt-2 text-sm">
              This page is currently turned off by the administrator. Please check back later.
            </p>
          </section>
        ) : (
          <>
            <section className="grid gap-5 rounded-[2rem] border border-white/75 bg-white/78 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur max-md:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl font-semibold text-slate-950 max-md:text-2xl">All Notifications</h1>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Browse all circulars, announcements, and updates. Click any notification to view full details.
                  </p>
                </div>
                <label className="grid gap-1 text-sm font-semibold text-slate-700" htmlFor="category-filter">
                  Filter By Category
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="rounded-2xl border border-slate-300/80 bg-white/88 px-3 py-2 text-sm shadow-[0_10px_18px_rgba(15,23,42,0.04)]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3">
                {filteredItems.map((item) => {
                  const isOpen = activeOpenId === item.id;

                  return (
                    <article key={item.id} className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/86 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                      <button
                        type="button"
                        onClick={() => setOpenId((prev) => (prev === item.id ? "" : item.id))}
                        className="flex w-full items-start justify-between gap-3 p-4 text-left"
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-linear-to-r from-amber-300 to-yellow-500 px-2.5 py-1 text-xs font-bold text-slate-950">
                              {item.category}
                            </span>
                            <span className="text-xs font-medium text-slate-500">{item.date}</span>
                          </div>
                          <h2 className="mt-2 text-lg font-bold text-slate-900">{item.title}</h2>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{item.summary}</p>
                        </div>
                        <span className="mt-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
                          {isOpen ? "Hide" : "View"}
                        </span>
                      </button>

                      {isOpen ? (
                        <div className="border-t border-slate-200/80 px-4 py-4">
                          <p className="text-sm leading-relaxed text-slate-700">{item.details}</p>
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              width={1000}
                              height={560}
                              className="mt-3 h-auto w-full rounded-[1.2rem] border border-slate-200 object-cover"
                            />
                          ) : null}
                          {item.link_url && item.link_label ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <a
                                href={item.link_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-100"
                              >
                                {item.link_label}
                              </a>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </article>
                  );
                })}

                {!filteredItems.length ? (
                  <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/90 px-4 py-3 text-sm text-slate-500">
                    No notifications found for selected category.
                  </div>
                ) : null}
              </div>
            </section>
            <CallToActionBanner
              title="Need more than a notice? Reach the school directly"
              description="If you need help understanding a circular, admission timeline, or scholarship-related update, the front desk can guide you further."
              primaryAction={{ label: "Contact School", href: "/contact" }}
              secondaryAction={{ label: "View About Page", href: "/about" }}
            />
          </>
        )}
      </main>
    </div>
  );
}
