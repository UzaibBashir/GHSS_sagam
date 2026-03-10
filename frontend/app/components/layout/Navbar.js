"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Notifications", href: "/notifications" },
  { label: "Academics", href: "/academics" },
  { label: "Admission", href: "/admission" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="sticky top-0 z-20 overflow-visible border-b border-slate-200/20 bg-linear-to-r from-slate-950/95 via-slate-900/94 to-blue-950/93 text-slate-50 shadow-[0_14px_30px_rgba(2,6,23,0.28)] backdrop-blur-md"
      id="home"
    >
      <div
        className="pointer-events-none absolute -left-18 -top-12 h-42 w-82 bg-[radial-gradient(circle,rgba(56,189,248,0.28),rgba(56,189,248,0))]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-10 top-0 h-30 w-52 bg-[radial-gradient(circle,rgba(14,165,233,0.22),rgba(14,165,233,0))]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-24 w-[min(1120px,calc(100%-2rem))] items-center justify-between gap-4 py-[1.05rem] max-[900px]:min-h-[4.4rem] max-[900px]:py-[0.7rem] max-sm:w-[min(1120px,calc(100%-1rem))]">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div
            className="relative h-17 w-17 shrink-0 rounded-full bg-linear-to-br from-sky-300/60 via-white/75 to-cyan-200/60 p-[3px] shadow-[0_0_0_3px_rgba(255,255,255,0.22),0_12px_24px_rgba(14,116,144,0.42)] max-[900px]:h-12 max-[900px]:w-12"
            aria-label="School logo"
          >
            <div className="relative h-full w-full overflow-hidden rounded-full border border-white/75 bg-white p-[3px]">
              <Image
                src="/logo.jpg"
                alt="Govt Girls Higher Secondary School Sagam logo"
                fill
                sizes="(max-width: 900px) 48px, 68px"
                quality={100}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="m-0 truncate text-[1.04rem] leading-tight font-extrabold tracking-[0.02em] text-slate-50 max-[900px]:text-[0.82rem] max-[900px]:leading-[1.2]">
              Govt Girls Higher Secondary School, Sagam
            </p>
            <p className="m-0 mt-0.5 truncate text-[0.82rem] font-medium tracking-[0.03em] text-sky-100/90 max-[900px]:text-[0.64rem] max-[900px]:leading-[1.1]">
              From Darkness to Light
            </p>
          </div>
        </div>

        <button
          className="ml-auto inline-flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-xl border border-sky-100/35 bg-sky-100/10 text-slate-50 shadow-[0_6px_16px_rgba(2,6,23,0.22)] max-[900px]:inline-flex min-[901px]:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          type="button"
        >
          <span className="relative block h-4.5 w-[1.2rem]">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-[1.2rem] rounded-full bg-slate-50 transition-all ${
                menuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-[1.2rem] rounded-full bg-slate-50 transition-opacity ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-3 block h-0.5 w-[1.2rem] rounded-full bg-slate-50 transition-all ${
                menuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <nav
          className={`items-center gap-2.5 text-[0.92rem] font-semibold min-[901px]:flex ${
            menuOpen
              ? "max-[900px]:fixed max-[900px]:top-[5.1rem] max-[900px]:left-2.5 max-[900px]:right-2.5 max-[900px]:z-50 max-[900px]:grid max-[900px]:gap-1.5 max-[900px]:rounded-2xl max-[900px]:border max-[900px]:border-sky-100/25 max-[900px]:bg-slate-900/97 max-[900px]:p-2.5 max-[900px]:shadow-[0_12px_24px_rgba(2,6,23,0.35)] max-[900px]:backdrop-blur"
              : "max-[900px]:hidden"
          }`}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="block rounded-full border border-transparent px-3.5 py-1.6 text-slate-100/95 transition hover:-translate-y-px hover:border-sky-200/30 hover:bg-sky-300/16 hover:text-white max-[900px]:rounded-xl max-[900px]:border-slate-300/12 max-[900px]:bg-slate-300/9 max-[900px]:px-3.5 max-[900px]:py-2 max-[900px]:text-left"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}