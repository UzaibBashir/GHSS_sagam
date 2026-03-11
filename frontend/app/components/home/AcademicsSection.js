"use client";

import { useMemo, useState } from "react";
import { ACADEMIC_MATERIALS } from "../../lib/siteContent";

const ACADEMIC_NOTICEBOARD = [
  { id: "an-1", time: "08:50 AM", text: "Chemistry practical files must be submitted today." },
  { id: "an-2", time: "09:30 AM", text: "Mathematics remedial class scheduled after period 6." },
  { id: "an-3", time: "10:40 AM", text: "Class XI Science worksheet uploaded to Drive folders." },
  { id: "an-4", time: "11:20 AM", text: "English assignment discussion during tutorial period." },
];

export default function AcademicsSection() {
  const classOptions = useMemo(() => ACADEMIC_MATERIALS.folders.map((item) => item.className), []);
  const [selectedClass, setSelectedClass] = useState(classOptions[0] || "");

  const selectedClassData = useMemo(
    () => ACADEMIC_MATERIALS.folders.find((item) => item.className === selectedClass),
    [selectedClass]
  );

  const streamOptions = useMemo(
    () => (selectedClassData?.streams || []).map((stream) => stream.stream),
    [selectedClassData]
  );

  const [selectedStream, setSelectedStream] = useState(streamOptions[0] || "");
  const activeStream = streamOptions.includes(selectedStream) ? selectedStream : streamOptions[0] || "";

  const selectedStreamData = useMemo(
    () => selectedClassData?.streams.find((stream) => stream.stream === activeStream),
    [selectedClassData, activeStream]
  );

  return (
    <section id="academics" className="grid gap-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h2 className="text-2xl font-extrabold text-slate-900 max-md:text-xl">Academic Filters</h2>
        <p className="mt-2 text-slate-700">Select class and stream to view relevant timetable context and study materials.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm font-semibold text-slate-700" htmlFor="class-filter">
            Class
            <select
              id="class-filter"
              value={selectedClass}
              onChange={(event) => setSelectedClass(event.target.value)}
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
          {ACADEMIC_NOTICEBOARD.map((item) => (
            <li key={item.id} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
              <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">{item.time}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h3 className="text-xl font-extrabold text-slate-900 max-md:text-lg">Timetable</h3>
        <p className="mt-2 text-sm text-slate-700">
          Daily class schedule for {selectedClass} {activeStream ? `(${activeStream})` : ""}.
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
              {ACADEMIC_MATERIALS.timetable.map((row) => (
                <tr key={row.period + row.time}>
                  <td className="border border-slate-200 px-3 py-2">{row.period}</td>
                  <td className="border border-slate-200 px-3 py-2">{row.time}</td>
                  <td className="border border-slate-200 px-3 py-2">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h3 className="text-xl font-extrabold text-slate-900 max-md:text-lg">Study Material</h3>
        <p className="mt-2 text-sm text-slate-700">Showing material for selected class and stream only.</p>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h4 className="text-base font-extrabold text-slate-900">{selectedClass}</h4>
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
          </ul>
        </div>
      </article>
    </section>
  );
}