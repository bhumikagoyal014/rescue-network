import React, { useEffect, useState } from "react";
import { fetchAvailableDonations, createRequest } from "../api/services";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestMsg, setRequestMsg] = useState({});
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const { user } = useAuth();

  const loadDonations = async () => {
    try {
      const res = await fetchAvailableDonations();
      setDonations(res.data.donations || []);
    } catch (err) {
      console.error("Failed to load donations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleRequest = async (donationId) => {
    try {
      await createRequest({
        donationId,
        message: requestMsg[donationId] || "Requesting this surplus donation on behalf of our NGO."
      });
      setStatusMsg({ type: "success", text: "Request sent to donor successfully!" });
      loadDonations();
    } catch (err) {
      setStatusMsg({ type: "error", text: err.response?.data?.message || "Failed to request donation." });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{ background: "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)", color: "white", padding: "4rem 1.5rem", borderRadius: "var(--radius)", marginBottom: "2.5rem" }}>
        <div style={{ maxWidth: "700px" }}>
          <span className="badge" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", marginBottom: "1rem" }}>
            Zero Food Waste Initiative
          </span>
          <h1 style={{ fontSize: "2.5rem", color: "white", marginBottom: "1rem", lineHeight: 1.2 }}>
            Bridge Surplus Resources with Communities in Need
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
            Connecting donors, verified NGOs, and delivery partners in real time to minimize food waste and support families.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            {!user && <Link to="/register" className="btn btn-primary">Join the Network</Link>}
            {user?.role === "DONOR" && <Link to="/create-donation" className="btn btn-primary">+ Post a Donation</Link>}
          </div>
        </div>
      </section>

      {/* Available Listings Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
        <div>
          <h2>Available Listings</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Browse real-time food donations ready for collection</p>
        </div>
        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Showing <strong>{donations.length}</strong> items
        </span>
      </div>

      {statusMsg.text && (
        <div style={{
          padding: "0.85rem 1rem",
          borderRadius: "var(--radius-sm)",
          marginBottom: "1.5rem",
          background: statusMsg.type === "success" ? "#dcfce7" : "#fee2e2",
          color: statusMsg.type === "success" ? "#15803d" : "#b91c1c",
          fontWeight: "600",
          fontSize: "0.9rem"
        }}>
          {statusMsg.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Loading active listings...</div>
      ) : donations.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>No active donations available at the moment.</p>
          {user?.role === "DONOR" && <Link to="/create-donation" className="btn btn-primary">Create the First Listing</Link>}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {donations.map((item) => (
            <div key={item._id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <span className="badge badge-role">{item.category}</span>
                  <span className="badge badge-available">{item.status}</span>
                </div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{item.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1rem", minHeight: "40px" }}>
                  {item.description}
                </p>
                <div style={{ background: "var(--background)", padding: "0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div><strong>Quantity:</strong> {item.quantity} ({item.condition})</div>
                  <div><strong>Location:</strong> {item.pickupAddress}</div>
                  <div><strong>Available Until:</strong> {new Date(item.availableUntil).toLocaleDateString()}</div>
                  <div><strong>Donor:</strong> {item.donor?.name || "Verified Member"}</div>
                </div>
              </div>

              {user?.role === "NGO" ? (
                <div style={{ marginTop: "1.2rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                  <input
                    type="text"
                    placeholder="Add a message for the donor..."
                    value={requestMsg[item._id] || ""}
                    onChange={(e) => setRequestMsg({ ...requestMsg, [item._id]: e.target.value })}
                    style={{ marginBottom: "0.5rem" }}
                  />
                  <button onClick={() => handleRequest(item._id)} className="btn btn-primary" style={{ width: "100%" }}>
                    Request Donation
                  </button>
                </div>
              ) : !user ? (
                <Link to="/login" className="btn btn-outline" style={{ marginTop: "1.2rem", width: "100%" }}>
                  Login to Request
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}