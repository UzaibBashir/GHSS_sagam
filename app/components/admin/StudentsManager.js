import { useState } from "react";
import { CARD, DANGER_BUTTON, INPUT, PRIMARY_BUTTON } from "../../lib/uiClasses";

const EMPTY_STUDENT = {
  rollNumber: "",
  password: "",
  name: "",
  className: "Class XI",
  stream: "Medical",
};

const CLASS_OPTIONS = ["Class XI", "Class XII"];
const STREAM_OPTIONS = ["Medical", "Non-Medical", "Arts"];

function StudentEditor({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <article className="grid gap-3 rounded-[1.4rem] border border-slate-200/80 bg-white/86 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)] max-sm:p-3">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <input
          className={INPUT}
          value={draft.rollNumber}
          onChange={(event) => setDraft((prev) => ({ ...prev, rollNumber: event.target.value }))}
          placeholder="Roll Number"
        />
        <input
          className={INPUT}
          value={draft.name}
          onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="Student Name"
        />
        <select
          className={INPUT}
          value={draft.className}
          onChange={(event) => setDraft((prev) => ({ ...prev, className: event.target.value }))}
        >
          {CLASS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          className={INPUT}
          value={draft.stream}
          onChange={(event) => setDraft((prev) => ({ ...prev, stream: event.target.value }))}
        >
          {STREAM_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="text"
          className={INPUT}
          value={draft.password}
          onChange={(event) => setDraft((prev) => ({ ...prev, password: event.target.value }))}
          placeholder="Password"
        />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <button className={`${PRIMARY_BUTTON} w-full justify-center sm:w-fit`} onClick={() => onSave(item.rollNumber, draft)}>
          Save Student
        </button>
        <button className={`${DANGER_BUTTON} w-full justify-center sm:w-fit`} onClick={() => onRemove(item.rollNumber)}>
          Delete Student
        </button>
      </div>
    </article>
  );
}

export default function StudentsManager({ students, onAdd, onSave, onRemove }) {
  const [studentForm, setStudentForm] = useState(EMPTY_STUDENT);

  return (
    <section className={CARD}>
      <div className="grid gap-2">
        <h2 className="m-0 text-2xl font-bold text-slate-950 max-sm:text-xl">Student Password Manager</h2>
        <p className="m-0 text-sm leading-6 text-slate-600">
          Manage roll numbers, class, stream, and passwords for student login on the Academics page.
        </p>
      </div>

      <article className="grid gap-3 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/85 p-4 max-sm:p-3">
        <h3 className="m-0 text-base font-bold text-slate-900">Add Student Login</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <input
            className={INPUT}
            value={studentForm.rollNumber}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, rollNumber: event.target.value }))}
            placeholder="Roll Number"
          />
          <input
            className={INPUT}
            value={studentForm.name}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Student Name"
          />
          <select
            className={INPUT}
            value={studentForm.className}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, className: event.target.value }))}
          >
            {CLASS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            className={INPUT}
            value={studentForm.stream}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, stream: event.target.value }))}
          >
            {STREAM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            className={INPUT}
            value={studentForm.password}
            onChange={(event) => setStudentForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
          />
        </div>
        <button
          className={`${PRIMARY_BUTTON} w-full justify-center sm:w-fit`}
          onClick={() => {
            onAdd(studentForm);
            setStudentForm(EMPTY_STUDENT);
          }}
        >
          Add Student Login
        </button>
      </article>

      <div className="grid gap-3">
        {(students || []).map((student) => (
          <StudentEditor key={student.rollNumber} item={student} onSave={onSave} onRemove={onRemove} />
        ))}
      </div>
    </section>
  );
}
