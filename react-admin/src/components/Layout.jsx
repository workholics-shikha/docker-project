import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/categories", label: "Categories" },
    { to: "/products", label: "Products" },
    { to: "/products/add", label: "Add Product" },
    { to: "/profile", label: "Profile" }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">AC</span>
        <div className="brand-copy">
          <p className="brand-kicker">Premium Workspace</p>
          <h1>Admin Console</h1>
        </div>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="bell-icon">
      <path
        d="M12 3.75a4.5 4.5 0 0 0-4.5 4.5v1.1c0 .64-.18 1.26-.51 1.8L5.7 13.1a2.25 2.25 0 0 0 1.92 3.4h8.76a2.25 2.25 0 0 0 1.92-3.4l-1.29-1.95a3.46 3.46 0 0 1-.51-1.8v-1.1a4.5 4.5 0 0 0-4.5-4.5Zm0 17.25a2.63 2.63 0 0 0 2.47-1.75H9.53A2.63 2.63 0 0 0 12 21Z"
        fill="currentColor"
      />
    </svg>
  );
}

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Operations dashboard</p>
        <h2>Welcome back, {user?.name || "Admin"}</h2>
      </div>

      <div className="topbar-actions">
        <button type="button" className="notification-button" aria-label="Notifications">
          <span className="notification-dot" />
          <BellIcon />
        </button>

        <button type="button" className="ghost-button profile-chip" onClick={() => navigate("/profile")}>
          {user?.email || "Profile"}
        </button>

        <button
          type="button"
          className="danger-button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Navbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
