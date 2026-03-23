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

const ONE_MB = 1024 * 1024;

const EMPTY_NOTICE = {
  headline: "",
  description: "",
  time: "",
  class_name: "",
  stream: "",
  image_url: "",
  link_label: "",
  link_url: "",
};

const EMPTY_TIMETABLE = {
  period: "",
  time: "",
  detail: "",
  class_name: "",
  stream: "",
};

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesClassStream(item, classFilter, streamFilter) {
  const itemClass = normalizeText(item?.class_name);
  const itemStream = normalizeText(item?.stream);
  const classMatch = !classFilter || itemClass === normalizeText(classFilter);
  const streamMatch = !streamFilter || itemStream === normalizeText(streamFilter);
  return classMatch && streamMatch;
}

function isPdfAttachment(value) {
  const text = String(value || "").trim().toLowerCase();
  return text.startsWith("data:application/pdf") || text.includes(".pdf");
}

async function fileToDataUrl(file) {
  if (!file) {
    throw new Error("Image file is required");
  }

  if (String(file.type || "").startsWith("image/") && file.size > ONE_MB) {
    throw new Error("Image must be less than 1 MB");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Image read failed"));
    reader.readAsDataURL(file);
  });
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

  return <img src={value} alt={title || "Noticeboard attachment"} className="mt-2 h-28 rounded-xl border border-slate-200 object-cover" />;
}

function NoticeboardEditor({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <article className={ADMIN_SUBCARD}>
      <label className={ADMIN_LABEL}>
        Headline
        <input
          className={ADMIN_INPUT}
          value={draft.headline}
          onChange={(event) => setDraft((prev) => ({ ...prev, headline: event.target.value }))}
          placeholder="Headline"
        />
      </label>
      <label className={ADMIN_LABEL}>
        Description
        <textarea
          rows={3}
          className={ADMIN_TEXTAREA}
          value={draft.description}
          onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Description"
        />
      </label>
      <label className={ADMIN_LABEL}>
        Time
        <input
          className={ADMIN_INPUT}
          value={draft.time}
          onChange={(event) => setDraft((prev) => ({ ...prev, time: event.target.value }))}
          placeholder="09:00 AM"
        />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={ADMIN_LABEL}>
          Class
          <input
            className={ADMIN_INPUT}
            value={draft.class_name}
            onChange={(event) => setDraft((prev) => ({ ...prev, class_name: event.target.value }))}
            placeholder="Class XI"
          />
        </label>
        <label className={ADMIN_LABEL}>
          Stream
          <input
            className={ADMIN_INPUT}
            value={draft.stream}
            onChange={(event) => setDraft((prev) => ({ ...prev, stream: event.target.value }))}
            placeholder="Medical"
          />
        </label>
      </div>

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
              dataUrl = await fileToDataUrl(file);
            } catch (error) {
              alert(error?.message || "Image upload failed");
              return;
            }
            setDraft((prev) => ({ ...prev, image_url: dataUrl }));
          }}
        />
      </label>
      <AttachmentPreview value={draft.image_url} title={draft.headline} />
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
            className={ADMIN_INPUT}
            value={draft.link_url || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, link_url: event.target.value }))}
            placeholder="https://... or /page"
          />
        </label>
        <label className={ADMIN_LABEL}>
          Link label (optional)
          <input
            className={ADMIN_INPUT}
            value={draft.link_label || ""}
            onChange={(event) => setDraft((prev) => ({ ...prev, link_label: event.target.value }))}
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

