import Link from "next/link";
import { CARD, CTA_LINK } from "../../lib/uiClasses";

export default function AdmissionPreviewSection() {
  return (
    <section className={CARD}>
      <h2>Admission</h2>
      <p>Check eligibility, required documents, and access our online form.</p>
      <Link href="/admission" className={CTA_LINK}>
        View Admission Page
      </Link>
    </section>
  );
}

