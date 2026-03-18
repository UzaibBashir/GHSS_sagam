import Link from "next/link";
import { HOME_RESOURCES } from "../../lib/siteContent";

export default function ResourcesSection({ institute }) {
  const items = Array.isArray(institute?.home_resources) && institute.home_resources.length
    ? institute.home_resources
    : HOME_RESOURCES;

  return (
    <section className="grid gap-5 rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#eff8ff_0%,#ffffff_100%)] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
      <div>
        <p className="text-xs font-black tracking-[0.28em] text-indigo-700 uppercase">Important Links</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 max-md:text-xl">
          Scholarships, forms, calendars, and other essential student resources
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article key={`${item.title}-${index}`} className="rounded-[1.5rem] border border-indigo-100 bg-white p-5 shadow-[0_10px_24px_rgba(79,70,229,0.06)]">
            <h3 className="text-lg font-extrabold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            <Link
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
            >
              {item.label}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
