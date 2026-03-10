import { AUTO_FIT_GRID, CARD, CTA_LINK, DANGER_BUTTON, INPUT, PRIMARY_BUTTON } from "../../lib/uiClasses";

export default function DownloadsManager({
  downloads,
  newDownloadTitle,
  newDownloadUrl,
  onTitleChange,
  onUrlChange,
  onAddDownload,
  onRemoveDownload,
}) {
  return (
    <section className={CARD}>
      <h2>Download Section</h2>
      <input
        placeholder="File title (e.g. Prospectus 2026)"
        value={newDownloadTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        className={INPUT}
      />
      <input
        placeholder="File URL (Google Drive/PDF link)"
        value={newDownloadUrl}
        onChange={(e) => onUrlChange(e.target.value)}
        className={INPUT}
      />
      <button onClick={onAddDownload} className={PRIMARY_BUTTON}>
        Add Download Item
      </button>

      <div className={AUTO_FIT_GRID}>
        {downloads.map((item) => (
          <article className={CARD} key={`${item.index}-${item.url}`}>
            <h3>{item.title}</h3>
            <a href={item.url} target="_blank" rel="noreferrer" className={CTA_LINK}>
              Open File
            </a>
            <button className={DANGER_BUTTON} onClick={() => onRemoveDownload(item.index)}>
              Remove
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
