"use client";

import AboutHero from "../components/about/AboutHero";
import FacilitiesSection from "../components/about/FacilitiesSection";
import FacultiesSection from "../components/about/FacultiesSection";
import InstituteDetailsSection from "../components/about/InstituteDetailsSection";
import StaffSection from "../components/about/StaffSection";
import StreamsSection from "../components/about/StreamsSection";
import Navbar from "../components/layout/Navbar";
import useInstituteData from "../hooks/useInstituteData";
import { PAGE_MAIN } from "../lib/uiClasses";

export default function AboutPage() {
  const { institute } = useInstituteData();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={PAGE_MAIN}>
        <AboutHero institute={institute} />
        <InstituteDetailsSection institute={institute} />
        <FacultiesSection institute={institute} />
        <StreamsSection institute={institute} />
        <StaffSection institute={institute} />
        <FacilitiesSection institute={institute} />
      </main>
    </div>
  );
}
