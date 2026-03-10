import { CARD, CTA_LINK } from "../../lib/uiClasses";

export default function AdmissionSection({ institute }) {
  return (
    <section id="admission" className={CARD}>
      <h2>Admission</h2>
      <p>Online admissions are available through our official Google Form.</p>
      <a
        className={CTA_LINK}
        href={institute?.admission_form_url || "https://forms.google.com"}
        target="_blank"
        rel="noreferrer"
      >
        Open Admission Form
      </a>
    </section>
  );
}
