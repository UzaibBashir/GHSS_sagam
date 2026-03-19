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

const EMPTY_FACULTY = {
  name: "",
  department: "",
  qualification: "",
  photo: "",
};

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
}

function FacultyEditor({ item, onChange, onRemove }) {
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
          Department
          <input
            className={ADMIN_INPUT}
            value={item.department}
            onChange={(event) => onChange({ ...item, department: event.target.value })}
          />
        </label>
      </div>
      <label className={`${ADMIN_LABEL} mt-3`}>
        Qualification
        <input
          className={ADMIN_INPUT}
          value={item.qualification}
          onChange={(event) => onChange({ ...item, qualification: event.target.value })}
        />
      </label>
      <label className={`${ADMIN_LABEL} mt-3`}>
        Photo URL or data
        <input
          className={ADMIN_INPUT}
          value={item.photo}
          onChange={(event) => onChange({ ...item, photo: event.target.value })}
          placeholder="https://.../faculty-photo.jpg"
        />
      </label>
      <label className={`${ADMIN_LABEL} mt-3`}>
        Upload photo
        <input
          type="file"
          accept="image/*"
          className={ADMIN_INPUT}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const dataUrl = await fileToDataUrl(file);
            onChange({ ...item, photo: dataUrl });
          }}
        />
      </label>
      {item.photo ? (
        <img src={item.photo} alt={item.name || "Faculty"} className="mt-3 h-20 w-20 rounded-lg object-cover border border-slate-200" />
      ) : null}
      <button className={`${ADMIN_BUTTON_DANGER} mt-3`} onClick={onRemove}>
        Remove faculty
      </button>
    </article>
  );
}

export default function FacultiesManager({ faculties, onSave }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FACULTY);

  useEffect(() => {
    setItems(faculties || []);
  }, [faculties]);

  return (
    <section className={ADMIN_SECTION} id="faculty">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Faculty Directory</h2>
        <p className={ADMIN_SECTION_DESC}>Update faculty names, qualifications, and profile photos.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new faculty member</h3>
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
            Department
            <input
              className={ADMIN_INPUT}
              value={form.department}
              onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
            />
          </label>
        </div>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Qualification
          <input
            className={ADMIN_INPUT}
            value={form.qualification}
            onChange={(event) => setForm((prev) => ({ ...prev, qualification: event.target.value }))}
          />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Photo URL or data
          <input
            className={ADMIN_INPUT}
            value={form.photo}
            onChange={(event) => setForm((prev) => ({ ...prev, photo: event.target.value }))}
            placeholder="https://.../faculty-photo.jpg"
          />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Upload photo
          <input
            type="file"
            accept="image/*"
            className={ADMIN_INPUT}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const dataUrl = await fileToDataUrl(file);
              setForm((prev) => ({ ...prev, photo: dataUrl }));
            }}
          />
        </label>
        {form.photo ? (
          <img src={form.photo} alt={form.name || "Faculty"} className="mt-3 h-20 w-20 rounded-lg object-cover border border-slate-200" />
        ) : null}
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!form.name.trim()) return;
            setItems((prev) => [{ ...form }, ...prev]);
            setForm(EMPTY_FACULTY);
          }}
        >
          Add faculty
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <FacultyEditor
            key={`${item.name}-${index}`}
            item={item}
            onChange={(updated) => setItems((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))}
            onRemove={() => setItems((prev) => prev.filter((_, idx) => idx !== index))}
          />
        ))}
      </div>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(items)}>
        Save faculty list
      </button>
    </section>
  );
}

