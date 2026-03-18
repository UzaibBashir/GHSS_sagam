import { HOME_FRONT_DESK, HOME_HIGHLIGHTS } from "../../lib/siteContent";

export default function HomeHighlightsSection({ institute }) {
  const highlights = institute?.home_highlights || {};
  const stats = Array.isArray(highlights.stats) && highlights.stats.length ? highlights.stats : HOME_HIGHLIGHTS.stats;
  const reasons = Array.isArray(highlights.reasons) && highlights.reasons.length ? highlights.reasons : HOME_HIGHLIGHTS.reasons;

  const frontDesk = institute?.home_front_desk || HOME_FRONT_DESK;
  const frontDeskTitle = frontDesk?.title || HOME_FRONT_DESK.title;
  const frontDeskItems = Array.isArray(frontDesk?.items) && frontDesk.items.length ? frontDesk.items : HOME_FRONT_DESK.items;

  return (
    <section className="grid gap-5 rounded-[2rem] border border-slate-200 bg-[linear-gradient(140deg,#ffffff_0%,#f7fbff_48%,#eef6ff_100%)] p-6 shadow-[0_10px_26px_rgba(15,23,42,0.07)] max-md:p-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black tracking-[0.28em] text-sky-700 uppercase">School Highlights</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 max-md:text-xl">
            A trusted institution shaped by learning, discipline, and opportunity
          </h2>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-[1.4rem] border border-sky-100 bg-white p-4 text-center shadow-[0_10px_22px_rgba(14,116,144,0.08)]">
            <p className="text-3xl font-black text-sky-700">{item.value}</p>
            <p className="mt-2 text-sm font-semibold text-slate-700">{item.label}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.9fr]">
        <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-extrabold tracking-[0.22em] text-slate-800 uppercase">Why Families Choose Us</h3>
          <div className="mt-4 grid gap-3">
            {reasons.map((item) => (
              <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.6rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_14px_32px_rgba(2,6,23,0.2)]">
          <h3 className="text-sm font-extrabold tracking-[0.22em] text-sky-200 uppercase">{frontDeskTitle}</h3>
          <div className="mt-4 grid gap-3">
            {frontDeskItems.map((item) => (
              <div key={item} className="rounded-xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
