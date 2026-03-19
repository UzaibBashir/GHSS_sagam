import { useEffect, useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_DANGER,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
  ADMIN_TEXTAREA,
} from "./adminStyles";

const EMPTY_PROFILE = {
  description: "",
  about_us: "",
  facilities: [],
  contact: {
    email: "",
    phone: "",
    address: "",
  },
};

export default function InstituteProfileManager({ institute, onSave }) {
  const [draft, setDraft] = useState(EMPTY_PROFILE);
  const [newFacility, setNewFacility] = useState("");

  useEffect(() => {
    setDraft({
      description: String(institute?.description || ""),
      about_us: String(institute?.about_us || ""),
      facilities: Array.isArray(institute?.facilities) ? institute.facilities : [],
      contact: {
        email: String(institute?.contact?.email || ""),
        phone: String(institute?.contact?.phone || ""),
        address: String(institute?.contact?.address || ""),
      },
    });
  }, [institute]);

  return (
    <section className={ADMIN_SECTION} id="profile">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Institute Profile</h2>
        <p className={ADMIN_SECTION_DESC}>
          Update core institute description, contact details, and facilities shown across the website.
        </p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <div className="grid gap-3">
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

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Facilities</h3>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Add facility
          <input
            className={ADMIN_INPUT}
            value={newFacility}
            onChange={(event) => setNewFacility(event.target.value)}
            placeholder="Example: Science labs and practical resources"
          />
        </label>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!newFacility.trim()) return;
            setDraft((prev) => ({ ...prev, facilities: [newFacility.trim(), ...(prev.facilities || [])] }));
            setNewFacility("");
          }}
        >
          Add facility
        </button>

        <div className="mt-4 grid gap-3">
          {(draft.facilities || []).map((item, index) => (
            <article className={ADMIN_SUBCARD} key={`${item}-${index}`}>
              <label className={ADMIN_LABEL}>
                Facility
                <input
                  className={ADMIN_INPUT}
                  value={item}
                  onChange={(event) =>
                    setDraft((prev) => ({
                      ...prev,
                      facilities: (prev.facilities || []).map((entry, idx) =>
                        idx === index ? event.target.value : entry
                      ),
                    }))
                  }
                />
              </label>
              <button
                className={`${ADMIN_BUTTON_DANGER} mt-3`}
                onClick={() =>
                  setDraft((prev) => ({
                    ...prev,
                    facilities: (prev.facilities || []).filter((_, idx) => idx !== index),
                  }))
                }
              >
                Remove facility
              </button>
            </article>
          ))}
        </div>
      </article>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(draft)}>
        Save profile details
      </button>
    </section>
  );
}
