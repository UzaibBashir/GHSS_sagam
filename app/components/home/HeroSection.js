"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const AUTO_SLIDE_MS = 4500;

const FALLBACK_SLIDES = [
  {
    src: "",
    title: "Empowering Girls Through Education and Opportunity",
    subtitle: "Admissions open for Medical, Non-Medical, and Arts streams.",
  },
  {
    src: "",
    title: "Disciplined Learning with Dedicated Faculty Support",
    subtitle: "A focused higher-secondary environment for academic growth.",
  },
  {
    src: "",
    title: "Build Your Future with Confidence at GGHSS Sagam",
    subtitle: "Apply online and track your application status easily.",
  },
];

export default function HeroSection({ institute }) {
  const slides = useMemo(() => {
    const rawSlides = Array.isArray(institute?.hero_slides) ? institute.hero_slides : [];

    const normalized = rawSlides
      .map((slide) => ({
        src: String(slide?.src || "").trim(),
        title: String(slide?.title || "").trim(),
        subtitle: String(slide?.subtitle || "").trim(),
      }))
      .filter((slide) => slide.title && slide.subtitle);

    return normalized.length ? normalized : FALLBACK_SLIDES;
  }, [institute]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [failedSlides, setFailedSlides] = useState({});
  const [loadedSlides, setLoadedSlides] = useState({});
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (!slides.length) return undefined;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (document.readyState === "complete") {
      Promise.resolve().then(() => {
        setPageReady(true);
      });
      return undefined;
    }

    const markReady = () => setPageReady(true);
    window.addEventListener("load", markReady, { once: true });
    return () => {
      window.removeEventListener("load", markReady);
    };
  }, []);

  return (
    <section
      className="relative h-[clamp(16rem,50vw,26rem)] overflow-hidden rounded-3xl border border-slate-200/30 bg-slate-900 shadow-[0_18px_40px_rgba(2,6,23,0.2)]"
      id="home"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(14,165,233,0.18),transparent_40%),linear-gradient(160deg,rgba(2,6,23,0.9),rgba(15,23,42,0.75))]" />

      {slides.map((slide, index) => {
        const hasImage = Boolean(slide.src) && !failedSlides[index];
        const isLoaded = Boolean(loadedSlides[index]);
        const enhanceQuality = isLoaded && pageReady;

        return (
          <div
            key={`${slide.src || "fallback"}-${index}`}
            className={`absolute inset-0 transition-all duration-700 ${
              activeSlide === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          >
            {hasImage ? (
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                unoptimized
                priority={index === 0}
                sizes="100vw"
                className={`object-cover transition-all duration-[1600ms] ease-out will-change-[filter,transform,opacity] ${
                  isLoaded ? "opacity-100" : "opacity-0"
                } ${enhanceQuality ? "blur-0 saturate-100 contrast-100 scale-100" : "blur-xl saturate-75 contrast-75 scale-[1.06]"}`}
                onLoad={() => {
                  setLoadedSlides((prev) => ({ ...prev, [index]: true }));
                }}
                onError={() => {
                  setFailedSlides((prev) => ({ ...prev, [index]: true }));
                }}
              />
            ) : null}
          </div>
        );
      })}

      <div className="relative flex h-full items-end p-8 max-md:p-4 max-sm:p-3">
        <div className="h-auto w-full max-w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-950/45 px-1 py-1 pb-0 text-white shadow-[0_10px_30px_rgba(2,6,23,0.25)] sm:max-w-[24rem] md:h-auto md:px-2.5 md:py-2 md:pb-1.5">
          <p className="inline-flex rounded-full border border-amber-200/65 bg-amber-300/90 px-2 py-0.5 text-[0.48rem] font-bold tracking-[0.04em] sm:text-[0.62rem] sm:tracking-[0.08em] text-slate-900 uppercase">
            Admissions Open 2026
          </p>
          <h1 className="mt-0.5 text-[0.56rem] leading-tight font-extrabold sm:mt-1 sm:text-lg md:text-base">
            {(slides[activeSlide] || slides[0]).title}
          </h1>
          <p className="mt-0.5 text-[0.5rem] leading-tight text-slate-100/95 sm:mt-1 sm:text-xs md:text-[0.72rem]">
            {(slides[activeSlide] || slides[0]).subtitle}
          </p>
          <div className="mt-0.5 flex flex-wrap gap-1">
            <Link
              href="/admission"
              className="rounded-full bg-amber-400 px-1.5 py-[1px] text-[0.5rem] font-bold tracking-normal text-slate-900 transition hover:-translate-y-px hover:bg-amber-300 sm:px-2.5 sm:py-1 sm:text-[0.7rem] md:px-2 md:text-[0.62rem]"
            >
              Open Admission Form
            </Link>
            <Link
              href="/notifications"
              className="rounded-full border border-white/35 bg-white/12 px-1.5 py-[1px] text-[0.5rem] font-semibold text-white transition hover:bg-white/20 sm:px-2.5 sm:py-1 sm:text-[0.7rem] md:px-2 md:text-[0.62rem]"
            >
              View Notifications
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute right-6 bottom-5 flex gap-2.5 max-sm:right-4 max-sm:bottom-4">
        {slides.map((slide, index) => (
          <button
            key={`${slide.src || "fallback"}-${index}-dot`}
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

