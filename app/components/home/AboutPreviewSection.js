import Link from "next/link";
import { HOME_ABOUT_CONTENT } from "../../lib/siteContent";

export default function AboutPreviewSection({ institute }) {
  const details = institute?.institute_details?.length
    ? institute.institute_details
    : HOME_ABOUT_CONTENT.basicDetails;

  return (
    <section className="grid gap-6 rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f7fbff_42%,#edf6ff_100%)] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 max-w-3xl">
          <p className="text-xs font-black tracking-[0.28em] text-sky-700 uppercase">
            About The Institute
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900 max-md:text-2xl">
            A modern higher secondary institution dedicated to girls&apos; education in Sagam
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">{HOME_ABOUT_CONTENT.intro}</p>
        </div>
        <Link
          href="/about"
          className="rounded-full border border-sky-300/55 bg-sky-100/55 px-4 py-2 text-sm font-semibold text-sky-900 transition hover:bg-sky-200/70"
        >
          Explore Full Profile
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_10px_22px_rgba(15,23,42,0.05)]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Vision</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{HOME_ABOUT_CONTENT.vision}</p>
            </div>
            <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Motto</h3>
              <p className="mt-2 text-base font-black text-slate-900">{HOME_ABOUT_CONTENT.motto}</p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.2rem] border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-extrabold tracking-wide text-slate-800 uppercase">Mission</h3>
            <ul className="mt-3 grid gap-3 text-sm text-slate-700">
              {HOME_ABOUT_CONTENT.mission.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-[1.6rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_14px_32px_rgba(2,6,23,0.16)]">
          <h3 className="text-sm font-extrabold tracking-[0.22em] text-sky-200 uppercase">
            Basic Details
          </h3>
          <div className="mt-4 grid gap-3">
            {details.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/12 bg-white/8 px-4 py-3 text-sm leading-6 text-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

