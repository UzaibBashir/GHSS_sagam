import { ACADEMIC_MATERIALS } from "../../lib/siteContent";

export default function AcademicsSection() {
  return (
    <section id="academics" className="grid gap-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
        <h2 className="text-2xl font-extrabold text-slate-900 max-md:text-xl">Academic Timetable</h2>
        <p className="mt-2 text-slate-700">Daily class schedule for regular academic sessions.</p>
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
        <h3 className="text-xl font-extrabold text-slate-900 max-md:text-lg">Study Material Folders</h3>
        <p className="mt-2 text-sm text-slate-700">Folder-wise organization: Class &gt; Stream &gt; Subject &gt; Google Drive Link.</p>

        <div className="mt-4 grid gap-4">
          {ACADEMIC_MATERIALS.folders.map((classItem) => (
            <div key={classItem.className} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-base font-extrabold text-slate-900">{classItem.className}</h4>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {classItem.streams.map((streamItem) => (
                  <div key={streamItem.stream} className="rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-sm font-extrabold text-slate-800">{streamItem.stream}</p>
                    <ul className="mt-2 grid gap-2 text-sm text-slate-700">
                      {streamItem.subjects.map((subject) => (
                        <li key={subject.name + subject.drive} className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-2">
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}