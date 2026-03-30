import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { fetchProfile } from "../services/api";

const initialProfile = {
  name: "",
  surname: "",
  email: "",
  avatar: "",
  color: "#1f7a8c"
};

function ProfilePage() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const data = await fetchProfile();
        const user = data.user || {};

        if (!ignore) {
          setForm({
            name: user.name || "",
            surname: user.surname || "",
            email: user.email || "",
            avatar: user.avatar || "",
            color: user.color || "#1f7a8c"
          });
          updateUser(user);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.response?.data?.message || "Profile could not be loaded");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [updateUser]);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");
    showToast(
      "Profile editing UI is ready, but your current Node API does not expose a profile update endpoint yet, so no backend changes were made."
    );
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Account</p>
          <h3>Profile</h3>
        </div>
      </div>

      {loading ? <p className="muted-text">Loading profile...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>

        <label>
          Surname
          <input
            type="text"
            value={form.surname}
            onChange={(event) => setForm({ ...form, surname: event.target.value })}
          />
        </label>

        <label className="full-width">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>

        <label className="full-width">
          Avatar URL
          <input
            type="text"
            value={form.avatar}
            onChange={(event) => setForm({ ...form, avatar: event.target.value })}
          />
        </label>

        <label className="full-width">
          Accent Color
          <input
            type="color"
            value={form.color}
            onChange={(event) => setForm({ ...form, color: event.target.value })}
          />
        </label>

        <button type="submit" className="primary-button full-width">
          Update Profile
        </button>
      </form>
    </section>
  );
}

export default ProfilePage;
