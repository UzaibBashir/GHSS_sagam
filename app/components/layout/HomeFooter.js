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

  if (name === "facebook") {
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37a4 4 0 1 1-7.75 1.26 4 4 0 0 1 7.75-1.26z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }

  if (name === "youtube") {
    return (
      <svg {...common}>
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    );
  }

  return null;
}

export default function HomeFooter({ institute }) {
  const instituteName = institute?.name || "Government Girls Higher Secondary School, Sagam";
  const email = "ghsssagam@gmail.com";
  const phone = "+91 70066 70384";
  const address = institute?.contact?.address || "Main Road, Sagam, Jammu and Kashmir, India";
  const mapQuery = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const whatsappPhone = phone.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${whatsappPhone}`;
  const year = new Date().getFullYear();

  const socialLinks = [{ label: "Facebook", href: "https://facebook.com", icon: "facebook" }];

  return (
    <footer className="mt-12 border-t border-slate-300/20 bg-linear-to-r from-slate-950 via-slate-900 to-blue-950 text-slate-200">
      <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] gap-8 py-10 max-sm:w-[min(1120px,calc(100%-1rem))] lg:grid-cols-[1.15fr_0.9fr_1fr_1.2fr]">
        <section>
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 shrink-0 rounded-full bg-white/90 p-1 shadow-[0_8px_18px_rgba(14,116,144,0.4)] ring-2 ring-white/70">
              <div className="relative h-full w-full overflow-hidden rounded-full border border-slate-200 bg-white p-1">
                <Image
                  src="/logo.jpg"
                  alt={`${instituteName} logo`}
                  fill
                  sizes="64px"
                  quality={100}
                  className="object-contain"
                />
              </div>
            </div>
            <h3 className="text-[1rem] leading-tight font-bold text-white">{instituteName}</h3>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-300">
            Building confident, responsible, and future-ready students through quality education and values.
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/30 bg-slate-200/10 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-sky-200/40 hover:bg-sky-300/20"
              >
                <Icon name={item.icon} className="h-3.5 w-3.5" />
                {item.label}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-bold tracking-wide text-white uppercase">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/" className="transition hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/academics" className="transition hover:text-white">
                Academics
              </Link>
            </li>
            <li>
              <Link href="/admission" className="transition hover:text-white">
                Admission
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/admin" className="transition hover:text-white">
                Admin Login
              </Link>
            </li>
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-bold tracking-wide text-white uppercase">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>
              <a href={`tel:${phone}`} className="mt-1 inline-flex items-center gap-2 font-medium text-slate-100 transition hover:text-white">
                <Icon name="phone" /><span>Exam Incharge: {phone}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="mt-1 inline-flex items-center gap-2 font-medium text-slate-100 transition hover:text-white">
                <Icon name="email" />
                {email}
              </a>
            </li>
            <li>
              <span className="block text-slate-400">Address</span>
              <p className="m-0 mt-1 inline-flex items-start gap-2 font-medium text-slate-100">
                <Icon name="address" />
                <span>{address}</span>
              </p>
            </li>
            <li>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-full border border-emerald-200/40 bg-emerald-400/20 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-300/30"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h4 className="text-sm font-bold tracking-wide text-white uppercase">Find Us</h4>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-300/25 bg-slate-800/70 shadow-[0_12px_22px_rgba(2,6,23,0.25)]">
            <iframe
              title="School location map"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-44 w-full border-0"
              allowFullScreen
            />
          </div>
        </section>
      </div>

      <div className="border-t border-slate-300/15">
        <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-wrap items-center justify-between gap-3 py-4 text-xs text-slate-400 max-sm:w-[min(1120px,calc(100%-1rem))]">
          <p className="m-0">(c) {year} {instituteName}. All rights reserved.</p>
          <p className="m-0">Designed for students, parents, and community.</p>
        </div>
      </div>
    </footer>
  );
}




