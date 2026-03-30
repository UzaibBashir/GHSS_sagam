import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_DANGER,
  ADMIN_INPUT,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
} from "./adminStyles";

const EMPTY_ROW = { class_name: "", stream: "", subject: "", drive: "" };

function flattenMaterials(materials) {
  if (!Array.isArray(materials)) return [];
  const rows = [];
  for (const classItem of materials) {
    for (const streamItem of classItem.streams || []) {
      for (const subject of streamItem.subjects || []) {
        rows.push({
          class_name: classItem.class_name || "",
          stream: streamItem.stream || "",
          subject: subject.name || "",
          drive: subject.drive || "",
        });
      }
    }
  }
  return rows.length ? rows : [EMPTY_ROW];
}

function buildMaterials(rows) {
  const classes = new Map();

  rows
    .filter((row) => row.class_name && row.stream && row.subject && row.drive)
    .forEach((row) => {
      if (!classes.has(row.class_name)) {
        classes.set(row.class_name, new Map());
      }
      const streams = classes.get(row.class_name);
      if (!streams.has(row.stream)) {
        streams.set(row.stream, []);
      }
      streams.get(row.stream).push({ name: row.subject, drive: row.drive });
    });

  return Array.from(classes.entries()).map(([class_name, streams]) => ({
    class_name,
    streams: Array.from(streams.entries()).map(([stream, subjects]) => ({ stream, subjects })),
  }));
}

export default function MaterialsManager({ materials, onSave }) {
  const [rows, setRows] = useState([EMPTY_ROW]);

  useEffect(() => {
    setRows(flattenMaterials(materials));
  }, [materials]);

  const hasRows = useMemo(() => rows.length > 0, [rows]);

  return (
    <section className={ADMIN_SECTION} id="materials">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Study Materials</h2>
        <p className={ADMIN_SECTION_DESC}>
          Add class, stream, subject, and Drive link entries. Students see these under Academics.
        </p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add material row</h3>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => setRows((prev) => [...prev, { ...EMPTY_ROW }])}
        >
          Add row
        </button>
      </article>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse text-xs sm:text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Class</th>
              <th className="px-3 py-2">Stream</th>
              <th className="px-3 py-2">Subject</th>
              <th className="px-3 py-2">Drive link</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hasRows ? (
              rows.map((row, index) => (
                <tr key={`${row.class_name}-${row.subject}-${index}`} className="border-t border-slate-200">
                  <td className="px-3 py-2">
                    <input
                      className={ADMIN_INPUT}
                      value={row.class_name}
                      onChange={(event) =>
                        setRows((prev) =>
                          prev.map((entry, idx) =>
                            idx === index ? { ...entry, class_name: event.target.value } : entry
                          )
                        )
                      }
                      placeholder="Class XI"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className={ADMIN_INPUT}
                      value={row.stream}
                      onChange={(event) =>
                        setRows((prev) =>
                          prev.map((entry, idx) => (idx === index ? { ...entry, stream: event.target.value } : entry))
                        )
                      }
                      placeholder="Medical"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className={ADMIN_INPUT}
                      value={row.subject}
                      onChange={(event) =>
                        setRows((prev) =>
                          prev.map((entry, idx) => (idx === index ? { ...entry, subject: event.target.value } : entry))
                        )
                      }
                      placeholder="Biology"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className={ADMIN_INPUT}
                      value={row.drive}
                      onChange={(event) =>
                        setRows((prev) =>
                          prev.map((entry, idx) => (idx === index ? { ...entry, drive: event.target.value } : entry))
                        )
                      }
                      placeholder="https://drive.google.com/..."
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      className={ADMIN_BUTTON_DANGER}
                      onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== index))}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-4 text-slate-600" colSpan={5}>
                  No study material rows yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(buildMaterials(rows))}>
        Confirm changes
      </button>
    </section>
  );
}

