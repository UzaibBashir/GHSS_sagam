import { AUTO_FIT_GRID, CARD } from "../../lib/uiClasses";

export default function AcademicsSection({ institute }) {
  return (
    <section id="academics" className="grid gap-4">
      <h2>Academics</h2>
      <div className={AUTO_FIT_GRID}>
        {(institute?.academics || []).map((item) => (
          <article key={item.title} className={CARD}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
