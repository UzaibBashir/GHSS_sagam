import { Cormorant_Garamond, Manrope } from "next/font/google";
import WebVitalsReporter from "./components/common/WebVitalsReporter";
import { getServerPublicInstitute } from "./lib/serverInstitute";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: {
    default: "Government Girls Higher Secondary School, Sagam",
    template: "%s | Government Girls Higher Secondary School, Sagam",
  },
  description:
    "Official website of Government Girls Higher Secondary School, Sagam, showcasing academics, admissions, notices, student support, and institutional information.",
};

export default async function RootLayout({ children }) {
  const institute = await getServerPublicInstitute();
  const bootstrapJson = JSON.stringify({ institute }).replace(/</g, "\\u003c");

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${cormorant.variable} min-h-screen bg-[var(--page-bg)] [font-family:var(--font-sans)] text-slate-900 antialiased`}
      >
        <script
          id="ghhs-bootstrap"
          dangerouslySetInnerHTML={{
            __html: `window.__GHHS_BOOTSTRAP__ = ${bootstrapJson};`,
          }}
        />
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  );
}
