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

  return (
    <section
      id="notifications"
      className="rounded-[1.6rem] border border-slate-200/70 bg-white/85 p-6 shadow-[0_14px_32px_rgba(15,23,42,0.06)] max-md:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-kicker">Notifications</p>
          <h2 className="font-display mt-3 text-2xl font-semibold text-slate-950 max-md:text-xl">
            Latest school notices
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Simple, clear updates for students and parents.
          </p>
        </div>
        <Link
          href="/notifications"
          className="rounded-full border border-slate-300/80 bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-950 hover:text-white"
        >
          View All
        </Link>
      </div>

      <div className="mt-5 grid gap-2">
        {items.slice(0, 6).map((item) => (
          <article
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-3 text-sm text-slate-700 shadow-[0_6px_14px_rgba(15,23,42,0.04)]"
          >
            <div className="min-w-0">
              <p className="m-0 text-xs font-semibold tracking-[0.12em] text-teal-700 uppercase">
                {item.category || "Notice"}
              </p>
              <p className="m-0 mt-1 truncate text-sm font-semibold text-slate-900">
                {item.title}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {formatDateLabel(item.date)}
            </span>
          </article>
        ))}
        {!items.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
            No notifications published yet.
          </div>
        ) : null}
      </div>
    </section>
  );
}
