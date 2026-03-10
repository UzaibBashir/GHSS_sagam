import Link from "next/link";

export default function HomeFooter() {
  return (
    <footer className="mt-10 border-t border-slate-400/30 bg-linear-to-r from-slate-900 to-slate-800 text-slate-200">
      <div className="mx-auto flex min-h-[4.2rem] w-[min(1100px,calc(100%-2rem))] items-center justify-between gap-4 py-3 max-md:flex-col max-md:items-start max-md:justify-center max-sm:w-[min(1100px,calc(100%-1rem))]">
        <p className="m-0">Government Girls Higher Secondary School, Sagam</p>
        <Link
          href="/admin"
          className="rounded-full border border-slate-200/50 px-3.5 py-1.5 font-bold transition hover:bg-slate-200/15"
        >
          Admin Login
        </Link>
      </div>
    </footer>
  );
}
