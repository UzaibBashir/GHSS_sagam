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

function NoticeEditor({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item.text || "");

  return (
    <article className={ADMIN_SUBCARD}>
      <label className={ADMIN_LABEL}>
        Notice text
        <input
          className={ADMIN_INPUT}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
      <button className={ADMIN_BUTTON} onClick={() => onSave(item.index, { text: draft })}>
        Update changes
      </button>
        <button className={ADMIN_BUTTON_DANGER} onClick={() => onRemove(item.index)}>
          Remove notice
        </button>
      </div>
    </article>
  );
}

export default function NoticesManager({ notices, onAdd, onSave, onRemove }) {
  const [text, setText] = useState("");

  return (
    <section className={ADMIN_SECTION} id="notices">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Quick Notices</h2>
        <p className={ADMIN_SECTION_DESC}>
          Short notices shown on the website as quick updates for students and parents.
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

      <div className="mt-4 grid gap-3">
        {notices.map((item) => (
          <NoticeEditor key={`${item.index}-${item.text}`} item={item} onSave={onSave} onRemove={onRemove} />
        ))}
      </div>
    </section>
  );
}
