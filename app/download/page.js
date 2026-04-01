"use client";

import Link from "next/link";
import { useEffect } from "react";

const APK_URL = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL || "/downloads/ghhs-app.apk";
const APK_FILENAME = process.env.NEXT_PUBLIC_APP_APK_FILENAME || "ghhs-app.apk";

function triggerApkDownload() {
  const link = document.createElement("a");
  link.href = APK_URL;
  link.setAttribute("download", APK_FILENAME);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function DownloadPage() {
  const installPath = APK_URL;

  useEffect(() => {
    triggerApkDownload();
  }, []);

  return (
    <main className="mx-auto w-[min(900px,calc(100%-2rem))] py-12 text-slate-900">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">App download started</h1>
      <p className="mt-3 text-base text-slate-700">
        Your APK download should begin automatically. If it did not start, use the download button below.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <a
          href={APK_URL}
          download={APK_FILENAME}
          className="inline-flex items-center rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-800"
        >
          Download APK
        </a>
        <p className="mt-3 text-sm text-slate-600">
          APK path: <code className="rounded bg-slate-100 px-1.5 py-0.5">{installPath}</code>
        </p>
        <p className="mt-2 text-sm font-medium text-emerald-700">Auto-download attempted on page open.</p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold text-slate-900">Install after download</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-slate-700">
          <li>Open the downloaded APK from your browser Downloads list or File Manager.</li>
          <li>Allow install from this source when Android asks for permission.</li>
          <li>Tap Install, then Open.</li>
        </ol>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-sm font-semibold text-slate-700 underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </main>
  );
}
