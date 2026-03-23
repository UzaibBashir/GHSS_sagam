import { useMemo, useState } from "react";
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
import { fileToOptimizedDataUrl } from "../../lib/imageUpload";

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
const PAGE_SIZE = 8;

function isPdfAttachment(value) {
  const text = String(value || "").trim().toLowerCase();
  return text.startsWith("data:application/pdf") || text.includes(".pdf");
}


function AttachmentPreview({ value, title }) {
  if (!value) return null;

  if (isPdfAttachment(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
      >
        Open attached PDF
      </a>
    );
  }

  return <img src={value} alt={title || "Notification attachment"} className="mt-2 h-28 rounded-xl border border-slate-200 object-cover" />;
}

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

      <label className={ADMIN_LABEL}>
        Upload attachment (Image/PDF) (optional)
        <input
          type="file"
          accept="image/*,application/pdf"
          className={ADMIN_INPUT}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            let dataUrl;
            try {
              dataUrl = await fileToOptimizedDataUrl(file);
            } catch (error) {
              alert(error?.message || "Image upload failed");
              return;
            }
            setDraft((prev) => ({ ...prev, image_url: dataUrl }));
          }}
        />
      </label>
      <AttachmentPreview value={draft.image_url} title={draft.title} />
      {draft.image_url ? (
        <button
          type="button"
          className="mt-2 rounded-full border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
          onClick={() => setDraft((prev) => ({ ...prev, image_url: "" }))}
        >
          Remove attachment
        </button>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className={ADMIN_LABEL}>
          Link URL (optional)
          <input
            value={draft.link_url || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, link_url: event.target.value }))}
            className={ADMIN_INPUT}
            placeholder="https://... or /page"
          />
        </label>
        <label className={ADMIN_LABEL}>
          Link label (optional)
          <input
            value={draft.link_label || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, link_label: event.target.value }))}
            className={ADMIN_INPUT}
            placeholder="Open link"
          />
        </label>
      </div>

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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items || [];
    return (items || []).filter((item) =>
      [item.title, item.category, item.summary, item.details]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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

        <label className={ADMIN_LABEL}>
          Upload attachment (Image/PDF) (optional)
          <input
            type="file"
            accept="image/*,application/pdf"
            className={ADMIN_INPUT}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              let dataUrl;
            try {
              dataUrl = await fileToOptimizedDataUrl(file);
            } catch (error) {
              alert(error?.message || "Image upload failed");
              return;
            }
              setForm((prev) => ({ ...prev, image_url: dataUrl }));
            }}
          />
        </label>
        <AttachmentPreview value={form.image_url} title={form.title} />
        {form.image_url ? (
          <button
            type="button"
            className="mt-2 rounded-full border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            onClick={() => setForm((prev) => ({ ...prev, image_url: "" }))}
          >
            Remove attachment
          </button>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Link URL (optional)
            <input
              value={form.link_url}
              onChange={(event) => setForm((prev) => ({ ...prev, link_url: event.target.value }))}
              className={ADMIN_INPUT}
              placeholder="https://... or /page"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Link label (optional)
            <input
              value={form.link_label}
              onChange={(event) => setForm((prev) => ({ ...prev, link_label: event.target.value }))}
              className={ADMIN_INPUT}
              placeholder="Open link"
            />
          </label>
        </div>

        <button onClick={handleCreate} className={`${ADMIN_BUTTON} mt-3`}>
          Publish notification
        </button>
      </article>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <label className={ADMIN_LABEL}>
          Search notifications
          <input
            className={ADMIN_INPUT}
            placeholder="Search title, category, summary"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
        </label>
      </article>

      <div className="mt-4 grid gap-3">
        {pageItems.map((item) => (
          <NotificationEditor key={item.id} item={item} onSave={onSave} onRemove={onRemove} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <p>
          Showing {(pageItems.length && (safePage - 1) * PAGE_SIZE + 1) || 0}-{(safePage - 1) * PAGE_SIZE + pageItems.length} of {filteredItems.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={ADMIN_BUTTON}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage <= 1}
          >
            Previous
          </button>
          <span>Page {safePage} / {totalPages}</span>
          <button
            type="button"
            className={ADMIN_BUTTON}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}






