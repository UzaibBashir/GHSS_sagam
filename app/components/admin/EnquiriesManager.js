import { AUTO_FIT_GRID, CARD, DANGER_BUTTON, MUTED_TEXT } from "../../lib/uiClasses";

export default function EnquiriesManager({ contacts, onClearContacts }) {
  return (
    <section className={CARD}>
      <div className="flex items-start justify-between gap-3 max-md:flex-col">
        <h2 className="text-2xl max-sm:text-xl">Admission Enquiries ({contacts.length})</h2>
        <button className={`${DANGER_BUTTON} w-full justify-center max-md:w-full sm:w-fit`} onClick={onClearContacts}>
          Clear All
        </button>
      </div>

      {contacts.length === 0 ? (
        <p className={MUTED_TEXT}>No enquiries found.</p>
      ) : (
        <div className={AUTO_FIT_GRID}>
          {contacts.map((item, index) => (
            <article className={CARD} key={`${item.email}-${index}`}>
              <h3 className="text-lg break-words">{item.full_name}</h3>
              <p className="break-all text-sm text-slate-700">{item.email}</p>
              <p className="text-sm text-slate-700">{item.phone}</p>
              <p className="text-sm text-slate-700">
                <strong>Program:</strong> {item.program_interest}
              </p>
              <p className="break-words text-sm leading-6 text-slate-700">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
