import Link from "next/link";

export default function CallToActionBanner({ title, description, primaryAction, secondaryAction }) {
  return (
    <section className="glass-panel overflow-hidden rounded-[2rem] border border-white/80 p-6 shadow-[0_22px_50px_rgba(15,23,42,0.08)] max-md:p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="section-kicker">Need Guidance?</p>
          <h2 className="font-display mt-4 text-3xl leading-tight font-semibold text-slate-950 max-md:text-2xl">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-teal-700 via-cyan-700 to-slate-900 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_28px_rgba(15,118,110,0.22)] transition hover:-translate-y-0.5"
            >
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center justify-center rounded-full border border-slate-300/80 bg-white/88 px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
