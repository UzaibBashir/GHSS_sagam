import { HOME_PROGRAMS } from "../../lib/siteContent";

export default function ProgramsSection() {
  return (
    <section className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
      <div>
        <p className="text-xs font-black tracking-[0.28em] text-rose-700 uppercase">Programmes</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 max-md:text-xl">
          Academic pathways designed for ambition and growth
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {HOME_PROGRAMS.map((item, index) => (
          <article
            key={item.title}
            className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#fff8fb_0%,#ffffff_100%)] p-5 shadow-[0_10px_24px_rgba(244,63,94,0.06)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-sm font-black text-rose-700">
              0{index + 1}
            </div>
            <h3 className="mt-4 text-lg font-extrabold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
