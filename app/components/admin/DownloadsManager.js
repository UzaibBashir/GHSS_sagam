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

function DownloadRow({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <tr className="border-t border-slate-200 align-top">
      <td className="px-3 py-2 text-sm text-slate-700">{item.index + 1}</td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.title}
          onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
          placeholder="Prospectus 2026"
        />
      </td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.url}
          onChange={(event) => setDraft((prev) => ({ ...prev, url: event.target.value }))}
          placeholder="https://..."
        />
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <button className={ADMIN_BUTTON} onClick={() => onSave(item.index, draft)}>
            Update
          </button>
          <button className={ADMIN_BUTTON_DANGER} onClick={() => onRemove(item.index)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function DownloadsManager({ downloads, onAdd, onSave, onRemove }) {
  const [form, setForm] = useState(EMPTY_FORM);

  return (
    <section className={ADMIN_SECTION} id="downloads">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Downloads</h2>
        <p className={ADMIN_SECTION_DESC}>Maintain downloadable links in a simple table.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new download</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Title
            <input
              className={ADMIN_INPUT}
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Prospectus 2026"
            />
          </label>
          <label className={ADMIN_LABEL}>
            File URL
            <input
              className={ADMIN_INPUT}
              value={form.url}
              onChange={(event) => setForm((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="https://..."
            />
          </label>
        </div>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!form.title.trim() || !form.url.trim()) return;
            onAdd(form);
            setForm(EMPTY_FORM);
          }}
        >
          Add download
        </button>
      </article>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 w-16">#</th>
                <th className="px-3 py-2 w-56">Title</th>
                <th className="px-3 py-2">URL</th>
                <th className="px-3 py-2 w-48">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(downloads || []).map((item) => (
                <DownloadRow key={`${item.index}-${item.url}`} item={item} onSave={onSave} onRemove={onRemove} />
              ))}
              {!downloads?.length ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={4}>
                    No download entries yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
