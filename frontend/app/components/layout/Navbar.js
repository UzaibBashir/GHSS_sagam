"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Home", href: "/" },
  { label: "Notifications", href: "/#notifications" },
  { label: "Academics", href: "/academics" },
  { label: "Download", href: "/download" },
  { label: "Admission", href: "/admission" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className="sticky top-0 z-20 overflow-visible border-b border-slate-400/35 bg-linear-to-r from-slate-900/96 to-slate-800/96 text-slate-50 shadow-[0_10px_24px_rgba(15,23,42,0.22)] backdrop-blur"
      id="home"
    >
      <div
        className="pointer-events-none absolute -left-15 -top-10 h-35 w-70 bg-[radial-gradient(circle,rgba(245,158,11,0.3),rgba(245,158,11,0))]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-22 w-[min(1100px,calc(100%-2rem))] items-center justify-between gap-4 py-[1.15rem] max-[900px]:min-h-[3.6rem] max-[900px]:py-[0.62rem] max-sm:w-[min(1100px,calc(100%-1rem))]">
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <span
            className="inline-flex h-11.5 w-11.5 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-amber-500 to-amber-300 shadow-[0_0_0_3px_rgba(255,255,255,0.16),0_8px_14px_rgba(245,158,11,0.35)] max-[900px]:h-8.5 max-[900px]:w-8.5"
            aria-label="Temporary school logo"
          >
            <span className="text-sm font-extrabold tracking-wide text-gray-800">GG</span>
          </span>
          <div className="min-w-0">
            <p className="m-0 truncate text-[0.95rem] leading-tight font-extrabold max-[900px]:text-[0.78rem] max-[900px]:leading-[1.15]">
              Govt Girls Higher Secondary School, Sagam
            </p>
            <p className="m-0 mt-0.5 truncate text-[0.8rem] opacity-85 max-[900px]:text-[0.62rem] max-[900px]:leading-[1.1]">
              Empowering Young Minds
            </p>
          </div>
        </div>

        <button
          className="ml-auto inline-flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-slate-200/45 bg-slate-200/10 p-0 text-slate-50 max-[900px]:inline-flex min-[901px]:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          type="button"
        >
          <span className="relative block h-4 w-[1.15rem]">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-[1.15rem] rounded-full bg-slate-50 transition-all ${menuOpen ? "translate-y-1.5 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-[1.15rem] rounded-full bg-slate-50 transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 top-3 block h-0.5 w-[1.15rem] rounded-full bg-slate-50 transition-all ${menuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
            />
          </span>
        </button>

        <nav
          className={`items-center gap-2 text-sm font-semibold min-[901px]:flex ${
            menuOpen
              ? "max-[900px]:fixed max-[900px]:top-[4.35rem] max-[900px]:left-2.5 max-[900px]:right-2.5 max-[900px]:z-999 max-[900px]:grid max-[900px]:gap-1.5 max-[900px]:rounded-xl max-[900px]:border max-[900px]:border-slate-400/35 max-[900px]:bg-slate-900/98 max-[900px]:p-2 max-[900px]:shadow-[0_10px_18px_rgba(15,23,42,0.3)]"
              : "max-[900px]:hidden"
          }`}
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={closeMenu}
              className="block rounded-full px-3 py-1.5 transition hover:-translate-y-px hover:bg-slate-400/22 max-[900px]:rounded-md max-[900px]:bg-slate-400/12 max-[900px]:px-3 max-[900px]:py-2 max-[900px]:text-left"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
