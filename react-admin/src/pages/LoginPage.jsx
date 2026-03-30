import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginRequest } from "../services/api";

const highlights = [
  "Refined admin experience built around your existing API",
  "Product and account workflows in one focused workspace",
  "Fast, secure sign in with a cleaner premium interface"
];

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await loginRequest(form);
      login({ token: data.token, user: data.user });
      showToast(data.message || "Login successful");
      window.setTimeout(() => {
        navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
      }, 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page auth-page-luxe">
      <div className="auth-shell auth-shell-premium">
        <section className="auth-showcase auth-showcase-premium">
          <span className="auth-badge">Exclusive access</span>
          <h1>Enter a calmer, sharper admin workspace.</h1>
          <p>
            Designed to feel more refined, this sign-in experience keeps the focus on your data,
            your products, and the flow into the dashboard.
          </p>

          <div className="auth-highlight-list premium-list">
            {highlights.map((item) => (
              <div key={item} className="auth-highlight-item premium-item">
                <span className="auth-highlight-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="auth-feature-band">
            <div>
              <strong>Secure sign in</strong>
              <p>Existing backend login flow, premium front-end treatment.</p>
            </div>
            <div>
              <strong>Focused UX</strong>
              <p>Less noise, stronger hierarchy, cleaner actions.</p>
            </div>
          </div>
        </section>

        <section className="auth-card auth-card-luxe">
          <p className="eyebrow">Admin access</p>
          <h2>Login</h2>
          <p className="muted-text">Access your workspace using the connected Node API.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </label>

            {error ? <p className="form-error">{error}</p> : null}

            <button type="submit" className="primary-button auth-submit luxe-submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="auth-footer auth-footer-rich">
            New here? <Link to="/register">Create account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
