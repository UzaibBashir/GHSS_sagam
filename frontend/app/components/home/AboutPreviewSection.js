import Link from "next/link";
import { CARD, CTA_LINK } from "../../lib/uiClasses";

export default function AboutPreviewSection({ institute }) {
  return (
    <section id="about-us" className={CARD}>
      <h2>About Us</h2>
      <p>{institute?.about_us || "Loading..."}</p>
      <Link href="/about" className={CTA_LINK}>
        Read Full About Us
      </Link>
    </section>
  );
}
