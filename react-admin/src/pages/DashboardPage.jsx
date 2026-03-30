import { useEffect, useState } from "react";
import { fetchProducts, fetchProfile, fetchUsers } from "../services/api";

function DashboardPage() {
  const [stats, setStats] = useState({
    loading: true,
    error: "",
    products: 0,
    categories: 0,
    users: 0,
    profile: null
  });

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        const [productsResponse, usersResponse, profileResponse] = await Promise.all([
          fetchProducts(),
          fetchUsers(),
          fetchProfile()
        ]);

        if (ignore) {
          return;
        }

        const products = productsResponse.products || [];
        const categories = new Set(products.map((product) => product.category).filter(Boolean));

        setStats({
          loading: false,
          error: "",
          products: products.length,
          categories: categories.size,
          users: usersResponse.users?.length || 0,
          profile: profileResponse.user || null
        });
      } catch (error) {
        if (!ignore) {
          setStats((current) => ({
            ...current,
            loading: false,
            error: error.response?.data?.message || "Dashboard data could not be loaded"
          }));
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  const cards = [
    { label: "Total Products", value: stats.products },
    { label: "Categories", value: stats.categories },
    { label: "Registered Users", value: stats.users }
  ];

  return (
    <div className="stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p className="muted-text">
            Track users, products, and your current session from one place.
          </p>
        </div>
      </section>

      {stats.error ? <p className="form-error">{stats.error}</p> : null}

      <section className="stats-grid">
        {cards.map((card) => (
          <article key={card.label} className="stat-card">
            <p>{card.label}</p>
            <strong>{stats.loading ? "..." : card.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Current user</p>
            <h3>Profile snapshot</h3>
          </div>
        </div>

        <div className="profile-summary">
          <div className="profile-avatar">
            {(stats.profile?.name || "A").slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h4>{stats.profile?.name || "Loading user..."}</h4>
            <p>{stats.profile?.email || "No email available"}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
