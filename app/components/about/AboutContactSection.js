"use client";

import Link from "next/link";

export default function AboutContactSection({ institute }) {
  const contact = institute?.contact || {};
  const formUrl = "/admission";

  const contactItems = [
    {
      label: "Email",
      value: contact.email || "ghsssagam@gmail.com",
      href: `mailto:${contact.email || "ghsssagam@gmail.com"}`,
    },
    {
      label: "Phone",
      value: contact.phone || "+91-7006670384",
      href: `tel:${contact.phone || "+91-7006670384"}`,
    },
    {
      label: "Address",
      value:
        contact.address ||
        "Government Girls Higher Secondary School, Sagam, Jammu and Kashmir, India",
    },
  ];

  return (
    <section
      id="contact"
      className="grid gap-5 rounded-[2rem] border border-white/75 bg-[linear-gradient(135deg,rgba(255,255,255,0.88)_0%,rgba(243,247,255,0.86)_50%,rgba(234,244,248,0.9)_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] max-md:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="section-kicker">Contact and Access</p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-slate-950 max-md:text-2xl">
            All important school contact details in one place
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
            Families can use the contact details below for admission support, academic queries, and general institutional information.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={formUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-amber-300/70 bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 transition hover:bg-amber-300"
          >
            Admission Form
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {contactItems.map((item) => {
          const content = (
            <article
              key={item.label}
              className="rounded-[1.4rem] border border-slate-200/80 bg-white/88 p-4 shadow-[0_10px_22px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5"
            >
              <p className="text-xs font-black tracking-[0.18em] text-slate-500 uppercase">{item.label}</p>
              <p className="mt-3 text-sm leading-7 font-semibold text-slate-900">{item.value}</p>
            </article>
          );

          if (item.href) {
            return (
              <a key={item.label} href={item.href} className="block">
                {content}
              </a>
            );
          }

          return content;
        })}
      </div>
    </section>
  );
}

