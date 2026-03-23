"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CallToActionBanner from "../components/common/CallToActionBanner";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

function isPdfAttachment(value) {
  const text = String(value || "").trim().toLowerCase();
  return text.startsWith("data:application/pdf") || text.includes(".pdf");
}

export default function NotificationsPage() {
  const { institute, loading } = useInstituteData();
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
      <main className={PAGE_MAIN}>
        {loading && !institute ? (
          <section className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3">
            <LoadingSpinner label="Loading institute data" />
          </section>
        ) : null}
        <div className="flex items-center">
          <Link href="/" className="inline-flex rounded-full border border-slate-300/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
            Back
          </Link>
        </div>
        {!notificationsEnabled ? (
          <section className="rounded-[2rem] border border-amber-300/70 bg-amber-50/90 p-6 text-amber-900 shadow-[0_18px_36px_rgba(217,119,6,0.12)]">
            <h1 className="text-xl font-extrabold">Notifications Page Disabled</h1>
            <p className="mt-2 text-sm">
              This page is currently turned off by the administrator. Please check back later.
            </p>
          </section>
        ) : (
          <>
            <section className="rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_18px_36px_rgba(15,23,42,0.06)] max-md:p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl font-semibold text-slate-950 max-md:text-xl">All Notifications</h1>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Clean, minimal notices. Tap any item to view details.
                  </p>
                </div>
                <label className="grid gap-1 text-sm font-semibold text-slate-700" htmlFor="category-filter">
                  Filter By Category
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value)}
                    className="rounded-2xl border border-slate-300/80 bg-white/90 px-3 py-2 text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-5 grid gap-2">
                {filteredItems.map((item) => {
                  const isOpen = activeOpenId === item.id;

                  return (
                    <article key={item.id} className="rounded-xl border border-slate-200/80 bg-white px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setOpenId((prev) => (prev === item.id ? "" : item.id))}
                        className="flex w-full items-start justify-between gap-3 text-left"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-700 uppercase">
                            <span>{item.category}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span className="text-slate-500">{item.date}</span>
                          </div>
                          <h2 className="mt-2 text-base font-semibold text-slate-900">{item.title}</h2>
                          <p className="mt-1 text-sm text-slate-600">{item.summary}</p>
                        </div>
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
                          {isOpen ? "Hide" : "View"}
                        </span>
                      </button>

                      {isOpen ? (
                        <div className="mt-3 border-t border-slate-200/80 pt-3">
                          <p className="text-sm leading-6 text-slate-700">{item.details}</p>
                          {item.image_url ? (
                            isPdfAttachment(item.image_url) ? (
                              <a
                                href={item.image_url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                              >
                                Open attached PDF
                              </a>
                            ) : (
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="mt-3 h-auto w-full rounded-xl border border-slate-200 object-cover"
                              />
                            )
                          ) : null}
                          {item.link_url && item.link_label ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <a
                                href={item.link_url}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
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
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
                    No notifications found for selected category.
                  </div>
                ) : null}
              </div>
            </section>
            <CallToActionBanner
              title="Need more than a notice? Reach the school directly"
              description="If you need help understanding a circular, admission timeline, or scholarship-related update, the front desk can guide you further."
              primaryAction={{ label: "Contact School", href: "/about#contact" }}
              secondaryAction={{ label: "View About Page", href: "/about" }}
            />
          </>
        )}
      </main>
    </div>
  );
}


