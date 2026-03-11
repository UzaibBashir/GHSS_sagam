import { useState } from "react";
import { CARD, DANGER_BUTTON, INPUT, PRIMARY_BUTTON } from "../../lib/uiClasses";

const EMPTY_NOTICE = {
  headline: "",
  description: "",
  time: "",
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

function NoticeboardEditor({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <article className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <input
        className={INPUT}
        value={draft.headline}
        onChange={(event) => setDraft((prev) => ({ ...prev, headline: event.target.value }))}
        placeholder="Headline"
      />
      <textarea
        rows={3}
        className={INPUT}
        value={draft.description}
        onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
        placeholder="Description"
      />
      <input
        className={INPUT}
        value={draft.time}
        onChange={(event) => setDraft((prev) => ({ ...prev, time: event.target.value }))}
        placeholder="Time"
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className={INPUT}
          value={draft.image_url || ""}
          onChange={(event) => setDraft((prev) => ({ ...prev, image_url: event.target.value }))}
          placeholder="Image URL"
        />
        <input
          className={INPUT}
          value={draft.link_url || ""}
          onChange={(event) => setDraft((prev) => ({ ...prev, link_url: event.target.value }))}
          placeholder="Link URL"
        />
      </div>
      <input
        className={INPUT}
        value={draft.link_label || ""}
        onChange={(event) => setDraft((prev) => ({ ...prev, link_label: event.target.value }))}
        placeholder="Link Label"
      />
      <div className="flex flex-wrap gap-2">
        <button className={PRIMARY_BUTTON} onClick={() => onSave(item.id, draft)}>
          Save
        </button>
        <button className={DANGER_BUTTON} onClick={() => onRemove(item.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

function TimetableEditor({ item, onSave, onRemove }) {
  const [draft, setDraft] = useState(item);

  return (
    <tr>
      <td className="border border-slate-200 px-2 py-1">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          value={draft.period}
          onChange={(event) => setDraft((prev) => ({ ...prev, period: event.target.value }))}
        />
      </td>
      <td className="border border-slate-200 px-2 py-1">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          value={draft.time}
          onChange={(event) => setDraft((prev) => ({ ...prev, time: event.target.value }))}
        />
      </td>
      <td className="border border-slate-200 px-2 py-1">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          value={draft.detail}
          onChange={(event) => setDraft((prev) => ({ ...prev, detail: event.target.value }))}
        />
      </td>
      <td className="border border-slate-200 px-2 py-1">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          value={draft.class_name}
          onChange={(event) => setDraft((prev) => ({ ...prev, class_name: event.target.value }))}
        />
      </td>
      <td className="border border-slate-200 px-2 py-1">
        <input
          className="w-full rounded border border-slate-300 px-2 py-1"
          value={draft.stream}
          onChange={(event) => setDraft((prev) => ({ ...prev, stream: event.target.value }))}
        />
      </td>
      <td className="border border-slate-200 px-2 py-1">
        <div className="flex gap-1">
          <button
            className="rounded bg-teal-700 px-2 py-1 text-xs font-bold text-white"
            onClick={() => onSave(item.id, draft)}
          >
            Save
          </button>
          <button
            className="rounded bg-red-700 px-2 py-1 text-xs font-bold text-white"
            onClick={() => onRemove(item.id)}
          >
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

  return (
    <section className={CARD}>
      <h2>Academics Management</h2>
      <p className="m-0 text-sm text-slate-600">Manage noticeboard and timetable content for academics page.</p>

      <article className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <h3 className="m-0 text-base font-bold text-slate-900">Noticeboard: Add Item</h3>
        <input
          className={INPUT}
          value={noticeForm.headline}
          onChange={(event) => setNoticeForm((prev) => ({ ...prev, headline: event.target.value }))}
          placeholder="Headline"
        />
        <textarea
          rows={3}
          className={INPUT}
          value={noticeForm.description}
          onChange={(event) => setNoticeForm((prev) => ({ ...prev, description: event.target.value }))}
          placeholder="Description"
        />
        <input
          className={INPUT}
          value={noticeForm.time}
          onChange={(event) => setNoticeForm((prev) => ({ ...prev, time: event.target.value }))}
          placeholder="Time"
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            className={INPUT}
            value={noticeForm.image_url}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, image_url: event.target.value }))}
            placeholder="Image URL"
          />
          <input
            className={INPUT}
            value={noticeForm.link_url}
            onChange={(event) => setNoticeForm((prev) => ({ ...prev, link_url: event.target.value }))}
            placeholder="Link URL"
          />
        </div>
        <input
          className={INPUT}
          value={noticeForm.link_label}
          onChange={(event) => setNoticeForm((prev) => ({ ...prev, link_label: event.target.value }))}
          placeholder="Link Label"
        />
        <button
          className={PRIMARY_BUTTON}
          onClick={() => {
            onAddNoticeboard(noticeForm);
            setNoticeForm(EMPTY_NOTICE);
          }}
        >
          Add Noticeboard Item
        </button>

        <div className="grid gap-2">
          {(academicContent?.noticeboard || []).map((item) => (
            <NoticeboardEditor key={item.id} item={item} onSave={onSaveNoticeboard} onRemove={onRemoveNoticeboard} />
          ))}
        </div>
      </article>

      <article className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <h3 className="m-0 text-base font-bold text-slate-900">Timetable: Add Row</h3>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className={INPUT}
            value={timetableForm.period}
            onChange={(event) => setTimetableForm((prev) => ({ ...prev, period: event.target.value }))}
            placeholder="Period"
          />
          <input
            className={INPUT}
            value={timetableForm.time}
            onChange={(event) => setTimetableForm((prev) => ({ ...prev, time: event.target.value }))}
            placeholder="Time"
          />
          <input
            className={INPUT}
            value={timetableForm.detail}
            onChange={(event) => setTimetableForm((prev) => ({ ...prev, detail: event.target.value }))}
            placeholder="Detail"
          />
          <input
            className={INPUT}
            value={timetableForm.class_name}
            onChange={(event) => setTimetableForm((prev) => ({ ...prev, class_name: event.target.value }))}
            placeholder="Class"
          />
          <input
            className={INPUT}
            value={timetableForm.stream}
            onChange={(event) => setTimetableForm((prev) => ({ ...prev, stream: event.target.value }))}
            placeholder="Stream"
          />
        </div>
        <button
          className={PRIMARY_BUTTON}
          onClick={() => {
            onAddTimetable(timetableForm);
            setTimetableForm(EMPTY_TIMETABLE);
          }}
        >
          Add Timetable Row
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-800">
                <th className="border border-slate-200 px-2 py-1">Period</th>
                <th className="border border-slate-200 px-2 py-1">Time</th>
                <th className="border border-slate-200 px-2 py-1">Detail</th>
                <th className="border border-slate-200 px-2 py-1">Class</th>
                <th className="border border-slate-200 px-2 py-1">Stream</th>
                <th className="border border-slate-200 px-2 py-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(academicContent?.timetable || []).map((item) => (
                <TimetableEditor key={item.id} item={item} onSave={onSaveTimetable} onRemove={onRemoveTimetable} />
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
