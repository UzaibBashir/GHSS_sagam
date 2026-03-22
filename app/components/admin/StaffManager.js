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

const EMPTY_STAFF = { name: "", role: "" };

function StaffEditor({ item, onChange, onRemove }) {
  return (
    <article className={ADMIN_SUBCARD}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={ADMIN_LABEL}>
          Name
          <input
            className={ADMIN_INPUT}
            value={item.name}
            onChange={(event) => onChange({ ...item, name: event.target.value })}
          />
        </label>
        <label className={ADMIN_LABEL}>
          Role
          <input
            className={ADMIN_INPUT}
            value={item.role}
            onChange={(event) => onChange({ ...item, role: event.target.value })}
          />
        </label>
      </div>
      <button className={`${ADMIN_BUTTON_DANGER} mt-3`} onClick={onRemove}>
        Remove staff
      </button>
    </article>
  );
}

export default function StaffManager({ staff, onSave }) {
  const [items, setItems] = useState(() => staff || []);
  const [form, setForm] = useState(EMPTY_STAFF);

  return (
    <section className={ADMIN_SECTION} id="staff">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Leadership & Staff</h2>
        <p className={ADMIN_SECTION_DESC}>Add or update key staff roles shown on the About page.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new staff member</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Name
            <input
              className={ADMIN_INPUT}
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label className={ADMIN_LABEL}>
            Role
            <input
              className={ADMIN_INPUT}
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            />
          </label>
        </div>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!form.name.trim() || !form.role.trim()) return;
            setItems((prev) => [{ ...form }, ...prev]);
            setForm(EMPTY_STAFF);
          }}
        >
          Add staff
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <StaffEditor
            key={`${item.name}-${index}`}
            item={item}
            onChange={(updated) => setItems((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))}
            onRemove={() => setItems((prev) => prev.filter((_, idx) => idx !== index))}
          />
        ))}
      </div>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(items)}>
        Save staff list
      </button>
    </section>
  );
}
