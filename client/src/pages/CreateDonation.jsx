import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDonation } from "../api/services";

export default function CreateDonation() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "FOOD",
    quantity: "",
    condition: "GOOD",
    pickupAddress: "",
    availableUntil: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createDonation(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish donation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "560px", margin: "2rem auto" }}>
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Post Surplus Donation</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
          Fill in details for NGOs and couriers to arrange pickup.
        </p>

        {error && (
          <div style={{ padding: "0.6rem 0.8rem", background: "#fee2e2", color: "#b91c1c", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label>Listing Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 40 Fresh Meal Boxes"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label>Description & Contents</label>
            <textarea
              required
              rows={3}
              placeholder="Describe item condition, preparation time, allergen warnings..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="FOOD">Food</option>
                <option value="CLOTHES">Clothes</option>
                <option value="FURNITURE">Furniture</option>
                <option value="BOOKS">Books</option>
                <option value="ELECTRONICS">Electronics</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label>Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="GOOD">Good / Fresh</option>
                <option value="NEW">New</option>
                <option value="USED">Used</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label>Quantity</label>
              <input
                type="text"
                required
                placeholder="e.g. 20 kg / 4 crates"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>
            <div>
              <label>Available Until</label>
              <input
                type="datetime-local"
                required
                value={formData.availableUntil}
                onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label>Pickup Address</label>
            <input
              type="text"
              required
              placeholder="e.g. 42 Market Street, Suite 4B"
              value={formData.pickupAddress}
              onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            {loading ? "Publishing listing..." : "Publish Donation"}
          </button>
        </form>
      </div>
    </div>
  );
}