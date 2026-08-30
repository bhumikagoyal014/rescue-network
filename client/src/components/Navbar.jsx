import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 10 }}>
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.5rem" }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <span style={{ background: "var(--primary)", color: "white", padding: "6px 10px", borderRadius: "8px", fontWeight: "800", fontSize: "1.1rem" }}>🌱</span>
          <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--secondary)" }}>Rescue<span style={{ color: "var(--primary)" }}>Network</span></span>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link
            to="/donations"
            className="btn btn-outline"
            style={{ borderColor: isActive("/donations") ? "var(--primary)" : "transparent", background: "transparent" }}
          >
            Explore Donations
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className="btn btn-outline"
              style={{ borderColor: isActive("/dashboard") ? "var(--primary)" : "transparent", background: "transparent" }}
            >
              Dashboard
            </Link>
          )}

          {user?.role === "DONOR" && (
            <Link to="/create-donation" className="btn btn-primary">
              + Donate Food
            </Link>
          )}
        </nav>

        {/* User / Authentication Area */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline">Log In</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>{user.name}</div>
                <span className="badge badge-role">{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}