import { HOME_TESTIMONIALS } from "../../lib/siteContent";

export default function TestimonialsSection() {
  return (
    <section className="grid gap-5 rounded-[2rem] border border-slate-200 bg-[linear-gradient(135deg,#f6fbf8_0%,#ffffff_100%)] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.06)] max-md:p-4">
      <div>
        <p className="text-xs font-black tracking-[0.28em] text-emerald-700 uppercase">Testimonials and Feedback</p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-900 max-md:text-xl">
          What students, parents, and alumni say about the school experience
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {HOME_TESTIMONIALS.map((item) => (
          <article key={item.name} className="rounded-[1.5rem] border border-emerald-100 bg-white p-5 shadow-[0_10px_24px_rgba(5,150,105,0.06)]">
            <p className="text-sm leading-7 text-slate-700">&ldquo;{item.quote}&rdquo;</p>
            <div className="mt-4 border-t border-slate-200 pt-4">
              <p className="text-base font-extrabold text-slate-900">{item.name}</p>
              <p className="text-sm font-semibold text-emerald-700">{item.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
