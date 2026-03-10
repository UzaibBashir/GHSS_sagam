import { AUTO_FIT_GRID, CARD } from "../../lib/uiClasses";

export default function StreamsSection({ institute }) {
  return (
    <section className="grid gap-4">
      <h2>Subjects and Streams</h2>
      <div className={AUTO_FIT_GRID}>
        {(institute?.streams_subjects || []).map((item) => (
          <article className={CARD} key={item.stream}>
            <h3>{item.stream}</h3>
            <p>{item.subjects.join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
