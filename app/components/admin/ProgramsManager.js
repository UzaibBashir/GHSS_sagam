import { useEffect, useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_DANGER,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
  ADMIN_TEXTAREA,
} from "./adminStyles";

const EMPTY_PROGRAM = { title: "", description: "" };

function ProgramEditor({ item, onChange, onRemove }) {
  return (
    <article className={ADMIN_SUBCARD}>
      <label className={ADMIN_LABEL}>
        Program title
        <input
          className={ADMIN_INPUT}
          value={item.title}
          onChange={(event) => onChange({ ...item, title: event.target.value })}
        />
      </label>
      <label className={`${ADMIN_LABEL} mt-3`}>
        Description
        <textarea
          rows={3}
          className={ADMIN_TEXTAREA}
          value={item.description}
          onChange={(event) => onChange({ ...item, description: event.target.value })}
        />
      </label>
      <button className={`${ADMIN_BUTTON_DANGER} mt-3`} onClick={onRemove}>
        Remove program
      </button>
    </article>
  );
}

export default function ProgramsManager({ programs, onSave }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_PROGRAM);

  useEffect(() => {
    setItems(programs || []);
  }, [programs]);

  return (
    <section className={ADMIN_SECTION} id="programs">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Academic Programs</h2>
        <p className={ADMIN_SECTION_DESC}>Manage the streams or programs listed on the homepage.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new program</h3>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Program title
          <input
            className={ADMIN_INPUT}
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Description
          <textarea
            rows={3}
            className={ADMIN_TEXTAREA}
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </label>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!form.title.trim() || !form.description.trim()) return;
            setItems((prev) => [{ ...form }, ...prev]);
            setForm(EMPTY_PROGRAM);
          }}
        >
          Add program
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <ProgramEditor
            key={`${item.title}-${index}`}
            item={item}
            onChange={(updated) => setItems((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))}
            onRemove={() => setItems((prev) => prev.filter((_, idx) => idx !== index))}
          />
        ))}
      </div>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(items)}>
        Save programs
      </button>
    </section>
  );
}
