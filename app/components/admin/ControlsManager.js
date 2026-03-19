import { useEffect, useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
} from "./adminStyles";

const DEFAULT_CONTROLS = {
  about_page_enabled: true,
  notifications_page_enabled: true,
  academics_page_enabled: true,
  admission_page_enabled: true,
  admission_apply_page_enabled: true,
  admission_status_page_enabled: true,
  contact_page_enabled: true,
  admission_open: true,
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
            <span>Show about page</span>
            <input
              type="checkbox"
              checked={draft.about_page_enabled}
              onChange={(event) => setDraft((prev) => ({ ...prev, about_page_enabled: event.target.checked }))}
              className="h-4 w-4"
            />
          </label>
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
            <span>Show admission page</span>
            <input
              type="checkbox"
              checked={draft.admission_page_enabled}
              onChange={(event) => setDraft((prev) => ({ ...prev, admission_page_enabled: event.target.checked }))}
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
            <span>Show admission apply page</span>
            <input
              type="checkbox"
              checked={draft.admission_apply_page_enabled}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, admission_apply_page_enabled: event.target.checked }))
              }
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
            <span>Show admission status page</span>
            <input
              type="checkbox"
              checked={draft.admission_status_page_enabled}
              onChange={(event) =>
                setDraft((prev) => ({ ...prev, admission_status_page_enabled: event.target.checked }))
              }
              className="h-4 w-4"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
            <span>Show contact page</span>
            <input
              type="checkbox"
              checked={draft.contact_page_enabled}
              onChange={(event) => setDraft((prev) => ({ ...prev, contact_page_enabled: event.target.checked }))}
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
      </article>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(draft)}>
        Save site controls
      </button>
    </section>
  );
}

