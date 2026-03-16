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

const EMPTY_STUDENT = {
  rollNumber: "",
  password: "",
  name: "",
  className: "Class XI",
  stream: "Medical",
};

const CLASS_OPTIONS = ["Class XI", "Class XII"];
const STREAM_OPTIONS = ["Medical", "Non-Medical", "Arts"];

function StudentRow({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <tr className="border-t border-slate-200">
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.rollNumber}
          onChange={(event) => setDraft((prev) => ({ ...prev, rollNumber: event.target.value }))}
        />
      </td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.name}
          onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
        />
      </td>
      <td className="px-3 py-2">
        <select
          className={ADMIN_INPUT}
          value={draft.className}
          onChange={(event) => setDraft((prev) => ({ ...prev, className: event.target.value }))}
        >
          {CLASS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2">
        <select
          className={ADMIN_INPUT}
          value={draft.stream}
          onChange={(event) => setDraft((prev) => ({ ...prev, stream: event.target.value }))}
        >
          {STREAM_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </td>
      <td className="px-3 py-2">
        <input
          type="text"
          className={ADMIN_INPUT}
          value={draft.password}
          onChange={(event) => setDraft((prev) => ({ ...prev, password: event.target.value }))}
        />
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <button className={ADMIN_BUTTON} onClick={() => onSave(item.rollNumber, draft)}>
            Save
          </button>
          <button className={ADMIN_BUTTON_DANGER} onClick={() => onRemove(item.rollNumber)}>
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function StudentsManager({ students, onAdd, onSave, onRemove }) {
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);

  return (
    <section className={ADMIN_SECTION} id="students">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Student Portal Access</h2>
        <p className={ADMIN_SECTION_DESC}>
          Manage roll numbers, classes, streams, and passwords for the Academics portal.
        </p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new student login</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className={ADMIN_LABEL}>
            Roll number
            <input
              className={ADMIN_INPUT}
              value={studentForm.rollNumber}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, rollNumber: event.target.value }))}
              placeholder="Roll number"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Student name
            <input
              className={ADMIN_INPUT}
              value={studentForm.name}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Student name"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Class
            <select
              className={ADMIN_INPUT}
              value={studentForm.className}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, className: event.target.value }))}
            >
              {CLASS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className={ADMIN_LABEL}>
            Stream
            <select
              className={ADMIN_INPUT}
              value={studentForm.stream}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, stream: event.target.value }))}
            >
              {STREAM_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className={ADMIN_LABEL}>
            Password
            <input
              className={ADMIN_INPUT}
              value={studentForm.password}
              onChange={(event) => setStudentForm((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="Password"
            />
          </label>
        </div>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            onAdd(studentForm);
            setStudentForm(EMPTY_STUDENT);
          }}
        >
          Add student login
        </button>
      </article>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Roll number</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Class</th>
              <th className="px-3 py-2">Stream</th>
              <th className="px-3 py-2">Password</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(students || []).map((student) => (
              <StudentRow key={student.rollNumber} item={student} onSave={onSave} onRemove={onRemove} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
