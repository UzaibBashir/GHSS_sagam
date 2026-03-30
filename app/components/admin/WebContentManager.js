import { useState } from "react";
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
import { fileToOptimizedDataUrl } from "../../lib/imageUpload";
import LoadingSpinner from "../common/LoadingSpinner";

const EMPTY = {
  hero_slides: [],
  home_highlights: { stats: [], reasons: [] },
  home_front_desk: { title: "", items: [] },
  home_achievements: [],
  home_student_achievements: [],
  home_resources: [],
  admission_content: { sessionYear: "2026", guidelines: [], eligibility: [], requiredDocuments: [] },
};

const EMPTY_SLIDE = { src: "", title: "", subtitle: "" };
const EMPTY_STAT = { value: "", label: "" };
const EMPTY_RESOURCE = { title: "", description: "", href: "", label: "" };
const EMPTY_STUDENT_ACHIEVEMENT = { name: "", className: "", title: "", description: "", photo: "" };

function parseLines(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toLines(items) {
  return (items || []).join("\n");
}

function normalizeStudentAchievements(items) {
  return (items || [])
    .map((item) => ({
      name: String(item?.name || "").trim(),
      className: String(item?.className || "").trim(),
      title: String(item?.title || "").trim(),
      description: String(item?.description || "").trim(),
      photo: String(item?.photo || "").trim(),
    }))
    .filter((item) => item.title && item.description)
    .map((item) => ({ ...item, name: item.name || "Student Achievement", className: item.className || "Student Recognition" }));
}


function buildDraft(institute) {
  return {
    ...EMPTY,
    hero_slides: institute?.hero_slides || [],
    home_highlights: {
      stats: institute?.home_highlights?.stats || [],
      reasons: institute?.home_highlights?.reasons || [],
    },
    home_front_desk: {
      title: institute?.home_front_desk?.title || "",
      items: institute?.home_front_desk?.items || [],
    },
    home_achievements: institute?.home_achievements || [],
    home_student_achievements: institute?.home_student_achievements || [],
    home_resources: institute?.home_resources || [],
    admission_content: {
      sessionYear: institute?.admission_content?.sessionYear || "2026",
      guidelines: institute?.admission_content?.guidelines || [],
      eligibility: institute?.admission_content?.eligibility || [],
      requiredDocuments: institute?.admission_content?.requiredDocuments || [],
    },
  };
}

export default function WebContentManager({ institute, onSave, view = "all" }) {
  const initialDraft = buildDraft(institute);
  const [draft, setDraft] = useState(() => initialDraft);
  const [reasonsText, setReasonsText] = useState(() => toLines(initialDraft.home_highlights.reasons));
  const [frontDeskItemsText, setFrontDeskItemsText] = useState(() => toLines(initialDraft.home_front_desk.items));
  const [achievementsText, setAchievementsText] = useState(() => toLines(initialDraft.home_achievements));
  const [guidelinesText, setGuidelinesText] = useState(() => toLines(initialDraft.admission_content.guidelines));
  const [eligibilityText, setEligibilityText] = useState(() => toLines(initialDraft.admission_content.eligibility));
  const [documentsText, setDocumentsText] = useState(() => toLines(initialDraft.admission_content.requiredDocuments));
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const saveAll = () => {
    onSave({
      hero_slides: draft.hero_slides,
      home_highlights: {
        ...draft.home_highlights,
        reasons: parseLines(reasonsText),
      },
      home_front_desk: {
        ...draft.home_front_desk,
        items: parseLines(frontDeskItemsText),
      },
      home_achievements: parseLines(achievementsText),
      home_student_achievements: normalizeStudentAchievements(draft.home_student_achievements),
      home_resources: draft.home_resources,
      admission_content: {
        ...draft.admission_content,
        guidelines: parseLines(guidelinesText),
        eligibility: parseLines(eligibilityText),
        requiredDocuments: parseLines(documentsText),
      },
    });
  };

  const showSlideshow = view === "all" || view === "slideshow";
  const showContent = view === "all" || view === "content";

  return (
    <section className={ADMIN_SECTION} id="web-content">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Website Content</h2>
        <p className={ADMIN_SECTION_DESC}>Edit dynamic homepage and admission page content stored in database.</p>
      </div>
      {uploadBusy ? <LoadingSpinner label="Uploading image" size="sm" /> : null}
      {uploadMessage ? <p className="text-xs font-medium text-emerald-700">{uploadMessage}</p> : null}

      {showSlideshow ? (
      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Homepage slideshow</h3>
        <div className="mt-3 grid gap-3">
          {(draft.hero_slides || []).map((item, index) => (
            <div key={`slide-${index}`} className="rounded-xl border border-slate-200 p-3">
              <div className="grid gap-3">
                <label className={ADMIN_LABEL}>
                  Upload slide image
                  <input
                    type="file"
                    accept="image/*"
                    className={ADMIN_INPUT}
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploadBusy(true);
                      setUploadMessage("");
                      let dataUrl;
            try {
              dataUrl = await fileToOptimizedDataUrl(file);
            } catch (error) {
              setUploadMessage(error?.message || "Image upload failed");
              alert(error?.message || "Image upload failed");
              setUploadBusy(false);
              return;
            }
                      const slides = [...(draft.hero_slides || [])];
                      slides[index] = { ...slides[index], src: dataUrl };
                      setDraft((prev) => ({ ...prev, hero_slides: slides }));
                      setUploadMessage("Slide image uploaded. Click 'Confirm changes' and confirm in overlay.");
                      setUploadBusy(false);
                    }}
                  />
                </label>
                {item.src ? (
                  <img src={item.src} alt={item.title || `Slide ${index + 1}`} className="h-20 w-32 rounded-lg object-cover border border-slate-200" />
                ) : null}
                <label className={ADMIN_LABEL}>
                  Slide title
                  <input
                    className={ADMIN_INPUT}
                    value={item.title}
                    onChange={(event) => {
                      const slides = [...(draft.hero_slides || [])];
                      slides[index] = { ...slides[index], title: event.target.value };
                      setDraft((prev) => ({ ...prev, hero_slides: slides }));
                    }}
                  />
                </label>
                <label className={ADMIN_LABEL}>
                  Slide subtitle
                  <textarea
                    rows={2}
                    className={ADMIN_TEXTAREA}
                    value={item.subtitle}
                    onChange={(event) => {
                      const slides = [...(draft.hero_slides || [])];
                      slides[index] = { ...slides[index], subtitle: event.target.value };
                      setDraft((prev) => ({ ...prev, hero_slides: slides }));
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  onClick={() => {
                    const slides = (draft.hero_slides || []).filter((_, slideIndex) => slideIndex !== index);
                    setDraft((prev) => ({ ...prev, hero_slides: slides }));
                  }}
                >
                  Remove slide
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={ADMIN_BUTTON}
            onClick={() => setDraft((prev) => ({ ...prev, hero_slides: [...(prev.hero_slides || []), EMPTY_SLIDE] }))}
          >
            Add slide
          </button>
        </div>
      </article>
      ) : null}

      {showContent ? (
      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Home highlights</h3>
        <div className="mt-3 grid gap-3">
          {(draft.home_highlights.stats || []).map((item, index) => (
            <div key={`stat-${index}`} className="grid gap-3 rounded-xl border border-slate-200 p-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className={ADMIN_LABEL}>
                  Stat value
                  <input
                    className={ADMIN_INPUT}
                    value={item.value}
                    onChange={(event) => {
                      const stats = [...(draft.home_highlights.stats || [])];
                      stats[index] = { ...stats[index], value: event.target.value };
                      setDraft((prev) => ({ ...prev, home_highlights: { ...prev.home_highlights, stats } }));
                    }}
                  />
                </label>
                <label className={ADMIN_LABEL}>
                  Stat label
                  <input
                    className={ADMIN_INPUT}
                    value={item.label}
                    onChange={(event) => {
                      const stats = [...(draft.home_highlights.stats || [])];
                      stats[index] = { ...stats[index], label: event.target.value };
                      setDraft((prev) => ({ ...prev, home_highlights: { ...prev.home_highlights, stats } }));
                    }}
                  />
                </label>
              </div>
              <button
                type="button"
                className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                onClick={() => {
                  const stats = (draft.home_highlights.stats || []).filter((_, statIndex) => statIndex !== index);
                  setDraft((prev) => ({ ...prev, home_highlights: { ...prev.home_highlights, stats } }));
                }}
              >
                Remove stat
              </button>
            </div>
          ))}
          <button
            type="button"
            className={ADMIN_BUTTON}
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                home_highlights: { ...prev.home_highlights, stats: [...(prev.home_highlights.stats || []), EMPTY_STAT] },
              }))
            }
          >
            Add stat
          </button>
          <label className={ADMIN_LABEL}>
            Why families choose us (one line per item)
            <textarea rows={5} className={ADMIN_TEXTAREA} value={reasonsText} onChange={(e) => setReasonsText(e.target.value)} />
          </label>
        </div>
      </article>
      ) : null}

      {showContent ? (
      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Front desk content</h3>
        <label className={ADMIN_LABEL}>
          Title
          <input
            className={ADMIN_INPUT}
            value={draft.home_front_desk.title}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                home_front_desk: { ...prev.home_front_desk, title: event.target.value },
              }))
            }
          />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Items (one line per item)
          <textarea rows={5} className={ADMIN_TEXTAREA} value={frontDeskItemsText} onChange={(e) => setFrontDeskItemsText(e.target.value)} />
        </label>
      </article>
      ) : null}

      {showContent ? (
      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Achievements</h3>
        <label className={ADMIN_LABEL}>
          Achievement lines
          <textarea rows={6} className={ADMIN_TEXTAREA} value={achievementsText} onChange={(e) => setAchievementsText(e.target.value)} />
        </label>
      </article>
      ) : null}

      {showContent ? (
      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Student achievement cards</h3>
        <div className="mt-3 grid gap-3">
          {(draft.home_student_achievements || []).map((item, index) => (
            <div key={`student-achievement-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className={ADMIN_LABEL}>
                    Student name
                    <input
                      className={ADMIN_INPUT}
                      value={item.name || ""}
                      onChange={(event) => {
                        const items = [...(draft.home_student_achievements || [])];
                        items[index] = { ...items[index], name: event.target.value };
                        setDraft((prev) => ({ ...prev, home_student_achievements: items }));
                      }}
                    />
                  </label>
                  <label className={ADMIN_LABEL}>
                    Class / stream
                    <input
                      className={ADMIN_INPUT}
                      value={item.className || ""}
                      onChange={(event) => {
                        const items = [...(draft.home_student_achievements || [])];
                        items[index] = { ...items[index], className: event.target.value };
                        setDraft((prev) => ({ ...prev, home_student_achievements: items }));
                      }}
                    />
                  </label>
                </div>

                <label className={ADMIN_LABEL}>
                  Achievement title
                  <input
                    className={ADMIN_INPUT}
                    value={item.title || ""}
                    onChange={(event) => {
                      const items = [...(draft.home_student_achievements || [])];
                      items[index] = { ...items[index], title: event.target.value };
                      setDraft((prev) => ({ ...prev, home_student_achievements: items }));
                    }}
                  />
                </label>

                <label className={ADMIN_LABEL}>
                  Description
                  <textarea
                    rows={3}
                    className={ADMIN_TEXTAREA}
                    value={item.description || ""}
                    onChange={(event) => {
                      const items = [...(draft.home_student_achievements || [])];
                      items[index] = { ...items[index], description: event.target.value };
                      setDraft((prev) => ({ ...prev, home_student_achievements: items }));
                    }}
                  />
                </label>

                <label className={ADMIN_LABEL}>
                  Upload student photo
                  <input
                    type="file"
                    accept="image/*"
                    className={ADMIN_INPUT}
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setUploadBusy(true);
                      setUploadMessage("");
                      let dataUrl;
            try {
              dataUrl = await fileToOptimizedDataUrl(file);
            } catch (error) {
              setUploadMessage(error?.message || "Image upload failed");
              alert(error?.message || "Image upload failed");
              setUploadBusy(false);
              return;
            }
                      const items = [...(draft.home_student_achievements || [])];
                      items[index] = { ...items[index], photo: dataUrl };
                      setDraft((prev) => ({ ...prev, home_student_achievements: items }));
                      setUploadMessage("Student photo uploaded. Click 'Confirm changes' and confirm in overlay.");
                      setUploadBusy(false);
                    }}
                  />
                </label>

                {item.photo ? (
                  <img
                    src={item.photo}
                    alt={item.name || `Student achievement ${index + 1}`}
                    className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                  />
                ) : null}

                <button
                  type="button"
                  className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  onClick={() => {
                    const items = (draft.home_student_achievements || []).filter((_, itemIndex) => itemIndex !== index);
                    setDraft((prev) => ({ ...prev, home_student_achievements: items }));
                  }}
                >
                  Remove card
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className={ADMIN_BUTTON}
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                home_student_achievements: [...(prev.home_student_achievements || []), EMPTY_STUDENT_ACHIEVEMENT],
              }))
            }
          >
            Add student achievement card
          </button>
        </div>
      </article>
      ) : null}

      {showContent ? (
      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Resources</h3>
        <div className="mt-3 grid gap-3">
          {(draft.home_resources || []).map((item, index) => (
            <div key={`resource-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="grid gap-3">
                <label className={ADMIN_LABEL}>
                  Title
                  <input className={ADMIN_INPUT} value={item.title} onChange={(e) => {
                    const items = [...draft.home_resources];
                    items[index] = { ...items[index], title: e.target.value };
                    setDraft((prev) => ({ ...prev, home_resources: items }));
                  }} />
                </label>
                <label className={ADMIN_LABEL}>
                  Description
                  <textarea rows={2} className={ADMIN_TEXTAREA} value={item.description} onChange={(e) => {
                    const items = [...draft.home_resources];
                    items[index] = { ...items[index], description: e.target.value };
                    setDraft((prev) => ({ ...prev, home_resources: items }));
                  }} />
                </label>
                <label className={ADMIN_LABEL}>
                  Link URL
                  <input className={ADMIN_INPUT} value={item.href} onChange={(e) => {
                    const items = [...draft.home_resources];
                    items[index] = { ...items[index], href: e.target.value };
                    setDraft((prev) => ({ ...prev, home_resources: items }));
                  }} />
                </label>
                <label className={ADMIN_LABEL}>
                  Button label
                  <input className={ADMIN_INPUT} value={item.label} onChange={(e) => {
                    const items = [...draft.home_resources];
                    items[index] = { ...items[index], label: e.target.value };
                    setDraft((prev) => ({ ...prev, home_resources: items }));
                  }} />
                </label>
                <button
                  type="button"
                  className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  onClick={() => {
                    const items = (draft.home_resources || []).filter((_, resourceIndex) => resourceIndex !== index);
                    setDraft((prev) => ({ ...prev, home_resources: items }));
                  }}
                >
                  Remove resource
                </button>
              </div>
            </div>
          ))}
          <button type="button" className={ADMIN_BUTTON} onClick={() => setDraft((prev) => ({ ...prev, home_resources: [...(prev.home_resources || []), EMPTY_RESOURCE] }))}>
            Add resource
          </button>
        </div>
      </article>
      ) : null}

      {showContent ? (
      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Admission page content</h3>
        <label className={ADMIN_LABEL}>
          Session year
          <input
            className={ADMIN_INPUT}
            value={draft.admission_content.sessionYear}
            onChange={(event) =>
              setDraft((prev) => ({
                ...prev,
                admission_content: { ...prev.admission_content, sessionYear: event.target.value },
              }))
            }
          />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Guidelines (one line per item)
          <textarea rows={6} className={ADMIN_TEXTAREA} value={guidelinesText} onChange={(e) => setGuidelinesText(e.target.value)} />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Eligibility (one line per item)
          <textarea rows={5} className={ADMIN_TEXTAREA} value={eligibilityText} onChange={(e) => setEligibilityText(e.target.value)} />
        </label>
        <label className={`${ADMIN_LABEL} mt-3`}>
          Required documents (one line per item)
          <textarea rows={5} className={ADMIN_TEXTAREA} value={documentsText} onChange={(e) => setDocumentsText(e.target.value)} />
        </label>
      </article>
      ) : null}

      <button type="button" className={`${ADMIN_BUTTON} mt-4`} onClick={saveAll}>
        Confirm changes
      </button>
    </section>
  );
}









