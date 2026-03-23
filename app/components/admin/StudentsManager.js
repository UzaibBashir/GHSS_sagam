import { useMemo, useState } from "react";
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
const PAGE_SIZE = 10;

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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return students || [];
    return (students || []).filter((item) =>
      [item.rollNumber, item.name, item.className, item.stream]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <label className={ADMIN_LABEL}>
          Search students
          <input
            className={ADMIN_INPUT}
            placeholder="Search by roll number, name, class, or stream"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </label>
      </article>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-180 table-fixed border-collapse text-xs sm:text-sm">
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
            {pageItems.map((student) => (
              <StudentRow key={student.rollNumber} item={student} onSave={onSave} onRemove={onRemove} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <p>
          Showing {(pageItems.length && (safePage - 1) * PAGE_SIZE + 1) || 0}-{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={ADMIN_BUTTON}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage <= 1}
          >
            Previous
          </button>
          <span>Page {safePage} / {totalPages}</span>
          <button
            type="button"
            className={ADMIN_BUTTON}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

