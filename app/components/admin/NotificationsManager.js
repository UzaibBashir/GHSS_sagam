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
  ADMIN_TEXTAREA,
} from "./adminStyles";

const EMPTY_FORM = {
  title: "",
  category: "",
  date: "",
  summary: "",
  details: "",
  image_url: "",
  link_label: "",
  link_url: "",
};

function NotificationEditor({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <article className={ADMIN_SUBCARD}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={ADMIN_LABEL}>
          Title
          <input
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            className={ADMIN_INPUT}
            placeholder="Title"
          />
        </label>
        <label className={ADMIN_LABEL}>
          Category
          <input
            value={draft.category}
            onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
            className={ADMIN_INPUT}
            placeholder="Category"
          />
        </label>
      </div>
      <label className={ADMIN_LABEL}>
        Date
        <input
          value={draft.date}
          onChange={(event) => setDraft((prev) => ({ ...prev, date: event.target.value }))}
          className={ADMIN_INPUT}
          placeholder="YYYY-MM-DD"
        />
      </label>
      <label className={ADMIN_LABEL}>
        Summary
        <textarea
          rows={2}
          value={draft.summary}
          onChange={(event) => setDraft((prev) => ({ ...prev, summary: event.target.value }))}
          className={ADMIN_TEXTAREA}
          placeholder="Short summary"
        />
      </label>
      <label className={ADMIN_LABEL}>
        Full details
        <textarea
          rows={4}
          value={draft.details}
          onChange={(event) => setDraft((prev) => ({ ...prev, details: event.target.value }))}
          className={ADMIN_TEXTAREA}
          placeholder="Full notification details"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={ADMIN_LABEL}>
          Image URL (optional)
          <input
            value={draft.image_url || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, image_url: event.target.value }))}
            className={ADMIN_INPUT}
            placeholder="https://..."
          />
        </label>
        <label className={ADMIN_LABEL}>
          Link URL (optional)
          <input
            value={draft.link_url || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, link_url: event.target.value }))}
            className={ADMIN_INPUT}
            placeholder="https://..."
          />
        </label>
      </div>
      <label className={ADMIN_LABEL}>
        Link label (optional)
        <input
          value={draft.link_label || ""}
          onChange={(event) => setDraft((prev) => ({ ...prev, link_label: event.target.value }))}
          className={ADMIN_INPUT}
          placeholder="Open link"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className={ADMIN_BUTTON} onClick={() => onSave(item.id, draft)}>
          Save changes
        </button>
        <button className={ADMIN_BUTTON_DANGER} onClick={() => onRemove(item.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default function NotificationsManager({ items, onAdd, onSave, onRemove }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleCreate = () => {
    onAdd(form);
    setForm(EMPTY_FORM);
  };

  return (
    <section className={ADMIN_SECTION} id="notifications">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Website Notifications</h2>
        <p className={ADMIN_SECTION_DESC}>
          Publish news and official notices that appear across the homepage and notifications page.
        </p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add new notification</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Title
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className={ADMIN_INPUT}
              placeholder="Title"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Category
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className={ADMIN_INPUT}
              placeholder="Admissions, Exams"
            />
          </label>
        </div>
        <label className={ADMIN_LABEL}>
          Date
          <input
            value={form.date}
            onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            className={ADMIN_INPUT}
            placeholder="YYYY-MM-DD"
          />
        </label>
        <label className={ADMIN_LABEL}>
          Summary
          <textarea
            rows={2}
            value={form.summary}
            onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
            className={ADMIN_TEXTAREA}
            placeholder="Short summary"
          />
        </label>
        <label className={ADMIN_LABEL}>
          Full details
          <textarea
            rows={4}
            value={form.details}
            onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
            className={ADMIN_TEXTAREA}
            placeholder="Full notification details"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Image URL (optional)
            <input
              value={form.image_url}
              onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
              className={ADMIN_INPUT}
              placeholder="https://..."
            />
          </label>
          <label className={ADMIN_LABEL}>
            Link URL (optional)
            <input
              value={form.link_url}
              onChange={(event) => setForm((prev) => ({ ...prev, link_url: event.target.value }))}
              className={ADMIN_INPUT}
              placeholder="https://..."
            />
          </label>
        </div>
        <label className={ADMIN_LABEL}>
          Link label (optional)
          <input
            value={form.link_label}
            onChange={(event) => setForm((prev) => ({ ...prev, link_label: event.target.value }))}
            className={ADMIN_INPUT}
            placeholder="Open link"
          />
        </label>
        <button onClick={handleCreate} className={`${ADMIN_BUTTON} mt-3`}>
          Publish notification
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <NotificationEditor key={item.id} item={item} onSave={onSave} onRemove={onRemove} />
        ))}
      </div>
    </section>
  );
}
