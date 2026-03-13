"use client";

import { useState } from "react";
import { API_BASE } from "../../lib/api";
import { INPUT, MUTED_TEXT, PRIMARY_BUTTON } from "../../lib/uiClasses";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  program_interest: "",
  message: "",
};

const toErrorMessage = (error) => String(error?.message || error);

function ContactInfoCard({ title, value, href, tone }) {
  const toneClass =
    tone === "gold"
      ? "from-amber-100 to-yellow-50 text-amber-900"
      : tone === "teal"
        ? "from-teal-100 to-cyan-50 text-teal-900"
        : "from-slate-100 to-white text-slate-900";

  const content = (
    <div className={`rounded-[1.4rem] bg-linear-to-br ${toneClass} p-4 shadow-[0_14px_28px_rgba(15,23,42,0.06)]`}>
      <p className="text-[0.72rem] font-extrabold tracking-[0.16em] uppercase opacity-70">{title}</p>
      <p className="mt-2 text-sm leading-6 font-semibold">{value}</p>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="transition hover:-translate-y-0.5">
        {content}
      </a>
    );
  }

  return content;
}

export default function ContactSection({ institute }) {
  const [formData, setFormData] = useState(initialForm);
  const [status, setStatus] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Submission failed");

      setStatus(data.message || "Submitted successfully.");
      setFormData(initialForm);
    } catch (error) {
      setStatus(toErrorMessage(error));
    }
  };

  return (
    <section
      id="contact-enquiry"
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 text-white shadow-[0_24px_60px_rgba(15,23,42,0.15)]"
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative p-6 max-md:p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,166,70,0.22),transparent_30%)]" />
          <div className="relative">
            <p className="section-kicker">Contact Desk</p>
            <h2 className="font-display mt-4 text-4xl font-semibold text-white max-md:text-3xl">
              Reach the institute with ease
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200">
              For admission support, stream selection guidance, and general institutional queries, families can contact
              the school directly through the channels below.
            </p>

            <div className="mt-6 grid gap-3">
              <ContactInfoCard
                title="Email"
                value={institute?.contact?.email || "ghhssagam@school.edu.in"}
                href={`mailto:${institute?.contact?.email || "ghhssagam@school.edu.in"}`}
                tone="gold"
              />
              <ContactInfoCard
                title="Phone"
                value={institute?.contact?.phone || "+91-7000000000"}
                href={`tel:${institute?.contact?.phone || "+91-7000000000"}`}
                tone="teal"
              />
              <ContactInfoCard
                title="Address"
                value={
                  institute?.contact?.address ||
                  "Government Girls Higher Secondary School, Sagam, Jammu and Kashmir, India"
                }
              />
            </div>
          </div>
        </div>

        <div className="glass-panel border-t border-white/12 p-6 text-slate-900 max-md:p-4 lg:border-l lg:border-t-0">
          <div className="rounded-[1.8rem] border border-white/70 bg-white/82 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[0.72rem] font-extrabold tracking-[0.16em] text-teal-700 uppercase">Admission Enquiry</p>
                <h3 className="font-display mt-2 text-3xl font-semibold text-slate-950 max-md:text-2xl">
                  Send a message to the front desk
                </h3>
              </div>
              <div className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold tracking-[0.14em] text-white uppercase">
                Response support
              </div>
            </div>

            <form className="mt-6 grid gap-3" onSubmit={onSubmit}>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="full_name"
                  value={formData.full_name}
                  onChange={onChange}
                  placeholder="Full Name"
                  className={INPUT}
                  required
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={onChange}
                  placeholder="Email Address"
                  className={INPUT}
                  required
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  placeholder="Phone Number"
                  className={INPUT}
                  required
                />
                <input
                  name="program_interest"
                  value={formData.program_interest}
                  onChange={onChange}
                  placeholder="Interested Stream"
                  className={INPUT}
                  required
                />
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={onChange}
                placeholder="Tell us how we can help with admission or academic guidance"
                className={INPUT}
                rows={5}
                required
              />
              <button type="submit" className={PRIMARY_BUTTON}>
                Submit Enquiry
              </button>
            </form>
            {status ? <p className={`${MUTED_TEXT} mt-4`}>{status}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