function TimetableRow({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <tr className="border-t border-slate-200">
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.period}
          onChange={(event) => setDraft((prev) => ({ ...prev, period: event.target.value }))}
          placeholder="1"
        />
      </td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.time}
          onChange={(event) => setDraft((prev) => ({ ...prev, time: event.target.value }))}
          placeholder="09:00 - 09:45"
        />
      </td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.detail}
          onChange={(event) => setDraft((prev) => ({ ...prev, detail: event.target.value }))}
          placeholder="Core subject"
        />
      </td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.class_name}
          onChange={(event) => setDraft((prev) => ({ ...prev, class_name: event.target.value }))}
          placeholder="Class XI"
        />
      </td>
      <td className="px-3 py-2">
        <input
          className={ADMIN_INPUT}
          value={draft.stream}
          onChange={(event) => setDraft((prev) => ({ ...prev, stream: event.target.value }))}
          placeholder="Medical"
        />
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-2">
          <button className={ADMIN_BUTTON} onClick={() => onSave(item.id, draft)}>
            Save
          </button>
          <button className={ADMIN_BUTTON_DANGER} onClick={() => onRemove(item.id)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AcademicsManager({
  academicContent,
  onAddNoticeboard,
  onSaveNoticeboard,
  onRemoveNoticeboard,
  onAddTimetable,
  onSaveTimetable,
  onRemoveTimetable,
}) {
  const [noticeForm, setNoticeForm] = useState(EMPTY_NOTICE);
  const [timetableForm, setTimetableForm] = useState(EMPTY_TIMETABLE);
  const [classFilter, setClassFilter] = useState("");
  const [streamFilter, setStreamFilter] = useState("");

  const noticeboardItems = academicContent?.noticeboard || [];
  const timetableItems = academicContent?.timetable || [];

  const filteredNoticeboard = useMemo(
    () => noticeboardItems.filter((item) => matchesClassStream(item, classFilter, streamFilter)),
    [noticeboardItems, classFilter, streamFilter]
  );

  const filteredTimetable = useMemo(
    () => timetableItems.filter((item) => matchesClassStream(item, classFilter, streamFilter)),
    [timetableItems, classFilter, streamFilter]
  );

  return (
    <section className={ADMIN_SECTION} id="academic-noticeboard">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Academic Noticeboard & Timetable</h2>
        <p className={ADMIN_SECTION_DESC}>Maintain class-wise and stream-wise announcements and timetable rows.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Filter by class & stream</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Class filter
            <input
              className={ADMIN_INPUT}
              value={classFilter}
              onChange={(event) => setClassFilter(event.target.value)}
              placeholder="All classes or Class XI"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Stream filter
            <input
              className={ADMIN_INPUT}
              value={streamFilter}
              onChange={(event) => setStreamFilter(event.target.value)}
              placeholder="All streams or Medical"
            />
          </label>
        </div>
      </article>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Add noticeboard item</h3>
        <label className={ADMIN_LABEL}>
          Headline
          <input
            className={ADMIN_INPUT}
            value={noticeForm.headline}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, headline: event.target.value }))}
            placeholder="Headline"
          />
        </label>
        <label className={ADMIN_LABEL}>
          Description
          <textarea
            rows={3}
            className={ADMIN_TEXTAREA}
            value={noticeForm.description}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Description"
          />
        </label>
        <label className={ADMIN_LABEL}>
          Time
          <input
            className={ADMIN_INPUT}
            value={noticeForm.time}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, time: event.target.value }))}
            placeholder="09:00 AM"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Class
            <input
              className={ADMIN_INPUT}
              value={noticeForm.class_name}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, class_name: event.target.value }))}
              placeholder="Class XI"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Stream
            <input
              className={ADMIN_INPUT}
              value={noticeForm.stream}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, stream: event.target.value }))}
              placeholder="Medical"
            />
          </label>
        </div>

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
              dataUrl = await fileToDataUrl(file);
            } catch (error) {
              alert(error?.message || "Image upload failed");
              return;
            }
              setNoticeForm((prev) => ({ ...prev, image_url: dataUrl }));
            }}
          />
        </label>
        <AttachmentPreview value={noticeForm.image_url} title={noticeForm.headline} />
        {noticeForm.image_url ? (
          <button
            type="button"
            className="mt-2 rounded-full border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            onClick={() => setNoticeForm((prev) => ({ ...prev, image_url: "" }))}
          >
            Remove attachment
          </button>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className={ADMIN_LABEL}>
            Link URL (optional)
            <input
              className={ADMIN_INPUT}
              value={noticeForm.link_url}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, link_url: event.target.value }))}
              placeholder="https://... or /page"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Link label (optional)
            <input
              className={ADMIN_INPUT}
              value={noticeForm.link_label}
              onChange={(event) => setNoticeForm((prev) => ({ ...prev, link_label: event.target.value }))}
              placeholder="Open link"
            />
          </label>
        </div>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            onAddNoticeboard(noticeForm);
            setNoticeForm(EMPTY_NOTICE);
          }}
        >
          Add noticeboard item
        </button>
      </article>

      <div className="mt-4 grid gap-3">
        {filteredNoticeboard.map((item) => (
          <NoticeboardEditor key={item.id} item={item} onSave={onSaveNoticeboard} onRemove={onRemoveNoticeboard} />
        ))}
        {!filteredNoticeboard.length ? (
          <article className={ADMIN_SUBCARD}>No noticeboard items for selected class/stream.</article>
        ) : null}
      </div>

      <article className={`${ADMIN_SUBCARD} mt-6`}>
        <h3 className="text-base font-semibold text-slate-900">Add timetable row</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className={ADMIN_LABEL}>
            Period
            <input
              className={ADMIN_INPUT}
              value={timetableForm.period}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, period: event.target.value }))}
              placeholder="1"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Time
            <input
              className={ADMIN_INPUT}
              value={timetableForm.time}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, time: event.target.value }))}
              placeholder="09:00 - 09:45"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Detail
            <input
              className={ADMIN_INPUT}
              value={timetableForm.detail}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, detail: event.target.value }))}
              placeholder="Core subject"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Class
            <input
              className={ADMIN_INPUT}
              value={timetableForm.class_name}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, class_name: event.target.value }))}
              placeholder="Class XI"
            />
          </label>
          <label className={ADMIN_LABEL}>
            Stream
            <input
              className={ADMIN_INPUT}
              value={timetableForm.stream}
              onChange={(event) => setTimetableForm((prev) => ({ ...prev, stream: event.target.value }))}
              placeholder="Medical"
            />
          </label>
        </div>
        <button
          className={`${ADMIN_BUTTON} mt-3`}
          onClick={() => {
            onAddTimetable(timetableForm);
            setTimetableForm(EMPTY_TIMETABLE);
          }}
        >
          Add timetable row
        </button>
      </article>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] table-fixed border-collapse text-xs sm:text-sm">
          <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Period</th>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Detail</th>
              <th className="px-3 py-2">Class</th>
              <th className="px-3 py-2">Stream</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTimetable.map((item) => (
              <TimetableRow key={item.id} item={item} onSave={onSaveTimetable} onRemove={onRemoveTimetable} />
            ))}
          </tbody>
        </table>
        {!filteredTimetable.length ? (
          <article className={`${ADMIN_SUBCARD} mt-3`}>No timetable rows for selected class/stream.</article>
        ) : null}
      </div>
    </section>
  );
}






