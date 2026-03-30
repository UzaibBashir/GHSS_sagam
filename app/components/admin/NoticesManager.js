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

function NoticeRow({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item.text || "");

  return (
    <tr className="border-t border-slate-200 align-top">
      <td className="px-3 py-2 text-sm text-slate-700">{item.index + 1}</td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Notice text"
        />
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <button className={ADMIN_BUTTON} onClick={() => onSave(item.index, { text: draft })}>
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

export default function NoticesManager({ notices, onAdd, onSave, onRemove }) {
  const [text, setText] = useState("");

  return (
    <section className={ADMIN_SECTION} id="notices">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Quick Notices</h2>
        <p className={ADMIN_SECTION_DESC}>
          Keep short notice lines updated for students and parents.
        </p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <label className={ADMIN_LABEL}>
          Add new notice
          <input
            className={ADMIN_INPUT}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Admissions are open for 2026"
          />
        </label>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!text.trim()) return;
            onAdd({ text });
            setText("");
          }}
        >
          Add notice
        </button>
      </article>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] table-fixed border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 w-16">#</th>
                <th className="px-3 py-2">Notice text</th>
                <th className="px-3 py-2 w-48">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(notices || []).map((item) => (
                <NoticeRow key={`${item.index}-${item.text}`} item={item} onSave={onSave} onRemove={onRemove} />
              ))}
              {!notices?.length ? (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={3}>
                    No notices yet.
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
