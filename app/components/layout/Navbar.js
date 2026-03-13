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
    <header className="sticky top-0 z-30 px-3 pt-3 max-sm:px-2 max-sm:pt-2" id="home">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-linear-to-br from-[#081526] via-[#102542] to-[#0b3550] text-slate-100 shadow-[0_22px_55px_rgba(2,6,23,0.34),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,166,70,0.22),transparent_18%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_22%)]" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-white/20" />

        <div className="relative mx-auto flex min-h-24 w-[min(1180px,calc(100%-2rem))] items-center justify-between gap-4 py-4 max-sm:w-[min(1180px,calc(100%-1rem))] max-sm:py-3">
          <Link href="/" onClick={closeMenu} className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[1.4rem] border border-white/18 bg-white/92 p-2 shadow-[0_18px_30px_rgba(212,166,70,0.18),inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-white/18 max-sm:h-13 max-sm:w-13">
              <Image
                src="/logo.jpg"
                alt="Government Girls Higher Secondary School, Sagam logo"
                fill
                sizes="(max-width: 640px) 52px, 64px"
                quality={100}
                className="object-contain p-1"
                priority
              />
            </div>

            <div className="min-w-0">
              <p className="font-display m-0 text-[1.35rem] leading-none font-semibold text-white drop-shadow-[0_2px_10px_rgba(2,6,23,0.35)] max-md:text-[1.08rem] max-sm:text-[0.95rem]">
                Government Girls Higher Secondary School, Sagam
              </p>
              <p className="m-0 mt-1 text-sm font-medium text-slate-300 max-sm:text-[0.74rem]">
                Empowering girls through scholarship, discipline, and opportunity.
              </p>
            </div>
          </Link>

          <button
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/14 bg-white/10 text-white shadow-[0_14px_28px_rgba(2,6,23,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur min-[981px]:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            type="button"
          >
            <span className="relative block h-5 w-5">
              <span
                className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-white transition-all ${
                  menuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 block h-0.5 w-5 rounded-full bg-white transition-opacity ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-4 block h-0.5 w-5 rounded-full bg-white transition-all ${
                  menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>

          <div className="hidden items-center gap-3 min-[981px]:flex">
            <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_32px_rgba(2,6,23,0.18)] backdrop-blur">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white hover:text-slate-950"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/admin"
              className="inline-flex items-center rounded-full border border-amber-300/30 bg-linear-to-r from-amber-400 to-yellow-500 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_18px_32px_rgba(212,166,70,0.28),inset_0_1px_0_rgba(255,255,255,0.5)] transition hover:-translate-y-0.5"
            >
              Login
            </Link>
          </div>
        </div>

        <div
          className={`relative mx-auto w-[min(1180px,calc(100%-2rem))] overflow-hidden transition-all duration-200 max-sm:w-[min(1180px,calc(100%-1rem))] min-[981px]:hidden ${
            menuOpen ? "max-h-[24rem] pb-4 opacity-100" : "max-h-0 pb-0 opacity-0"
          }`}
        >
          <nav className="grid gap-2 rounded-[1.5rem] border border-white/12 bg-white/10 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_32px_rgba(2,6,23,0.18)] backdrop-blur">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white hover:text-slate-950"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={closeMenu}
              className="mt-1 inline-flex justify-center rounded-2xl bg-linear-to-r from-amber-400 to-yellow-500 px-4 py-3 text-sm font-extrabold text-slate-950 shadow-[0_18px_32px_rgba(212,166,70,0.24)]"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
