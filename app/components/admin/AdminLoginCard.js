import { CARD, DANGER_BUTTON, INPUT, MUTED_TEXT, PRIMARY_BUTTON } from "../../lib/uiClasses";

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
    <section className={CARD}>
      <h1>School Admin Portal</h1>
      <p className={MUTED_TEXT}>Secure login for school administration.</p>

      {!connected ? (
        <div className="grid gap-3">
          <input
            placeholder="Admin ID"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className={INPUT}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={INPUT}
          />
          <button onClick={onLogin} className={PRIMARY_BUTTON}>
            Login
          </button>
        </div>
      ) : (
        <button className={DANGER_BUTTON} onClick={onLogout}>
          Logout
        </button>
      )}

      {status ? <p className={MUTED_TEXT}>{status}</p> : null}
    </section>
  );
}
