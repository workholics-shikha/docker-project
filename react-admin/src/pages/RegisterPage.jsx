import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { registerRequest } from "../services/api";

const benefits = [
  "Create admin users through your existing backend",
  "Capture profile identity and visual preferences",
  "Keep onboarding aligned with the rest of the premium panel"
];

const initialForm = {
  name: "",
  surname: "",
  email: "",
  password: "",
  avatar: "",
  color: "#b78a4a"
};

function RegisterPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await registerRequest(form);
      showToast(data.message || "User registered successfully");
      setForm(initialForm);
      window.setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page auth-page-luxe">
      <div className="auth-shell auth-shell-wide auth-shell-premium">
        <section className="auth-showcase auth-showcase-premium auth-showcase-register">
          <span className="auth-badge">Curated onboarding</span>
          <h1>Create a polished first step into the admin experience.</h1>
          <p>
            Registration should feel like part of the product. This version keeps the API workflow
            intact while elevating the interface around it.
          </p>

          <div className="auth-highlight-list premium-list">
            {benefits.map((item) => (
              <div key={item} className="auth-highlight-item premium-item">
                <span className="auth-highlight-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="auth-feature-band">
            <div>
              <strong>Elegant setup</strong>
              <p>Identity, email, password, avatar, and accent color.</p>
            </div>
            <div>
              <strong>Quick handoff</strong>
              <p>Success toast and redirect back to login automatically.</p>
            </div>
          </div>
        </section>

        <section className="auth-card auth-card-luxe wide">
          <p className="eyebrow">Admin onboarding</p>
          <h2>Register</h2>
          <p className="muted-text">Create a new account with the connected Node API.</p>

          <form className="auth-form grid-two" onSubmit={handleSubmit}>
            <label>
              Name
              <input
                type="text"
                placeholder="First name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>

            <label>
              Surname
              <input
                type="text"
                placeholder="Last name"
                value={form.surname}
                onChange={(event) => setForm({ ...form, surname: event.target.value })}
              />
            </label>

            <label className="full-width">
              Email
              <input
                type="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </label>

            <label className="full-width">
              Password
              <input
                type="password"
                placeholder="Create a secure password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </label>

            <label>
              Avatar URL
              <input
                type="text"
                placeholder="https://..."
                value={form.avatar}
                onChange={(event) => setForm({ ...form, avatar: event.target.value })}
              />
            </label>

            <label>
              Theme Color
              <input
                type="color"
                value={form.color}
                onChange={(event) => setForm({ ...form, color: event.target.value })}
              />
            </label>

            {error ? <p className="form-error full-width">{error}</p> : null}

            <button type="submit" className="primary-button auth-submit luxe-submit full-width" disabled={submitting}>
              {submitting ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="auth-footer auth-footer-rich">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
