"use client";

import AboutPreviewSection from "./components/home/AboutPreviewSection";
import HeroSection from "./components/home/HeroSection";
import NotificationsSection from "./components/home/NotificationsSection";
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
        <NotificationsSection institute={institute} />
        <AboutPreviewSection institute={institute} />
      </main>
      <HomeFooter institute={institute} />
    </div>
  );
}
