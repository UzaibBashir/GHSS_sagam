import "./globals.css";

export const metadata = {
  title: "GHSS",
  description: "Official website of GHSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-linear-to-br from-slate-100 to-slate-200 font-[Segoe_UI,Tahoma,Geneva,Verdana,sans-serif] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}