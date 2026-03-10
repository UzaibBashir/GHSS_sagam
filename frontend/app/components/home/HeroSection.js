"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const AUTO_SLIDE_MS = 4500;

export default function HeroSection({ institute }) {
  const slides = useMemo(
    () => [
      {
        src: "/school-slide-1.jpg",
        title: institute?.name || "Government Girls Higher Secondary School, Sagam",
        subtitle: "A vibrant campus where students learn, grow, and lead.",
      },
      {
        src: "/school-slide-2.jpg",
        title: "Admissions Open 2026",
        subtitle: "Join a supportive academic environment focused on excellence and values.",
      },
      {
        src: "/school-slide-3.jpg",
        title: institute?.tagline || "Learn Today, Lead Tomorrow",
        subtitle:
          institute?.description ||
          "Empowering young minds through quality education, discipline, and opportunity.",
      },
    ],
    [institute]
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const [failedSlides, setFailedSlides] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section
      className="relative h-[clamp(16rem,50vw,26rem)] overflow-hidden rounded-3xl border border-slate-200/30 bg-slate-900 shadow-[0_18px_40px_rgba(2,6,23,0.2)]"
      id="home"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-all duration-700 ${
            activeSlide === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        >
          <Image
            src={failedSlides[index] ? "/logo.svg" : slide.src}
            alt={slide.title}
            fill
            priority={index === 0}
            quality={100}
            sizes="100vw"
            className="object-cover"
            onError={() => {
              setFailedSlides((prev) => ({ ...prev, [index]: true }));
            }}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-linear-to-tr from-slate-950/75 via-slate-900/45 to-sky-900/45" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(125,211,252,0.3),rgba(125,211,252,0))]" />

      <div className="relative flex h-full items-end p-8 max-md:p-5">
        <div className="max-w-[48rem] rounded-2xl border border-white/20 bg-slate-950/45 p-5 text-white shadow-[0_10px_30px_rgba(2,6,23,0.25)] backdrop-blur-sm max-sm:p-4">
          <p className="inline-flex rounded-full border border-amber-200/65 bg-amber-300/90 px-3.5 py-1 text-[0.78rem] font-bold tracking-[0.12em] text-slate-900 uppercase">
            Admissions Open 2026
          </p>
          <h1 className="mt-3 text-3xl leading-tight font-extrabold max-md:text-2xl">
            {slides[activeSlide].title}
          </h1>
          <p className="mt-2 text-[1.04rem] leading-relaxed text-slate-100/95 max-md:text-[0.95rem]">
            {slides[activeSlide].subtitle}
          </p>
        </div>
      </div>

      <div className="absolute right-6 bottom-5 flex gap-2.5 max-sm:right-4 max-sm:bottom-4">
        {slides.map((slide, index) => (
          <button
            key={slide.src + index}
            onClick={() => setActiveSlide(index)}
            aria-label={`Show slide ${index + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              activeSlide === index ? "w-8 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"
            }`}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}

