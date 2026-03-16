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
} from "./adminStyles";

const EMPTY_STREAM = { stream: "", subjects: [] };

function SubjectsEditor({ item, onChange, onRemove }) {
  return (
    <article className={ADMIN_SUBCARD}>
      <label className={ADMIN_LABEL}>
        Stream name
        <input
          className={ADMIN_INPUT}
          value={item.stream}
          onChange={(event) => onChange({ ...item, stream: event.target.value })}
          placeholder="Medical"
        />
      </label>
      <label className={`${ADMIN_LABEL} mt-3`}>
        Subjects (comma-separated)
        <input
          className={ADMIN_INPUT}
          value={(item.subjects || []).join(", ")}
          onChange={(event) =>
            onChange({
              ...item,
              subjects: event.target.value
                .split(",")
                .map((entry) => entry.trim())
                .filter(Boolean),
            })
          }
          placeholder="Biology, Chemistry, English"
        />
      </label>
      <button className={`${ADMIN_BUTTON_DANGER} mt-3`} onClick={onRemove}>
        Remove stream
      </button>
    </article>
  );
}

export default function StreamsSubjectsManager({ streams, onSave }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_STREAM);

  useEffect(() => {
    setItems(streams || []);
  }, [streams]);

  return (
    <section className={ADMIN_SECTION} id="streams">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Streams & Subjects</h2>
        <p className={ADMIN_SECTION_DESC}>Define each stream and the subjects offered in that stream.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new stream</h3>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Stream name
          <input
            className={ADMIN_INPUT}
            value={form.stream}
            onChange={(event) => setForm((prev) => ({ ...prev, stream: event.target.value }))}
            placeholder="Medical"
          />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Subjects (comma-separated)
          <input
            className={ADMIN_INPUT}
            value={form.subjects.join(", ")}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                subjects: event.target.value
                  .split(",")
                  .map((entry) => entry.trim())
                  .filter(Boolean),
              }))
            }
            placeholder="Biology, Chemistry, English"
          />
        </label>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!form.stream.trim() || !form.subjects.length) return;
            setItems((prev) => [{ ...form }, ...prev]);
            setForm(EMPTY_STREAM);
          }}
        >
          Add stream
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <SubjectsEditor
            key={`${item.stream}-${index}`}
            item={item}
            onChange={(updated) => setItems((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))}
            onRemove={() => setItems((prev) => prev.filter((_, idx) => idx !== index))}
          />
        ))}
      </div>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(items)}>
        Save streams
      </button>
    </section>
  );
}
