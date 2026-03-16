import { useEffect, useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
  ADMIN_TEXTAREA,
} from "./adminStyles";

const EMPTY_PROFILE = {
  name: "",
  tagline: "",
  description: "",
  about_us: "",
  contact: {
    email: "",
    phone: "",
    address: "",
  },
};

export default function InstituteProfileManager({ institute, onSave }) {
  const [draft, setDraft] = useState(EMPTY_PROFILE);

  useEffect(() => {
    setDraft({
      ...EMPTY_PROFILE,
      ...institute,
      contact: {
        ...EMPTY_PROFILE.contact,
        ...(institute?.contact || {}),
      },
    });
  }, [institute]);

  return (
    <section className={ADMIN_SECTION} id="profile">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Institute Profile</h2>
        <p className={ADMIN_SECTION_DESC}>
          Update the name, tagline, and core description shown across the website.
        </p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <div className="grid gap-3">
          <label className={ADMIN_LABEL}>
            Institute name
            <input
              className={ADMIN_INPUT}
              value={draft.name}
              onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
            />
          </label>
          <label className={ADMIN_LABEL}>
            Tagline
            <input
              className={ADMIN_INPUT}
              value={draft.tagline}
              onChange={(event) => setDraft((prev) => ({ ...prev, tagline: event.target.value }))}
            />
          </label>
          <label className={ADMIN_LABEL}>
            Short description
            <textarea
              rows={3}
              className={ADMIN_TEXTAREA}
              value={draft.description}
              onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
            />
          </label>
          <label className={ADMIN_LABEL}>
            About the institute
            <textarea
              rows={4}
              className={ADMIN_TEXTAREA}
              value={draft.about_us}
              onChange={(event) => setDraft((prev) => ({ ...prev, about_us: event.target.value }))}
            />
          </label>
        </div>
      </article>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Contact information</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Email
            <input
              className={ADMIN_INPUT}
              value={draft.contact.email}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: event.target.value },
                }))
              }
            />
          </label>
          <label className={ADMIN_LABEL}>
            Phone
            <input
              className={ADMIN_INPUT}
              value={draft.contact.phone}
              onChange={(event) =>
                setDraft((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phone: event.target.value },
                }))
              }
            />
          </label>
        </div>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Address
          <textarea
            rows={2}
            className={ADMIN_TEXTAREA}
            value={draft.contact.address}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                contact: { ...prev.contact, address: event.target.value },
              }))
            }
          />
        </label>
      </article>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(draft)}>
        Save profile details
      </button>
    </section>
  );
}
