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

const EMPTY = {
  hero_slides: [],
  home_highlights: { stats: [], reasons: [] },
  home_front_desk: { title: "", items: [] },
  home_achievements: [],
  home_resources: [],
  home_testimonials: [],
  admission_content: { sessionYear: "2026", guidelines: [], eligibility: [], requiredDocuments: [] },
};

const EMPTY_SLIDE = { src: "", title: "", subtitle: "" };
const EMPTY_STAT = { value: "", label: "" };
const EMPTY_RESOURCE = { title: "", description: "", href: "", label: "" };
const EMPTY_TESTIMONIAL = { name: "", role: "", quote: "" };

function parseLines(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toLines(items) {
  return (items || []).join("\n");
}

export default function WebContentManager({ institute, onSave }) {
  const [draft, setDraft] = useState(EMPTY);
  const [reasonsText, setReasonsText] = useState("");
  const [frontDeskItemsText, setFrontDeskItemsText] = useState("");
  const [achievementsText, setAchievementsText] = useState("");
  const [guidelinesText, setGuidelinesText] = useState("");
  const [eligibilityText, setEligibilityText] = useState("");
  const [documentsText, setDocumentsText] = useState("");

  useEffect(() => {
    const next = {
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
      home_resources: institute?.home_resources || [],
      home_testimonials: institute?.home_testimonials || [],
      admission_content: {
        sessionYear: institute?.admission_content?.sessionYear || "2026",
        guidelines: institute?.admission_content?.guidelines || [],
        eligibility: institute?.admission_content?.eligibility || [],
        requiredDocuments: institute?.admission_content?.requiredDocuments || [],
      },
    };

    setDraft(next);
    setReasonsText(toLines(next.home_highlights.reasons));
    setFrontDeskItemsText(toLines(next.home_front_desk.items));
    setAchievementsText(toLines(next.home_achievements));
    setGuidelinesText(toLines(next.admission_content.guidelines));
    setEligibilityText(toLines(next.admission_content.eligibility));
    setDocumentsText(toLines(next.admission_content.requiredDocuments));
  }, [institute]);

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
      home_resources: draft.home_resources,
      home_testimonials: draft.home_testimonials,
      admission_content: {
        ...draft.admission_content,
        guidelines: parseLines(guidelinesText),
        eligibility: parseLines(eligibilityText),
        requiredDocuments: parseLines(documentsText),
      },
    });
  };

  return (
    <section className={ADMIN_SECTION} id="web-content">
      <div>
        <h2 className={ADMIN_SECTION_TITLE}>Website Content</h2>
        <p className={ADMIN_SECTION_DESC}>Edit dynamic homepage and admission page content stored in database.</p>
      </div>

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Homepage slideshow</h3>
        <div className="mt-3 grid gap-3">
          {(draft.hero_slides || []).map((item, index) => (
            <div key={`slide-${index}`} className="rounded-xl border border-slate-200 p-3">
              <div className="grid gap-3">
                <label className={ADMIN_LABEL}>
                  Image URL or path
                  <input
                    className={ADMIN_INPUT}
                    value={item.src}
                    onChange={(event) => {
                      const slides = [...(draft.hero_slides || [])];
                      slides[index] = { ...slides[index], src: event.target.value };
                      setDraft((prev) => ({ ...prev, hero_slides: slides }));
                    }}
                    placeholder="/slideshow/slide1.jpeg"
                  />
                </label>
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

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Achievements</h3>
        <label className={ADMIN_LABEL}>
          Achievement lines
          <textarea rows={6} className={ADMIN_TEXTAREA} value={achievementsText} onChange={(e) => setAchievementsText(e.target.value)} />
        </label>
      </article>

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

      <article className={`${ADMIN_SUBCARD} mt-4`}>
        <h3 className="text-base font-semibold text-slate-900">Testimonials</h3>
        <div className="mt-3 grid gap-3">
          {(draft.home_testimonials || []).map((item, index) => (
            <div key={`testimonial-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="grid gap-3">
                <label className={ADMIN_LABEL}>
                  Name
                  <input className={ADMIN_INPUT} value={item.name} onChange={(e) => {
                    const items = [...draft.home_testimonials];
                    items[index] = { ...items[index], name: e.target.value };
                    setDraft((prev) => ({ ...prev, home_testimonials: items }));
                  }} />
                </label>
                <label className={ADMIN_LABEL}>
                  Role
                  <input className={ADMIN_INPUT} value={item.role} onChange={(e) => {
                    const items = [...draft.home_testimonials];
                    items[index] = { ...items[index], role: e.target.value };
                    setDraft((prev) => ({ ...prev, home_testimonials: items }));
                  }} />
                </label>
                <label className={ADMIN_LABEL}>
                  Quote
                  <textarea rows={3} className={ADMIN_TEXTAREA} value={item.quote} onChange={(e) => {
                    const items = [...draft.home_testimonials];
                    items[index] = { ...items[index], quote: e.target.value };
                    setDraft((prev) => ({ ...prev, home_testimonials: items }));
                  }} />
                </label>
                <button
                  type="button"
                  className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                  onClick={() => {
                    const items = (draft.home_testimonials || []).filter((_, testimonialIndex) => testimonialIndex !== index);
                    setDraft((prev) => ({ ...prev, home_testimonials: items }));
                  }}
                >
                  Remove testimonial
                </button>
              </div>
            </div>
          ))}
          <button type="button" className={ADMIN_BUTTON} onClick={() => setDraft((prev) => ({ ...prev, home_testimonials: [...(prev.home_testimonials || []), EMPTY_TESTIMONIAL] }))}>
            Add testimonial
          </button>
        </div>
      </article>

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

      <button type="button" className={`${ADMIN_BUTTON} mt-4`} onClick={saveAll}>
        Save website content
      </button>
    </section>
  );
}
