import "./globals.css";

export const metadata = {
  title: "Bright Future Institute",
  description: "Official website of Bright Future Institute",
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