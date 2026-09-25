import { useState, type FormEvent } from "react";
import { registerUser } from "../api/axios";

interface RegisterPageProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterPage({ onRegister, onSwitchToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    skills: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        year: formData.year ? Number(formData.year) : undefined,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onRegister();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
            <h1>Create account</h1>
            <p>Start tracking applications, interviews, and offers.</p>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label>Name</label>
          <input
            placeholder="Your name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Create a password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Year</label>
            <input
              type="number"
              placeholder="2026"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <input
              placeholder="React, Node"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Register"}
        </button>

        <button className="auth-switch" type="button" onClick={onSwitchToLogin}>
          Already have an account?
        </button>
      </form>
    </div>
  );
}
