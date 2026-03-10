import Link from "next/link";
import { NOTIFICATION_ITEMS } from "../../lib/siteContent";

export default function NotificationsSection() {
  return (
    <section id="notifications" className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-slate-900 max-md:text-lg">Latest Notifications</h2>
        <Link
          href="/notifications"
          className="rounded-full border border-sky-300/60 bg-sky-100/60 px-3 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-200/70"
        >
          View All
        </Link>
      </div>
      <ul className="grid gap-2">
        {NOTIFICATION_ITEMS.map((item) => (
          <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800">
            {item.title}
          </li>
        ))}
      </ul>
    </section>
  );
}