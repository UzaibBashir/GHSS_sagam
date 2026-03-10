export default function NotificationsSection({ institute }) {
  return (
    <section id="notifications" className="grid gap-4">
      <h2>Notifications</h2>
      <ul className="grid list-disc gap-2 pl-5">
        {(institute?.notices || []).map((item) => (
          <li key={item.text}>{item.text}</li>
        ))}
      </ul>
    </section>
  );
}
