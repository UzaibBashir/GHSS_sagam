import Image from "next/image";
import { NOTICEBOARD_ITEMS } from "../../lib/siteContent";

function NoticeboardCard({ item }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-extrabold text-slate-900">{item.title}</h3>
        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[0.7rem] font-bold text-slate-700">{item.time}</span>
      </div>
      <p className="mt-2 text-sm text-slate-700">{item.description}</p>

      {item.type === "link" && item.link ? (
        <a
          href={item.link.href}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block rounded-full border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-100"
        >
          {item.link.label}
        </a>
      ) : null}

      {item.type === "image" && item.image ? (
        <div className="relative mt-3 h-32 w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
          <Image src={item.image.src} alt={item.image.alt} fill sizes="(max-width:768px) 100vw, 320px" className="object-contain p-2" />
        </div>
      ) : null}

      {item.type === "timetable" && item.timetable?.length ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {item.timetable.map((row) => (
            <div key={row.slot} className="flex items-center justify-between border-b border-slate-100 px-3 py-2 text-xs last:border-b-0">
              <span className="font-bold text-slate-700">{row.slot}</span>
              <span className="text-slate-600">{row.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export default function NoticeboardSection() {
  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-slate-900 max-md:text-lg">Noticeboard - Today</h2>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">Daily Updates</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {NOTICEBOARD_ITEMS.map((item) => (
          <NoticeboardCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}