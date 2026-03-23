"use client";

import AboutPreviewSection from "./components/home/AboutPreviewSection";
import AchievementsSection from "./components/home/AchievementsSection";
import FacultySliderSection from "./components/home/FacultySliderSection";
import HeroSection from "./components/home/HeroSection";
import HomeHighlightsSection from "./components/home/HomeHighlightsSection";
import NotificationsSection from "./components/home/NotificationsSection";
import PrincipalMessageFlash from "./components/home/PrincipalMessageFlash";
import ProgramsSection from "./components/home/ProgramsSection";
import ResourcesSection from "./components/home/ResourcesSection";
import LoadingSpinner from "./components/common/LoadingSpinner";
import HomeFooter from "./components/layout/HomeFooter";
import Navbar from "./components/layout/Navbar";
import useInstituteData from "./hooks/useInstituteData";
import { PAGE_MAIN } from "./lib/uiClasses";

export default function Home() {
  const { institute, loading } = useInstituteData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        {loading && !institute ? (
          <section className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3">
            <LoadingSpinner label="Loading institute data" />
          </section>
        ) : null}
        <HeroSection institute={institute} />
        <PrincipalMessageFlash institute={institute} />
        <NotificationsSection institute={institute} />
        <FacultySliderSection institute={institute} />
        <ProgramsSection institute={institute} />
        <HomeHighlightsSection institute={institute} />
        <AchievementsSection institute={institute} />
        <ResourcesSection institute={institute} />
        <AboutPreviewSection institute={institute} />
      </main>
      <HomeFooter institute={institute} />
    </div>
  );
}

