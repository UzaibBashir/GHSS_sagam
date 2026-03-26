import { useState } from "react";
import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_DANGER,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
} from "./adminStyles";

export default function FacilitiesManager({ facilities, onSave }) {
  const [items, setItems] = useState(() => facilities || []);
  const [newItem, setNewItem] = useState("");

  return (
    <section className={ADMIN_SECTION} id="facilities">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Facilities & Support</h2>
        <p className={ADMIN_SECTION_DESC}>List the facilities and support services available on campus.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <label className={ADMIN_LABEL}>
          Add new facility
          <input
            className={ADMIN_INPUT}
            value={newItem}
            onChange={(event) => setNewItem(event.target.value)}
            placeholder="Example: Science labs and practical resources"
          />
        </label>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            if (!newItem.trim()) return;
            setItems((prev) => [newItem.trim(), ...prev]);
            setNewItem("");
          }}
        >
          Add facility
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {items.map((item, index) => (
          <article className={ADMIN_SUBCARD} key={`${item}-${index}`}>
            <label className={ADMIN_LABEL}>
              Facility
              <input
                className={ADMIN_INPUT}
                value={item}
                onChange={(event) =>
                  setItems((prev) => prev.map((entry, idx) => (idx === index ? event.target.value : entry)))
                }
              />
            </label>
            <button
              className={`${ADMIN_BUTTON_DANGER} mt-3`}
              onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== index))}
            >
              Remove facility
            </button>
          </article>
        ))}
      </div>

      <button className={`${ADMIN_BUTTON} mt-4`} onClick={() => onSave(items)}>
        Update facilities
      </button>
    </section>
  );
}
