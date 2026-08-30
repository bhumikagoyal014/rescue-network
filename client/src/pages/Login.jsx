import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/services";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(formData);
      login(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "3rem auto" }}>
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Welcome Back</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          Log in to manage your donations, requests, or deliveries.
        </p>

        {error && (
          <div style={{ padding: "0.6rem 0.8rem", background: "#fee2e2", color: "#b91c1c", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--primary)", fontWeight: "600" }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}