import { useState, type FormEvent } from "react";
import "../styles/Login.css";

function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password.trim() === "" || !Number.isFinite(Number(password))) {
      setError("Incorrect passwrord!");
      return;
    }

    if (String(password).length !== 4) {
      setError("Please enter a 4-digit PIN!");
      return;
    }

    setError("");
    onLogin();
  }

  return (
    <div className="login">
      <main className="login-area">
        <div className="login-header">
          <img src="/img/headshot2026.png" alt="Profile Picture" className="profile-pic" />
          <h1>Michael Babboni</h1>
          <form noValidate className="login-form" onSubmit={handleSubmit}>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              placeholder="PIN"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))}
            />
            <button type="submit">→</button>
          </form>
        </div>
        {error && <p className="login-error">{error}</p>}
      </main>
    </div>
  );
}

export default Login;