import Link from "next/link";

export default function PageHero({ eyebrow, title, description, stats = [], actions = [] }) {
  return (
    <section className="relative overflow-hidden rounded-[2.2rem] border border-white/70 bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 px-6 py-8 text-white shadow-[0_24px_60px_rgba(15,23,42,0.14)] max-md:px-4 max-md:py-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,166,70,0.22),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_28%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
          <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight font-semibold max-md:text-3xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">{description}</p>
          {actions.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {actions.map((action) => {
                const className = action.variant === "secondary"
                  ? "inline-flex items-center justify-center rounded-full border border-white/26 bg-white/8 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/14"
                  : "inline-flex items-center justify-center rounded-full bg-linear-to-r from-amber-400 to-yellow-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_16px_28px_rgba(212,166,70,0.26)] transition hover:-translate-y-0.5";

                if (action.href?.startsWith("http")) {
                  return (
                    <a key={action.label} href={action.href} target="_blank" rel="noreferrer" className={className}>
                      {action.label}
                    </a>
                  );
                }

                return (
                  <Link key={action.label} href={action.href || "/"} className={className}>
                    {action.label}
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>

        {stats.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {stats.map((item) => (
              <article key={`${item.label}-${item.value}`} className="rounded-[1.5rem] border border-white/14 bg-white/8 p-4 backdrop-blur">
                <p className="text-3xl font-extrabold text-amber-300">{item.value}</p>
                <p className="mt-2 text-sm font-semibold text-slate-100">{item.label}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
