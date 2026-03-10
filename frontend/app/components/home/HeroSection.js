export default function HeroSection({ institute }) {
  return (
    <section className="rounded-2xl bg-linear-to-r from-slate-800 to-teal-700 p-8 text-slate-50 max-md:p-5" id="home">
      <p className="inline-block rounded-full bg-amber-500 px-3.5 py-1 text-sm font-bold text-gray-900 max-sm:text-xs">
        Admissions Open 2026
      </p>
      <h1 className="mt-3 mb-2 text-3xl font-bold max-md:text-2xl">
        {institute?.name || "Government Girls Higher Secondary School, Sagam"}
      </h1>
      <p className="m-0 text-xl font-semibold max-md:text-lg">{institute?.tagline || "Learn Today, Lead Tomorrow"}</p>
      <p className="mt-3 text-slate-100">{institute?.description}</p>
    </section>
  );
}
