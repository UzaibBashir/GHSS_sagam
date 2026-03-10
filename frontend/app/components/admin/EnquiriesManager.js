import { AUTO_FIT_GRID, CARD, DANGER_BUTTON, MUTED_TEXT } from "../../lib/uiClasses";

export default function EnquiriesManager({ contacts, onClearContacts }) {
  return (
    <section className={CARD}>
      <div className="flex items-start justify-between gap-3 max-md:flex-col">
        <h2>Admission Enquiries ({contacts.length})</h2>
        <button className={DANGER_BUTTON} onClick={onClearContacts}>
          Clear All
        </button>
      </div>

      {contacts.length === 0 ? (
        <p className={MUTED_TEXT}>No enquiries found.</p>
      ) : (
        <div className={AUTO_FIT_GRID}>
          {contacts.map((item, index) => (
            <article className={CARD} key={`${item.email}-${index}`}>
              <h3>{item.full_name}</h3>
              <p>{item.email}</p>
              <p>{item.phone}</p>
              <p>
                <strong>Program:</strong> {item.program_interest}
              </p>
              <p>{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
