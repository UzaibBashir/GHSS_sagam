import { AUTO_FIT_GRID, CARD, CTA_LINK } from "../../lib/uiClasses";

export default function DownloadsSection({ institute }) {
  return (
    <section id="download" className="grid gap-4">
      <h2>Download</h2>
      <div className={AUTO_FIT_GRID}>
        {(institute?.downloads || []).map((item) => (
          <article className={CARD} key={`${item.title}-${item.url}`}>
            <h3>{item.title}</h3>
            <a href={item.url} target="_blank" rel="noreferrer" className={CTA_LINK}>
              Download File
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
