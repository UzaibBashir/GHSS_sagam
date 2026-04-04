"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { HOME_AWARDS } from "../../lib/siteContent";

const DEFAULT_STUDENT_ACHIEVEMENTS = [
  {
    name: "Aaliya Bashir",
    title: "Top Board Performer",
    description: "Secured distinction in board exams with excellent subject-wise consistency.",
  },
  {
    name: "Sana Jan",
    title: "Science Fair Winner",
    description: "Won district-level science fair for an innovative low-cost model project.",
  },
  {
    name: "Insha Yousuf",
    title: "Debate Champion",
    description: "Recognized for outstanding communication and leadership in inter-school debates.",
  },
];

function initialsFor(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeAchievementItems(rawItems) {
  if (!Array.isArray(rawItems) || !rawItems.length) {
    return DEFAULT_STUDENT_ACHIEVEMENTS;
  }

  return rawItems.map((item, index) => {
    if (typeof item === "string") {
      return {
        name: `Student Achievement ${index + 1}`,
        title: "Award and Achievement",
        description: item,
        photo: "",
      };
    }

    const title = String(item?.title || item?.achievement || "Award and Achievement").trim();
    const description = String(item?.description || item?.text || "").trim();

    return {
      name: String(item?.name || `Student Achievement ${index + 1}`).trim(),
      title,
      description: description || title,
      photo: String(item?.photo || "").trim(),
    };
  });
}

export default function AchievementsSection({ institute }) {
  const sourceItems = Array.isArray(institute?.home_student_achievements) && institute.home_student_achievements.length
    ? institute.home_student_achievements
    : Array.isArray(institute?.home_achievements) && institute.home_achievements.length
      ? institute.home_achievements
      : HOME_AWARDS;

  const items = normalizeAchievementItems(sourceItems);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState({});

  const slideToIndex = (nextIndex) => {
    const track = trackRef.current;
    const nextCard = track?.children?.[nextIndex];
    nextCard?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIndex(nextIndex);
  };

  const slideBy = (direction) => {
    const nextIndex = (activeIndex + direction + items.length) % items.length;
    slideToIndex(nextIndex);
  };

  return (
    <section className="grid gap-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(140deg,#fffdf8_0%,#fff6df_52%,#ffffff_100%)] p-6 shadow-[0_10px_24px_rgba(120,53,15,0.08)] max-md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black tracking-[0.28em] text-amber-700 uppercase">Student Awards and Achievements</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 max-md:text-xl">
            Celebrating excellence across academics, leadership, and co-curricular success
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => slideBy(-1)}
            className="rounded-full border border-amber-300/70 bg-white px-4 py-2 text-sm font-bold text-amber-900 transition hover:-translate-y-px hover:bg-amber-50"
            aria-label="Show previous achievement card"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => slideBy(1)}
            className="rounded-full border border-amber-300/70 bg-amber-600 px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-amber-700"
            aria-label="Show next achievement card"
          >
            Next
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <article
            key={`${item.name}-${item.title}-${index}`}
            className="min-w-[280px] flex-1 snap-center rounded-[1.6rem] border border-white/80 bg-white/95 p-4 shadow-[0_14px_28px_rgba(180,120,10,0.10)]"
          >
            <div className="relative overflow-hidden rounded-[1.2rem] bg-[radial-gradient(circle_at_top,#ffe7b3_0%,#ffd075_40%,#b45309_100%)] p-4">
              <div className="mx-auto flex h-32 w-32 items-end justify-center overflow-hidden rounded-[1.3rem] border-4 border-white/70 bg-amber-100 shadow-[0_10px_18px_rgba(120,53,15,0.2)]">
                {item.photo && !failedImages[index] ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={item.photo}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                      onError={() => setFailedImages((prev) => ({ ...prev, [index]: true }))}
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-amber-800 text-3xl font-black text-white">
                    {initialsFor(item.name)}
                  </div>
                )}
              </div>
              <div className="absolute top-3 right-3 rounded-full bg-white/85 px-3 py-1 text-[0.62rem] font-black tracking-[0.16em] text-amber-900 uppercase">
                Achievement
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-950">{item.name}</h3>
              <p className="text-sm font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm leading-6 text-slate-700">{item.description}</p>
            </div>

            <div className="mt-4 flex gap-2">
              {items.map((_, dotIndex) => (
                <button
                  key={`${item.name}-dot-${dotIndex}`}
                  type="button"
                  aria-label={`Show achievement card ${dotIndex + 1}`}
                  onClick={() => slideToIndex(dotIndex)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === dotIndex ? "w-8 bg-amber-600" : "w-2 bg-amber-200"
                  }`}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
