"use client";

import { useMemo, useState } from "react";

function EmptyState({ message }) {
  return (
    <div className="rounded-[1.3rem] border border-dashed border-slate-300/80 bg-white/72 px-4 py-4 text-sm text-slate-500">
      {message}
    </div>
  );
}

export default function AcademicsSection({ institute, studentContext = null }) {
  const content = useMemo(() => institute?.academic_content || {}, [institute]);
  const materials = useMemo(() => content.materials || [], [content]);
  const noticeboard = useMemo(() => content.noticeboard || [], [content]);
  const timetableRows = useMemo(() => content.timetable || [], [content]);
  const lockedClass = studentContext?.className || "";
  const lockedStream = studentContext?.stream || "";

  const classOptions = useMemo(() => materials.map((item) => item.class_name), [materials]);
  const [selectedClass, setSelectedClass] = useState(lockedClass);
  const activeClass = lockedClass || (classOptions.includes(selectedClass) ? selectedClass : classOptions[0] || "");

  const selectedClassData = useMemo(
    () => materials.find((item) => item.class_name === activeClass) || materials[0],
    [materials, activeClass]
  );

  const streamOptions = useMemo(
    () => (selectedClassData?.streams || []).map((stream) => stream.stream),
    [selectedClassData]
  );

  const [selectedStream, setSelectedStream] = useState(lockedStream);
  const activeStream =
    lockedStream || (streamOptions.includes(selectedStream) ? selectedStream : streamOptions[0] || "");

  const filteredNoticeboard = useMemo(
    () => noticeboard.filter((item) => item.class_name === activeClass && item.stream === activeStream),
    [noticeboard, activeClass, activeStream]
  );

  const selectedStreamData = useMemo(
    () => selectedClassData?.streams.find((stream) => stream.stream === activeStream),
    [selectedClassData, activeStream]
  );

  const filteredTimetable = useMemo(
    () => timetableRows.filter((row) => row.class_name === activeClass && row.stream === activeStream),
    [timetableRows, activeClass, activeStream]
  );

  const streamSummary = {
    Medical: "Focused preparation in Biology, Chemistry, and science-based higher studies.",
    "Non-Medical": "A strong mathematics and physical sciences pathway for technical and analytical futures.",
    Arts: "A humanities-centered route building awareness, expression, and academic maturity.",
  };

  return (
    <section id="academics" className="grid gap-6">
      <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="section-kicker">Academic Filters</p>
            <h2 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">
              Explore class-wise and stream-wise academic support
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {studentContext
                ? "Your academic dashboard is opened according to the class and stream selected at login."
                : "Select a class and stream to view the matching noticeboard, timetable, and learning materials prepared for students."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-slate-700" htmlFor="class-filter">
              Class
              <select
                id="class-filter"
                value={activeClass}
                disabled={Boolean(lockedClass)}
                onChange={(event) => {
                  setSelectedClass(event.target.value);
                  setSelectedStream("");
                }}
                className="rounded-2xl border border-slate-300/80 bg-white/88 px-4 py-3 text-sm shadow-[0_10px_18px_rgba(15,23,42,0.04)] outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {classOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-semibold text-slate-700" htmlFor="stream-filter">
              Stream
              <select
                id="stream-filter"
                value={activeStream}
                disabled={Boolean(lockedStream)}
                onChange={(event) => setSelectedStream(event.target.value)}
                className="rounded-2xl border border-slate-300/80 bg-white/88 px-4 py-3 text-sm shadow-[0_10px_18px_rgba(15,23,42,0.04)] outline-none disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {streamOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <article className="rounded-[1.5rem] border border-slate-200/80 bg-white/82 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
            <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Active Class</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{activeClass || "Not Available"}</p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200/80 bg-slate-950 p-4 text-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
            <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-amber-300 uppercase">Selected Stream</p>
            <p className="mt-2 text-lg font-bold">{activeStream || "Not Available"}</p>
          </article>
          <article className="rounded-[1.5rem] border border-slate-200/80 bg-white/82 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
            <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Stream Focus</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{streamSummary[activeStream] || "Academic details will appear here once available."}</p>
          </article>
        </div>
      </article>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_50px_rgba(15,23,42,0.14)] max-md:p-4">
          <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-amber-300 uppercase">Noticeboard</p>
          <h3 className="font-display mt-3 text-2xl font-semibold">Today&apos;s academic reminders</h3>
          <div className="mt-5 grid gap-3">
            {filteredNoticeboard.length ? (
              filteredNoticeboard.map((item) => (
                <article key={item.id} className="rounded-[1.3rem] border border-white/12 bg-white/8 p-4">
                  <p className="text-xs font-bold tracking-[0.14em] text-amber-200 uppercase">{item.time}</p>
                  <p className="mt-2 text-base font-bold text-white">{item.headline}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item.description}</p>
                </article>
              ))
            ) : (
              <EmptyState message="No noticeboard entries available." />
            )}
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
          <p className="section-kicker">Timetable</p>
          <h3 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">Daily schedule</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Daily class schedule for {activeClass || "-"} {activeStream ? `(${activeStream})` : ""}.
          </p>
          <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white/86 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTimetable.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50/80"}>
                    <td className="border-t border-slate-200/80 px-4 py-3 font-semibold text-slate-900">{row.period}</td>
                    <td className="border-t border-slate-200/80 px-4 py-3 text-slate-700">{row.time}</td>
                    <td className="border-t border-slate-200/80 px-4 py-3 text-slate-700">{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredTimetable.length ? (
              <div className="p-4">
                <EmptyState message="No timetable rows available for the selected class and stream." />
              </div>
            ) : null}
          </div>
        </article>
      </div>

      <article className="glass-panel rounded-[2rem] border border-white/75 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-kicker">Study Material</p>
            <h3 className="font-display mt-4 text-3xl font-semibold text-slate-950 max-md:text-2xl">Learning resources by stream</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Showing material for the selected class and stream to keep students focused on the right academic resources.
            </p>
          </div>
          <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold tracking-[0.14em] text-white uppercase">
            {activeClass || "Class"} | {activeStream || "Stream"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(selectedStreamData?.subjects || []).map((subject) => (
            <article
              key={subject.name + (subject.drive || "")}
              className="rounded-[1.4rem] border border-slate-200/80 bg-white/86 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
            >
              <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Subject Resource</p>
              <h4 className="mt-3 text-lg font-bold text-slate-900">{subject.name}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">Access classroom folders, notes, and learning support prepared for this subject.</p>
              {subject.drive ? <a
                href={subject.drive}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-full bg-linear-to-r from-amber-400 to-yellow-500 px-4 py-2 text-sm font-bold text-slate-950 shadow-[0_14px_24px_rgba(212,166,70,0.22)] transition hover:-translate-y-0.5"
              >
                Open Drive Folder
              </a> : null}
              {(subject.resources || []).length ? <div className="mt-4 space-y-2">
                {(subject.resources || []).map((resource) => <div key={resource.id || `${subject.name}-${resource.title}`} className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{resource.type || "file"}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{resource.title || "Untitled resource"}</p>
                  {resource.type === "text" ? <p className="mt-1 text-sm text-slate-600">{resource.text_content || ""}</p> : null}
                  {(resource.type === "link" && resource.link_url) ? <a href={resource.link_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">Open Link</a> : null}
                  {(resource.type !== "text" && resource.type !== "link" && resource.attachment) ? <a href={resource.attachment} target="_blank" rel="noreferrer" className="mt-2 inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">Open File</a> : null}
                </div>)}
              </div> : null}
            </article>
          ))}
        </div>

        {!selectedStreamData?.subjects?.length ? (
          <EmptyState message="No study material links available for the selected class and stream." />
        ) : null}
      </article>
    </section>
  );
}


