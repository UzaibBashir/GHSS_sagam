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
  ADMIN_TEXTAREA,
} from "./adminStyles";

const EMPTY_STREAM = { stream: "", subjects: [] };
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

export default function StreamsSubjectsManager({ streams, onSave, programs, onSavePrograms }) {
  const [items, setItems] = useState(() => streams || []);
  const [form, setForm] = useState(EMPTY_STREAM);
  const [programItems, setProgramItems] = useState(() => programs || []);
  const [programForm, setProgramForm] = useState(EMPTY_PROGRAM);

  const saveAll = async () => {
    if (typeof onSavePrograms === "function") {
      await onSavePrograms(programItems);
    }
    if (typeof onSave === "function") {
      await onSave(items);
    }
  };

  return (
    <section className={ADMIN_SECTION} id="streams">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Programs, Streams & Subjects</h2>
        <p className={ADMIN_SECTION_DESC}>Manage programs and define each stream with its subjects from one place.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new program</h3>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Program title
          <input
            className={ADMIN_INPUT}
            value={programForm.title}
            onChange={(event) => setProgramForm((prev) => ({ ...prev, title: event.target.value }))}
          />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Description
          <textarea
            rows={3}
            className={ADMIN_TEXTAREA}
            value={programForm.description}
            onChange={(event) => setProgramForm((prev) => ({ ...prev, description: event.target.value }))}
          />
        </label>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!programForm.title.trim() || !programForm.description.trim()) return;
            setProgramItems((prev) => [{ ...programForm }, ...prev]);
            setProgramForm(EMPTY_PROGRAM);
          }}
        >
          Add program
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {programItems.map((item, index) => (
          <ProgramEditor
            key={`${item.title}-${index}`}
            item={item}
            onChange={(updated) =>
              setProgramItems((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))
            }
            onRemove={() => setProgramItems((prev) => prev.filter((_, idx) => idx !== index))}
          />
        ))}
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

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={saveAll}>
        Confirm changes
      </button>
    </section>
  );
}


