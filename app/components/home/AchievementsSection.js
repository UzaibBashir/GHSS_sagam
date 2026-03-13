import { HOME_AWARDS } from "../../lib/siteContent";

export default function AchievementsSection() {
  return (
    <section className="grid gap-5 rounded-[2rem] border border-slate-200 bg-[linear-gradient(140deg,#fffdf8_0%,#fff6df_52%,#ffffff_100%)] p-6 shadow-[0_10px_24px_rgba(120,53,15,0.08)] max-md:p-4">
      <div>
        <p className="text-xs font-black tracking-[0.28em] text-amber-700 uppercase">Awards and Achievements</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 max-md:text-xl">
          Recognition built through consistency, effort, and student excellence
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {HOME_AWARDS.map((item) => (
          <article key={item} className="rounded-[1.4rem] border border-amber-200/70 bg-white/90 p-4 text-sm leading-6 text-slate-700 shadow-[0_10px_20px_rgba(180,120,10,0.06)]">
            {item}
          </article>
        ))}
      </div>
    </section>
  );
}
