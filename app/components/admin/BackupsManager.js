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

export default function BackupsManager({ backups, onCreate, onRestore, onDelete, loading }) {
  const [label, setLabel] = useState("");

  return (
    <section className={ADMIN_SECTION} id="backups">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Backup and Restore</h2>
        <p className={ADMIN_SECTION_DESC}>Create versioned snapshots and restore full app state in one click.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <label className={ADMIN_LABEL}>
          Snapshot label
          <input
            className={ADMIN_INPUT}
            placeholder="Before annual admission update"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </label>
        <button
          type="button"
          className={`${ADMIN_BUTTON} mt-3`}
          disabled={loading}
          onClick={() => {
            onCreate(label);
            setLabel("");
          }}
        >
          {loading ? "Working..." : "Create snapshot"}
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {(backups || []).map((item) => (
          <article key={item.id} className={ADMIN_SUBCARD}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.label || "Snapshot"}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()} | {item.version}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Admissions: {item.admissions || 0}, Students: {item.students || 0}, Contacts: {item.contacts || 0}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={ADMIN_BUTTON}
                  disabled={loading}
                  onClick={() => onRestore(item.id)}
                >
                  Restore
                </button>
                <button
                  type="button"
                  className={ADMIN_BUTTON_DANGER}
                  disabled={loading}
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}

        {!backups?.length ? <article className={ADMIN_SUBCARD}>No snapshots created yet.</article> : null}
      </div>
    </section>
  );
}
