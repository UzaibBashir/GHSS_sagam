"use client";

import Image from "next/image";
import { useRef, useState } from "react";

function initialsFor(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function FacultySliderSection({ institute }) {
  const faculties = institute?.faculties || [];
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!faculties.length) {
    return null;
  }

  const slideToIndex = (nextIndex) => {
    const track = trackRef.current;
    const nextCard = track?.children?.[nextIndex];
    nextCard?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    setActiveIndex(nextIndex);
  };

  const slideBy = (direction) => {
    const nextIndex = (activeIndex + direction + faculties.length) % faculties.length;
    slideToIndex(nextIndex);
  };

  return (
    <section className="grid gap-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#eef7ff_50%,#fef6ec_100%)] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] max-md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black tracking-[0.28em] text-sky-700 uppercase">
            Meet Our Faculty
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 max-md:text-xl">
            Dedicated mentors guiding every student forward
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => slideBy(-1)}
            className="rounded-full border border-sky-300/60 bg-white px-4 py-2 text-sm font-bold text-sky-900 transition hover:-translate-y-px hover:bg-sky-50"
            aria-label="Show previous faculty card"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => slideBy(1)}
            className="rounded-full border border-sky-300/60 bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-sky-700"
            aria-label="Show next faculty card"
          >
            Next
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {faculties.map((faculty, index) => (
          <article
            key={`${faculty.name}-${faculty.department}`}
            className="min-w-[280px] flex-1 snap-center rounded-[1.6rem] border border-white/80 bg-white/90 p-4 shadow-[0_14px_30px_rgba(14,116,144,0.12)] backdrop-blur"
          >
            <div className="relative overflow-hidden rounded-[1.3rem] bg-[radial-gradient(circle_at_top,#cfefff_0%,#8fd0ef_45%,#0f172a_100%)] p-4">
              <div className="mx-auto flex h-44 w-44 items-end justify-center overflow-hidden rounded-[1.6rem] border-4 border-white/70 bg-slate-200 shadow-[0_12px_24px_rgba(15,23,42,0.18)]">
                {faculty.photo ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={faculty.photo}
                      alt={faculty.name}
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-800 text-4xl font-black text-white">
                    {initialsFor(faculty.name)}
                  </div>
                )}
              </div>
              <div className="absolute top-3 right-3 rounded-full bg-white/85 px-3 py-1 text-[0.65rem] font-black tracking-[0.18em] text-sky-900 uppercase">
                {faculty.department}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-xl font-extrabold text-slate-950">{faculty.name}</h3>
              <p className="text-sm font-semibold text-sky-800">{faculty.qualification}</p>
            </div>

            <div className="mt-4 flex gap-2">
              {faculties.map((_, dotIndex) => (
                <button
                  key={`${faculty.name}-dot-${dotIndex}`}
                  type="button"
                  aria-label={`Show faculty card ${dotIndex + 1}`}
                  onClick={() => slideToIndex(dotIndex)}
                  className={`h-2 rounded-full transition-all ${
                    activeIndex === dotIndex ? "w-8 bg-sky-600" : "w-2 bg-slate-300"
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
