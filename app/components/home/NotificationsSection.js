import Link from "next/link";

function formatDateLabel(value) {
  if (!value) return "Recently posted";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationsSection({ institute }) {
  const items = institute?.notification_items || [];
  const featured = items[0];
  const rest = items.slice(1, 5);

  return (
    <section
      id="notifications"
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-linear-to-br from-white/82 via-white/74 to-sky-50/80 shadow-[0_24px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/45"
    >
      <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative border-b border-slate-200/70 p-6 max-md:p-4 lg:border-r lg:border-b-0">
          <div className="absolute right-0 top-0 h-36 w-36 bg-[radial-gradient(circle,rgba(212,166,70,0.2),rgba(212,166,70,0))]" />
          <p className="section-kicker">Notice Board</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl font-semibold text-slate-950 max-md:text-2xl">Latest school updates</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-slate-600">
                Stay informed about admissions, examinations, student activities, and important academic announcements.
              </p>
            </div>
            <Link
              href="/notifications"
              className="rounded-full border border-slate-300/80 bg-white/84 px-4 py-2 text-sm font-bold text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              View All Notices
            </Link>
          </div>

          {featured ? (
            <article className="mt-6 rounded-[1.7rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
              <p className="text-xs font-bold tracking-[0.16em] text-amber-300 uppercase">{featured.category || "Notice"}</p>
              <h3 className="mt-3 text-2xl leading-tight font-bold">{featured.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-200">{featured.summary || featured.details}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                <span>{formatDateLabel(featured.date)}</span>
                {featured.link_url ? (
                  <a
                    href={featured.link_url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-amber-400 px-4 py-2 font-bold text-slate-950 transition hover:bg-amber-300"
                  >
                    {featured.link_label || "Open Notice"}
                  </a>
                ) : null}
              </div>
            </article>
          ) : (
            <div className="mt-6 rounded-[1.7rem] border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500">
              No notifications published yet.
            </div>
          )}
        </div>

        <div className="grid gap-3 p-6 max-md:p-4">
          {rest.length ? (
            rest.map((item, index) => (
              <article
                key={item.id}
                className="group rounded-[1.5rem] border border-slate-200/80 bg-white/76 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(15,23,42,0.1)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-300 to-yellow-500 text-sm font-extrabold text-slate-950 shadow-[0_10px_18px_rgba(212,166,70,0.22)]">
                    {String(index + 2).padStart(2, "0")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-bold tracking-[0.14em] text-teal-700 uppercase">
                      <span>{item.category || "Update"}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span>{formatDateLabel(item.date)}</span>
                    </div>
                    <h3 className="mt-2 text-lg leading-snug font-bold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary || item.details}</p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500">
              Additional school announcements will appear here.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
