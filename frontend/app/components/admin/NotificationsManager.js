import { AUTO_FIT_GRID, CARD, DANGER_BUTTON, INPUT, PRIMARY_BUTTON } from "../../lib/uiClasses";

export default function NotificationsManager({ notices, newNotice, onNoticeChange, onAddNotice, onRemoveNotice }) {
  return (
    <section className={CARD}>
      <h2>Notifications</h2>
      <textarea
        rows={4}
        value={newNotice}
        onChange={(e) => onNoticeChange(e.target.value)}
        placeholder="Write notice for students and parents"
        className={INPUT}
      />
      <button onClick={onAddNotice} className={PRIMARY_BUTTON}>
        Publish Notification
      </button>

      <div className={AUTO_FIT_GRID}>
        {notices.map((notice) => (
          <article className={CARD} key={`${notice.index}-${notice.text}`}>
            <p>{notice.text}</p>
            <button className={DANGER_BUTTON} onClick={() => onRemoveNotice(notice.index)}>
              Remove
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
