"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const AUTO_SLIDE_MS = 4500;

export default function HeroSection({ institute }) {
  const slides = useMemo(
    () => [
      {
        src: "/slideshow/slide1.jpeg",
        title: institute?.name || "Government Girls Higher Secondary School, Sagam",
        subtitle: "A vibrant campus where students learn, grow, and lead.",
      },
      {
        src: "/slideshow/slide2.jpeg",
        title: "Admissions Open 2026",
        subtitle: "Join a supportive academic environment focused on excellence and values.",
      },
      {
        src: "/slideshow/slide3.jpeg",
        title: institute?.tagline || "Learn Today, Lead Tomorrow",
        subtitle:
          institute?.description ||
          "Empowering young minds through quality education, discipline, and opportunity.",
      },
      {
        src: "/slideshow/slide4.jpeg",
        title: "Strong Academics, Bright Futures",
        subtitle: "From classroom learning to co-curricular growth, every student gets opportunities to shine.",
      },
      {
        src: "/slideshow/slide5.jpeg",
        title: "A Safe And Supportive Campus",
        subtitle: "A disciplined and encouraging environment where every learner is respected and inspired.",
      },
      {
        src: "/slideshow/slide6.jpeg",
        title: "Focused Classroom Learning",
        subtitle: "Daily lessons that build confidence, clarity, and subject mastery.",
      },
      {
        src: "/slideshow/slide7.jpeg",
        title: "Learning Beyond The Classroom",
        subtitle: "Co-curricular activities that nurture leadership, teamwork, and creativity.",
      },
      {
        src: "/slideshow/slide8.jpeg",
        title: "Guidance For Every Stream",
        subtitle: "Academic support tailored for Medical, Non-Medical, and Arts students.",
      },
      {
        src: "/slideshow/slide9.jpeg",
        title: "Building Bright Futures",
        subtitle: "A caring school community committed to student success and wellbeing.",
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

      <div className="relative flex h-full items-end p-8 max-md:p-4 max-sm:p-3">
        <div className="h-auto w-full max-w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-950/45 px-1 py-1 pb-0 text-white shadow-[0_10px_30px_rgba(2,6,23,0.25)] sm:max-w-[24rem] md:h-auto md:px-2.5 md:py-2 md:pb-1.5">
          <p className="inline-flex rounded-full border border-amber-200/65 bg-amber-300/90 px-2 py-0.5 text-[0.48rem] font-bold tracking-[0.04em] sm:text-[0.62rem] sm:tracking-[0.08em] text-slate-900 uppercase">
            Admissions Open 2026
          </p>
          <h1 className="mt-0.5 text-[0.56rem] leading-tight font-extrabold sm:mt-1 sm:text-lg md:text-base">
            {slides[activeSlide].title}
          </h1>
          <p className="mt-0.5 text-[0.5rem] leading-tight text-slate-100/95 sm:mt-1 sm:text-xs md:text-[0.72rem]">
            {slides[activeSlide].subtitle}
          </p>
          <div className="mt-0.5 flex flex-wrap gap-1">
            <Link
              href="/admission"
              className="rounded-full bg-amber-400 px-1.5 py-[1px] text-[0.5rem] font-bold tracking-normal text-slate-900 transition hover:-translate-y-px hover:bg-amber-300 sm:px-2.5 sm:py-1 sm:text-[0.7rem] md:px-2 md:text-[0.62rem]"
            >
              Apply For Admission
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

















