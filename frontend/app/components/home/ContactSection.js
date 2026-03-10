"use client";

import { useState } from "react";
import { API_BASE } from "../../lib/api";
import { CARD, INPUT, MUTED_TEXT, PRIMARY_BUTTON } from "../../lib/uiClasses";

const initialForm = {
  full_name: "",
  email: "",
  phone: "",
  program_interest: "",
  message: "",
};

const toErrorMessage = (error) => String(error?.message || error);

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
    <section id="contact" className={CARD}>
      <h2>Contact</h2>
      <p>Email: {institute?.contact?.email}</p>
      <p>Phone: {institute?.contact?.phone}</p>
      <p>Address: {institute?.contact?.address}</p>

      <h3>Admission Enquiry</h3>
      <form className="grid gap-3 rounded-xl border border-slate-300 bg-white p-4" onSubmit={onSubmit}>
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
          placeholder="Email"
          className={INPUT}
          required
        />
        <input
          name="phone"
          value={formData.phone}
          onChange={onChange}
          placeholder="Phone"
          className={INPUT}
          required
        />
        <input
          name="program_interest"
          value={formData.program_interest}
          onChange={onChange}
          placeholder="Program Interest"
          className={INPUT}
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={onChange}
          placeholder="Tell us your goal"
          className={INPUT}
          rows={4}
          required
        />
        <button type="submit" className={PRIMARY_BUTTON}>
          Submit Enquiry
        </button>
      </form>
      {status ? <p className={MUTED_TEXT}>{status}</p> : null}
    </section>
  );
}
