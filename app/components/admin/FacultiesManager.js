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
  designation: "",
  qualification: "",
  photo: "",
};

const EMPTY_STAFF = {
  name: "",
  role: "",
};

const EMPTY_PRINCIPAL = {
  name: "",
  role: "Principal",
  message: "",
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
          Designation
          <input
            className={ADMIN_INPUT}
            value={item.designation}
            onChange={(event) => onChange({ ...item, designation: event.target.value })}
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

export default function FacultiesManager({
  faculties,
  onSave,
  staff,
  onSaveStaff,
  principal,
  onSavePrincipal,
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FACULTY);
  const [staffItems, setStaffItems] = useState([]);
  const [staffForm, setStaffForm] = useState(EMPTY_STAFF);
  const [principalForm, setPrincipalForm] = useState(EMPTY_PRINCIPAL);

  useEffect(() => {
    setItems(faculties || []);
  }, [faculties]);

  useEffect(() => {
    setStaffItems(staff || []);
  }, [staff]);

  useEffect(() => {
    setPrincipalForm({ ...EMPTY_PRINCIPAL, ...(principal || {}) });
  }, [principal]);

  const saveAll = async () => {
    if (typeof onSave === "function") {
      await onSave(items);
    }
    if (typeof onSaveStaff === "function") {
      await onSaveStaff(staffItems);
    }
    if (typeof onSavePrincipal === "function") {
      await onSavePrincipal(principalForm);
    }
  };

  return (
    <section className={ADMIN_SECTION} id="faculty">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Faculty & Staff Directory</h2>
        <p className={ADMIN_SECTION_DESC}>Update principal details, faculty designations, qualifications, photos, and staff roles in one place.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Principal details</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Name
            <input
              className={ADMIN_INPUT}
              value={principalForm.name}
              onChange={(event) => setPrincipalForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label className={ADMIN_LABEL}>
            Role
            <input
              className={ADMIN_INPUT}
              value={principalForm.role}
              onChange={(event) => setPrincipalForm((prev) => ({ ...prev, role: event.target.value }))}
            />
          </label>
        </div>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Message
          <textarea
            className={`${ADMIN_INPUT} min-h-24`}
            value={principalForm.message}
            onChange={(event) => setPrincipalForm((prev) => ({ ...prev, message: event.target.value }))}
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
              setPrincipalForm((prev) => ({ ...prev, photo: dataUrl }));
            }}
          />
        </label>
        {principalForm.photo ? (
          <img src={principalForm.photo} alt={principalForm.name || "Principal"} className="mt-3 h-20 w-20 rounded-lg object-cover border border-slate-200" />
        ) : null}
      </article>

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
            Designation
            <input
              className={ADMIN_INPUT}
              value={form.designation}
              onChange={(event) => setForm((prev) => ({ ...prev, designation: event.target.value }))}
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
            key={`${item.name}-${item.designation}-${index}`}
            item={item}
            onChange={(updated) => setItems((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))}
            onRemove={() => setItems((prev) => prev.filter((_, idx) => idx !== index))}
          />
        ))}
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new staff member</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Name
            <input
              className={ADMIN_INPUT}
              value={staffForm.name}
              onChange={(event) => setStaffForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label className={ADMIN_LABEL}>
            Role
            <input
              className={ADMIN_INPUT}
              value={staffForm.role}
              onChange={(event) => setStaffForm((prev) => ({ ...prev, role: event.target.value }))}
            />
          </label>
        </div>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!staffForm.name.trim() || !staffForm.role.trim()) return;
            setStaffItems((prev) => [{ ...staffForm }, ...prev]);
            setStaffForm(EMPTY_STAFF);
          }}
        >
          Add staff
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {staffItems.map((item, index) => (
          <StaffEditor
            key={`${item.name}-${index}`}
            item={item}
            onChange={(updated) => setStaffItems((prev) => prev.map((entry, idx) => (idx === index ? updated : entry)))}
            onRemove={() => setStaffItems((prev) => prev.filter((_, idx) => idx !== index))}
          />
        ))}
      </div>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={saveAll}>
        Save faculty & staff
      </button>
    </section>
  );
}

