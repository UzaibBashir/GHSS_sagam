import { AUTO_FIT_GRID, CARD } from "../../lib/uiClasses";

export default function StaffSection({ institute }) {
  return (
    <section className="grid gap-4">
      <h2>Staff</h2>
      <div className={AUTO_FIT_GRID}>
        {(institute?.staff || []).map((item) => (
          <article className={CARD} key={`${item.name}-${item.role}`}>
            <h3>{item.name}</h3>
            <p>{item.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
