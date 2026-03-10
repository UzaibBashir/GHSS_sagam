import { BULLET_LIST, CARD } from "../../lib/uiClasses";

export default function FacilitiesSection({ institute }) {
  return (
    <section className={CARD}>
      <h2>Facilities</h2>
      <ul className={BULLET_LIST}>
        {(institute?.facilities || []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
