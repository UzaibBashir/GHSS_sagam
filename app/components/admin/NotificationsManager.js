import { useState } from "react";
import { AUTO_FIT_GRID, CARD, DANGER_BUTTON, INPUT, PRIMARY_BUTTON } from "../../lib/uiClasses";

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
    <article className={CARD}>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={draft.title}
          onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
          className={INPUT}
          placeholder="Title"
        />
        <input
          value={draft.category}
          onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
          className={INPUT}
          placeholder="Category"
        />
      </div>
      <input
        value={draft.date}
        onChange={(event) => setDraft((prev) => ({ ...prev, date: event.target.value }))}
        className={INPUT}
        placeholder="Date (YYYY-MM-DD)"
      />
      <textarea
        rows={2}
        value={draft.summary}
        onChange={(event) => setDraft((prev) => ({ ...prev, summary: event.target.value }))}
        className={INPUT}
        placeholder="Headline summary"
      />
      <textarea
        rows={4}
        value={draft.details}
        onChange={(event) => setDraft((prev) => ({ ...prev, details: event.target.value }))}
        className={INPUT}
        placeholder="Full notification details"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={draft.image_url || ""}
          onChange={(event) => setDraft((prev) => ({ ...prev, image_url: event.target.value }))}
          className={INPUT}
          placeholder="Image URL (optional)"
        />
        <input
          value={draft.link_url || ""}
          onChange={(event) => setDraft((prev) => ({ ...prev, link_url: event.target.value }))}
          className={INPUT}
          placeholder="Link URL (optional)"
        />
      </div>
      <input
        value={draft.link_label || ""}
        onChange={(event) => setDraft((prev) => ({ ...prev, link_label: event.target.value }))}
        className={INPUT}
        placeholder="Link label (optional)"
      />

      <div className="flex flex-wrap gap-2">
        <button className={PRIMARY_BUTTON} onClick={() => onSave(item.id, draft)}>
          Save Changes
        </button>
        <button className={DANGER_BUTTON} onClick={() => onRemove(item.id)}>
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
    <section className={CARD}>
      <h2>Notifications (Full Details)</h2>
      <p className="m-0 text-sm text-slate-600">
        Add, update, and delete notification title, category, description, image, and link.
      </p>

      <article className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <h3 className="m-0 text-base font-bold text-slate-900">Add New Notification</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            className={INPUT}
            placeholder="Title"
          />
          <input
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            className={INPUT}
            placeholder="Category"
          />
        </div>
        <input
          value={form.date}
          onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
          className={INPUT}
          placeholder="Date (YYYY-MM-DD)"
        />
        <textarea
          rows={2}
          value={form.summary}
          onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
          className={INPUT}
          placeholder="Summary"
        />
        <textarea
          rows={4}
          value={form.details}
          onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
          className={INPUT}
          placeholder="Details"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={form.image_url}
            onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
            className={INPUT}
            placeholder="Image URL (optional)"
          />
          <input
            value={form.link_url}
            onChange={(event) => setForm((prev) => ({ ...prev, link_url: event.target.value }))}
            className={INPUT}
            placeholder="Link URL (optional)"
          />
        </div>
        <input
          value={form.link_label}
          onChange={(event) => setForm((prev) => ({ ...prev, link_label: event.target.value }))}
          className={INPUT}
          placeholder="Link label (optional)"
        />
        <button onClick={handleCreate} className={PRIMARY_BUTTON}>
          Add Notification
        </button>
      </article>

      <div className={AUTO_FIT_GRID}>
        {items.map((item) => (
          <NotificationEditor key={item.id} item={item} onSave={onSave} onRemove={onRemove} />
        ))}
      </div>
    </section>
  );
}
