import { Cormorant_Garamond, Manrope } from "next/font/google";
import WebVitalsReporter from "./components/common/WebVitalsReporter";
import "./globals.css";

const SITE_URL = String(process.env.NEXT_PUBLIC_SITE_URL || "https://ghss-sagam.vercel.app").trim().replace(/\/+$/, "");
const GOOGLE_VERIFICATION_TOKEN =
  String(process.env.GOOGLE_SITE_VERIFICATION || "_zVRk9oY29KlK4JgIhmHlNLQAlrMtPidCKhXNN8NduI").trim();

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Government Girls Higher Secondary School, Sagam",
    template: "%s | Government Girls Higher Secondary School, Sagam",
  },
  description:
    "Official website of Government Girls Higher Secondary School, Sagam, showcasing academics, admissions, notices, student support, and institutional information.",
  keywords: [
    "Government Girls Higher Secondary School Sagam",
    "GHHS Sagam",
    "girls higher secondary school",
    "Sagam school admissions",
    "JKBOSE higher secondary school",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Government Girls Higher Secondary School, Sagam",
    description:
      "Official website of Government Girls Higher Secondary School, Sagam, for admissions, academics, notices, and contact information.",
    url: SITE_URL,
    siteName: "Government Girls Higher Secondary School, Sagam",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Government Girls Higher Secondary School, Sagam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Government Girls Higher Secondary School, Sagam",
    description:
      "Official website of Government Girls Higher Secondary School, Sagam, for admissions, academics, notices, and contact information.",
    images: ["/logo.jpg"],
  },
  verification: {
    google: GOOGLE_VERIFICATION_TOKEN,
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Government Girls Higher Secondary School, Sagam",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.jpg`,
    email: "ghhssagam@school.edu.in",
    telephone: "+91-7000000000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sagam",
      addressRegion: "Jammu and Kashmir",
      addressCountry: "IN",
    },
  };

  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${cormorant.variable} min-h-screen bg-[var(--page-bg)] [font-family:var(--font-sans)] text-slate-900 antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  );
}
