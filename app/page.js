"use client";

import AboutPreviewSection from "./components/home/AboutPreviewSection";
import AchievementsSection from "./components/home/AchievementsSection";
import FacultySliderSection from "./components/home/FacultySliderSection";
import HeroSection from "./components/home/HeroSection";
import NotificationsSection from "./components/home/NotificationsSection";
import PrincipalMessageFlash from "./components/home/PrincipalMessageFlash";
import ProgramsSection from "./components/home/ProgramsSection";
import ResourcesSection from "./components/home/ResourcesSection";
import HomeFooter from "./components/layout/HomeFooter";
import Navbar from "./components/layout/Navbar";
import useInstituteData from "./hooks/useInstituteData";
import { PAGE_MAIN } from "./lib/uiClasses";

export default function Home() {
  const { institute } = useInstituteData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <HeroSection institute={institute} />
        <PrincipalMessageFlash institute={institute} />
        <NotificationsSection institute={institute} />
        <FacultySliderSection institute={institute} />
        <ProgramsSection institute={institute} />
        <AchievementsSection institute={institute} />
        <ResourcesSection institute={institute} />
        <AboutPreviewSection institute={institute} />
      </main>
      <HomeFooter institute={institute} />
    </div>
  );
}
