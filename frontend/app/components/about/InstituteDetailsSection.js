import { BULLET_LIST, CARD } from "../../lib/uiClasses";

export default function InstituteDetailsSection({ institute }) {
  return (
    <section className={CARD}>
      <h2>Institute Details</h2>
      <ul className={BULLET_LIST}>
        {(institute?.institute_details || []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
