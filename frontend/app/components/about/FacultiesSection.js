import { AUTO_FIT_GRID, CARD } from "../../lib/uiClasses";

export default function FacultiesSection({ institute }) {
  return (
    <section className="grid gap-4">
      <h2>Faculties</h2>
      <div className={AUTO_FIT_GRID}>
        {(institute?.faculties || []).map((item) => (
          <article className={CARD} key={`${item.name}-${item.department}`}>
            <h3>{item.name}</h3>
            <p>{item.department}</p>
            <p>{item.qualification}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
