"use client";

import Image from "next/image";
import Link from "next/link";

function Icon({ name, className = "h-4 w-4" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.62a2 2 0 0 1-.45 2.11L8 9.99a16 16 0 0 0 6 6l1.54-1.23a2 2 0 0 1 2.11-.45c.84.29 1.72.5 2.62.62A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }

  if (name === "email") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (name === "address") {
    return (
      <svg {...common}>
        <path d="M12 21s-6-5.33-6-10a6 6 0 0 1 12 0c0 4.67-6 10-6 10z" />
        <circle cx="12" cy="11" r="2" />
      </svg>
    );
  }

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    );
  }

  return null;
}

export default function HomeFooter({ institute }) {
  const instituteName = institute?.name || "Government Girls Higher Secondary School, Sagam";
  const email = institute?.contact?.email || "ghsssagam@gmail.com";
  const phone = institute?.contact?.phone || "+91-7006670384";
  const address = institute?.contact?.address || "Government Girls Higher Secondary School, Sagam, Jammu and Kashmir, India";
  const mapQuery = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Academics", href: "/academics" },
    { label: "Admission", href: "/admission" },
    { label: "Notifications", href: "/notifications" },
    { label: "About Us", href: "/about" },
    { label: "Admin Login", href: "/admin" },
  ];

  const streamLinks = [
    { label: "Medical Stream", href: "/academics" },
    { label: "Non-Medical Stream", href: "/academics" },
    { label: "Arts Stream", href: "/academics" },
  ];

  return (
    <footer className="relative mt-14 overflow-hidden border-t border-slate-900/10 bg-slate-950 text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,166,70,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.14),transparent_24%)]" />

      <div className="relative mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-6 py-12 max-sm:w-[min(1180px,calc(100%-1rem))] lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.1fr]">
        <section className="rounded-[2rem] border border-white/12 bg-white/6 p-6 shadow-[0_20px_40px_rgba(2,6,23,0.25)] backdrop-blur">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.2rem] border border-white/20 bg-white p-2 shadow-[0_16px_28px_rgba(212,166,70,0.16)]">
              <Image
                src="/logo.jpg"
                alt={`${instituteName} logo`}
                fill
                sizes="64px"
                quality={100}
                className="object-contain p-1"
              />
            </div>
            <div>
              <p className="section-kicker">Girls&apos; Education</p>
              <h3 className="font-display mt-3 text-2xl leading-tight font-semibold text-white">{instituteName}</h3>
            </div>
          </div>

          <p className="mt-5 text-sm leading-7 text-slate-300">
            A forward-looking public institution nurturing confident young women through meaningful learning,
            academic care, and a disciplined environment built for higher secondary success.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {streamLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-amber-300/40 hover:bg-amber-300/12"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/12 bg-white/6 p-6 backdrop-blur">
          <h4 className="text-sm font-extrabold tracking-[0.16em] text-amber-200 uppercase">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm text-slate-300">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="inline-flex items-center gap-2 transition hover:text-white">
                  <Icon name="arrow" className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[2rem] border border-white/12 bg-white/6 p-6 backdrop-blur">
          <h4 className="text-sm font-extrabold tracking-[0.16em] text-amber-200 uppercase">Connect</h4>
          <ul className="mt-5 space-y-4 text-sm text-slate-300">
            <li>
              <a href={`tel:${phone}`} className="inline-flex items-start gap-3 transition hover:text-white">
                <span className="mt-0.5 rounded-full bg-white/10 p-2 text-amber-200">
                  <Icon name="phone" />
                </span>
                <span>{phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="inline-flex items-start gap-3 transition hover:text-white">
                <span className="mt-0.5 rounded-full bg-white/10 p-2 text-amber-200">
                  <Icon name="email" />
                </span>
                <span>{email}</span>
              </a>
            </li>
            <li className="inline-flex items-start gap-3">
              <span className="mt-0.5 rounded-full bg-white/10 p-2 text-amber-200">
                <Icon name="address" />
              </span>
              <span>{address}</span>
            </li>
          </ul>
        </section>

        <section className="rounded-[2rem] border border-white/12 bg-white/6 p-4 backdrop-blur">
          <h4 className="px-2 text-sm font-extrabold tracking-[0.16em] text-amber-200 uppercase">Campus Location</h4>
          <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-white/12 bg-slate-900/70 shadow-[0_16px_30px_rgba(2,6,23,0.24)]">
            <iframe
              title="School location map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-56 w-full border-0"
              allowFullScreen
            />
          </div>
        </section>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-wrap items-center justify-between gap-3 py-4 text-xs text-slate-400 max-sm:w-[min(1180px,calc(100%-1rem))]">
          <p className="m-0">(c) {year} {instituteName}. All rights reserved.</p>
        </div>
        <div className="mx-auto flex w-[min(1180px,calc(100%-2rem))] flex-wrap items-center justify-between gap-3 py-4 text-xs text-slate-400 max-sm:w-[min(1180px,calc(100%-1rem))]">
          <p className="m-0">This site is under Development and may contain subjects of error</p>
        </div>
      </div>
    </footer>
  );
}

