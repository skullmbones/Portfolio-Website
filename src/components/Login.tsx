import { useState, type FormEvent } from "react";
import "../styles/Login.css";

const SECRET_PIN = "0928";

function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSecretLogin, setIsSecretLogin] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSecretLogin) {
      onLogin();
      return;
    }

    if (password.trim() === "" || !Number.isFinite(Number(password))) {
      setError("Incorrect password!");
      return;
    }

    if (String(password).length !== 4) {
      setError("Please enter a 4-digit PIN!");
      return;
    }

    if (password === SECRET_PIN) {
      setError("");
      setIsSecretLogin(true);
      return;
    }

    setError("");
    onLogin();
  }

  return (
    <div className="login">
      <main className="login-area">
        <section className="login-panel" aria-labelledby="login-title">
          <div className="login-titlebar">
            <div className="login-brand">
              <span>michaelbabboniOS</span>
            </div>
            <div className="login-window-controls" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="login-content">
            <div className="profile-frame">
              <img
                src="/img/headshot2026.png"
                alt="Michael Babboni"
                className="profile-pic"
                draggable="false"
              />
            </div>
            <h1 id="login-title">Michael Babboni</h1>
            <form noValidate className="login-form" onSubmit={handleSubmit}>
              <label htmlFor="login-pin">Enter any 4-digit PIN</label>
              <div className="login-input-row">
                <input
                  id="login-pin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  placeholder="••••"
                  autoComplete="one-time-code"
                  value={password}
                  disabled={isSecretLogin}
                  aria-describedby={
                    error || isSecretLogin ? "login-error" : undefined
                  }
                  aria-invalid={Boolean(error)}
                  onChange={(e) => {
                    setPassword(e.target.value.replace(/\D/g, ""));
                    if (error) setError("");
                  }}
                />
                <button
                  type="submit"
                  className={isSecretLogin ? "login-secret-continue" : ""}
                  aria-label={
                    isSecretLogin ? "Continue to desktop" : "Sign in"
                  }
                >
                  <span>{isSecretLogin ? "Continue" : "Sign in"}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>
            <p
              id="login-error"
              className={`login-error${
                error || isSecretLogin ? " visible" : ""
              }${isSecretLogin ? " login-secret-message" : ""}`}
              role={isSecretLogin ? "status" : "alert"}
            >
              {isSecretLogin
                ? "Wait... how did you know that?"
                : error || "Ready"}
            </p>
          </div>
          <footer className="login-footer">
            <span><i aria-hidden="true" /> System ready</span>
            <span>v2.0</span>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default Login;
