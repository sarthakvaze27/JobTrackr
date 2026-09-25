import { useState, type FormEvent } from "react";
import { loginUser } from "../api/axios";

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <div className="auth-logo">
            <i className="ti ti-briefcase" />
          </div>
          <div>
            <h1>Welcome back</h1>
            <p>Sign in to manage your job applications.</p>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Login"}
        </button>

        <button className="auth-switch" type="button" onClick={onSwitchToRegister}>
          Create a new account
        </button>
      </form>
    </div>
  );
}
