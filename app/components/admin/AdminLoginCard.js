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
      <h1 className="text-3xl max-sm:text-2xl">School Admin Portal</h1>
      <p className={MUTED_TEXT}>Secure login for school administration.</p>

      {!connected ? (
        <form
          className="grid gap-3 max-w-xl"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin();
          }}
        >
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
          <button type="submit" className={`${PRIMARY_BUTTON} w-full justify-center sm:w-fit`}>
            Login
          </button>
        </form>
      ) : (
        <button className={`${DANGER_BUTTON} w-full justify-center sm:w-fit`} onClick={onLogout}>
          Logout
        </button>
      )}

      {status ? <p className={`${MUTED_TEXT} break-words`}>{status}</p> : null}
    </section>
  );
}
