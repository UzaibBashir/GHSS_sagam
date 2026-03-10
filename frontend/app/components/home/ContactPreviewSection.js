import Link from "next/link";
import { CARD, CTA_LINK } from "../../lib/uiClasses";

export default function ContactPreviewSection({ institute }) {
  return (
    <section className={CARD}>
      <h2>Contact</h2>
      <p>Email: {institute?.contact?.email || "info@school.edu"}</p>
      <p>Phone: {institute?.contact?.phone || "N/A"}</p>
      <Link href="/contact" className={CTA_LINK}>
        Open Contact Page
      </Link>
    </section>
  );
}
