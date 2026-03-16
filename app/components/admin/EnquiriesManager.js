import {
  ADMIN_BUTTON_DANGER,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
} from "./adminStyles";

export default function EnquiriesManager({ contacts, onClearContacts }) {
  return (
    <section className={ADMIN_SECTION} id="enquiries">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className={ADMIN_SECTION_TITLE}>Admission Enquiries</h2>
          <p className={ADMIN_SECTION_DESC}>Manage incoming contact form submissions from the website.</p>
        </div>
        <button className={ADMIN_BUTTON_DANGER} onClick={onClearContacts}>
          Clear all enquiries
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className={`${ADMIN_SUBCARD} mt-4 text-sm text-slate-600`}>No enquiries found.</div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] table-fixed border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Program</th>
                <th className="px-3 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((item, index) => (
                <tr key={`${item.email}-${index}`} className="border-t border-slate-200">
                  <td className="px-3 py-2 font-semibold text-slate-900 break-words">{item.full_name}</td>
                  <td className="px-3 py-2 break-all text-slate-700">{item.email}</td>
                  <td className="px-3 py-2 text-slate-700 break-words">{item.phone}</td>
                  <td className="px-3 py-2 text-slate-700 break-words">{item.program_interest}</td>
                  <td className="px-3 py-2 text-slate-600 break-words">{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

