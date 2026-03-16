import { useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_DANGER,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
} from "./adminStyles";

const EMPTY_FORM = { title: "", url: "" };

function DownloadEditor({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <article className={ADMIN_SUBCARD}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={ADMIN_LABEL}>
          Title
          <input
            className={ADMIN_INPUT}
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Academic calendar"
          />
        </label>
        <label className={ADMIN_LABEL}>
          URL
          <input
            className={ADMIN_INPUT}
            value={draft.url}
            onChange={(event) => setDraft((prev) => ({ ...prev, url: event.target.value }))}
            placeholder="https://..."
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className={ADMIN_BUTTON} onClick={() => onSave(item.index, draft)}>
          Save changes
        </button>
        <button className={ADMIN_BUTTON_DANGER} onClick={() => onRemove(item.index)}>
          Remove item
        </button>
      </div>
    </article>
  );
}

export default function DownloadsManager({ downloads, onAdd, onSave, onRemove }) {
  const [form, setForm] = useState(EMPTY_FORM);

  return (
    <section className={ADMIN_SECTION} id="downloads">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Downloads</h2>
        <p className={ADMIN_SECTION_DESC}>Upload links to forms, calendars, and official documents.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new download</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Title
            <input
              placeholder="Prospectus 2026"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className={ADMIN_INPUT}
            />
          </label>
          <label className={ADMIN_LABEL}>
            File URL
            <input
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              className={ADMIN_INPUT}
            />
          </label>
        </div>
        <button
          onClick={() => {
            onAdd(form);
            setForm(EMPTY_FORM);
          }}
          className={`${ADMIN_BUTTON} mt-3`}
        >
          Add download
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {downloads.map((item) => (
          <DownloadEditor key={`${item.index}-${item.url}`} item={item} onSave={onSave} onRemove={onRemove} />
        ))}
      </div>
    </section>
  );
}
