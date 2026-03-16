import { useEffect, useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
} from "./adminStyles";

const DEFAULT_CONTROLS = {
  notifications_page_enabled: true,
  academics_page_enabled: true,
  admission_open: true,
  admission_form_url: "",
};

export default function ControlsManager({ controls, onSave }) {
  const [draft, setDraft] = useState(DEFAULT_CONTROLS);

  useEffect(() => {
    setDraft({ ...DEFAULT_CONTROLS, ...(controls || {}) });
  }, [controls]);

  return (
    <section className={ADMIN_SECTION} id="controls">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Site Controls</h2>
        <p className={ADMIN_SECTION_DESC}>Turn pages on or off and manage admissions availability.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <div className="grid gap-3">
          <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
            <span>Show notifications page</span>
            <input
              type="checkbox"
              checked={draft.notifications_page_enabled}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, notifications_page_enabled: event.target.checked }))
              }
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
            <span>Show academics page</span>
            <input
              type="checkbox"
              checked={draft.academics_page_enabled}
              onChange={(event) => setDraft((prev) => ({ ...prev, academics_page_enabled: event.target.checked }))}
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
            <span>Admissions open</span>
            <input
              type="checkbox"
              checked={draft.admission_open}
              onChange={(event) => setDraft((prev) => ({ ...prev, admission_open: event.target.checked }))}
              className="h-4 w-4"
            />
          </label>
        </div>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Admission form URL
          <input
            className={ADMIN_INPUT}
            value={draft.admission_form_url}
            onChange={(event) => setDraft((prev) => ({ ...prev, admission_form_url: event.target.value }))}
            placeholder="https://..."
          />
        </label>
      </article>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(draft)}>
        Save site controls
      </button>
    </section>
  );
}
