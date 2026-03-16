import {
  ADMIN_BUTTON,
  ADMIN_BUTTON_DANGER,
  ADMIN_INPUT,
  ADMIN_LABEL,
  ADMIN_SECTION,
  ADMIN_SECTION_DESC,
  ADMIN_SECTION_TITLE,
  ADMIN_SUBCARD,
  ADMIN_TAG,
} from "./adminStyles";

export default function AdminLoginCard({
  connected,
  username,
  password,
  status,
  onUsernameChange,
  onPasswordChange,
  onLogin,
  onLogout,
}) {
  return (
    <section className={ADMIN_SECTION} id="access">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className={ADMIN_SECTION_TITLE}>Institute Admin Panel</h1>
          <p className={ADMIN_SECTION_DESC}>
            Secure access for authorised staff to manage website content, admissions, and student services.
          </p>
        </div>
        <span className={ADMIN_TAG}>{connected ? "Connected" : "Signed out"}</span>
      </div>

      {!connected ? (
        <form
          className="mt-4 grid gap-3 max-w-xl"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin();
          }}
        >
          <label className={ADMIN_LABEL}>
            Admin ID
            <input
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => onUsernameChange(e.target.value)}
              className={ADMIN_INPUT}
            />
          </label>
          <label className={ADMIN_LABEL}>
            Password
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={ADMIN_INPUT}
            />
          </label>
          <button type="submit" className={ADMIN_BUTTON}>
            Sign in
          </button>
        </form>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className={ADMIN_BUTTON_DANGER} onClick={onLogout}>
            Sign out
          </button>
          <p className="text-sm text-slate-600">Use the sections below to update institute content.</p>
        </div>
      )}

      {status ? (
        <div className={`${ADMIN_SUBCARD} mt-4 text-sm text-slate-700`}>
          <strong className="text-slate-900">Status:</strong> {status}
        </div>
      ) : null}
    </section>
  );
}
