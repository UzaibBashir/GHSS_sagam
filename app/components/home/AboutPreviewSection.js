import Link from "next/link";
import { HOME_ABOUT_CONTENT } from "../../lib/siteContent";

export default function AboutPreviewSection({ institute }) {
  const details = institute?.institute_details?.length
    ? institute.institute_details
    : HOME_ABOUT_CONTENT.basicDetails;

  return (
    <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-slate-900 max-md:text-xl">About The Institute</h2>
        <Link
          href="/about"
          className="rounded-full border border-sky-300/55 bg-sky-100/55 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-200/70"
        >
          Explore Full Profile
        </Link>
      </div>

      <p className="m-0 text-slate-700">{HOME_ABOUT_CONTENT.intro}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Vision</h3>
          <p className="mt-2 text-sm text-slate-700">{HOME_ABOUT_CONTENT.vision}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Motto</h3>
          <p className="mt-2 text-sm font-bold text-slate-900">{HOME_ABOUT_CONTENT.motto}</p>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Mission</h3>
          <ul className="mt-2 grid list-disc gap-2 pl-5 text-sm text-slate-700">
            {HOME_ABOUT_CONTENT.mission.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Basic Details</h3>
          <ul className="mt-2 grid list-disc gap-2 pl-5 text-sm text-slate-700">
            {details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
