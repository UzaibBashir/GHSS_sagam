"use client";

import { useMemo, useState } from "react";

export default function AcademicsSection({ institute }) {
  const content = useMemo(() => institute?.academic_content || {}, [institute]);
  const materials = useMemo(() => content.materials || [], [content]);
  const noticeboard = useMemo(() => content.noticeboard || [], [content]);
  const timetableRows = useMemo(() => content.timetable || [], [content]);

  const classOptions = useMemo(() => materials.map((item) => item.class_name), [materials]);
  const [selectedClass, setSelectedClass] = useState("");
  const activeClass = classOptions.includes(selectedClass) ? selectedClass : classOptions[0] || "";

  const selectedClassData = useMemo(
    () => materials.find((item) => item.class_name === activeClass) || materials[0],
    [materials, activeClass]
  );

  const streamOptions = useMemo(
    () => (selectedClassData?.streams || []).map((stream) => stream.stream),
    [selectedClassData]
  );

  const [selectedStream, setSelectedStream] = useState("");
  const activeStream = streamOptions.includes(selectedStream) ? selectedStream : streamOptions[0] || "";

  const selectedStreamData = useMemo(
    () => selectedClassData?.streams.find((stream) => stream.stream === activeStream),
    [selectedClassData, activeStream]
  );

  const filteredTimetable = useMemo(
    () => timetableRows.filter((row) => row.class_name === activeClass && row.stream === activeStream),
    [timetableRows, activeClass, activeStream]
  );

  return (
    <section id="academics" className="grid gap-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h2 className="text-2xl font-extrabold text-slate-900 max-md:text-xl">Academic Filters</h2>
        <p className="mt-2 text-slate-700">Select class and stream to view noticeboard context, timetable, and study materials.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-semibold text-slate-700" htmlFor="class-filter">
            Class
            <select
              id="class-filter"
              value={activeClass}
              onChange={(event) => {
                setSelectedClass(event.target.value);
                setSelectedStream("");
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {classOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-semibold text-slate-700" htmlFor="stream-filter">
            Stream
            <select
              id="stream-filter"
              value={activeStream}
              onChange={(event) => setSelectedStream(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {streamOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h3 className="text-xl font-extrabold text-slate-900 max-md:text-lg">Noticeboard</h3>
        <p className="mt-2 text-sm text-slate-700">Today&apos;s academic updates and reminders.</p>
        <ul className="mt-4 grid gap-2">
          {noticeboard.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
            >
              <p className="m-0 text-xs font-bold text-slate-500">{item.time}</p>
              <p className="m-0 mt-1 font-semibold text-slate-900">{item.headline}</p>
              <p className="m-0 mt-1">{item.description}</p>
            </li>
          ))}
          {!noticeboard.length ? (
            <li className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              No noticeboard entries available.
            </li>
          ) : null}
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h3 className="text-xl font-extrabold text-slate-900 max-md:text-lg">Timetable</h3>
        <p className="mt-2 text-sm text-slate-700">
          Daily class schedule for {activeClass || "-"} {activeStream ? `(${activeStream})` : ""}.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-200 px-3 py-2">Period</th>
                <th className="border border-slate-200 px-3 py-2">Time</th>
                <th className="border border-slate-200 px-3 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimetable.map((row) => (
                <tr key={row.id}>
                  <td className="border border-slate-200 px-3 py-2">{row.period}</td>
                  <td className="border border-slate-200 px-3 py-2">{row.time}</td>
                  <td className="border border-slate-200 px-3 py-2">{row.detail}</td>
                </tr>
              ))}
              {!filteredTimetable.length ? (
                <tr>
                  <td className="border border-slate-200 px-3 py-2 text-slate-500" colSpan={3}>
                    No timetable rows available for selected class and stream.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h3 className="text-xl font-extrabold text-slate-900 max-md:text-lg">Study Material</h3>
        <p className="mt-2 text-sm text-slate-700">Showing material for selected class and stream only.</p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-base font-extrabold text-slate-900">{activeClass || "Class"}</h4>
          <p className="mt-1 text-sm font-semibold text-slate-700">{activeStream}</p>
          <ul className="mt-3 grid gap-2 text-sm text-slate-700">
            {(selectedStreamData?.subjects || []).map((subject) => (
              <li key={subject.name + subject.drive} className="rounded-md border border-slate-200 bg-white px-3 py-2">
                <p className="m-0 font-semibold text-slate-900">{subject.name}</p>
                <a
                  href={subject.drive}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-sky-800 underline underline-offset-2"
                >
                  Open Google Drive Folder
                </a>
              </li>
            ))}
            {!selectedStreamData?.subjects?.length ? (
              <li className="rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-500">
                No study material links available.
              </li>
            ) : null}
          </ul>
        </div>
      </article>
    </section>
  );
}
