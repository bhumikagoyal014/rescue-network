import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchMyDonations,
  fetchDonationRequests,
  acceptRequest,
  rejectRequest,
  fetchMyRequests,
  schedulePickup,
  fetchMyPickups,
  fetchAvailableDeliveries,
  acceptDelivery,
  fetchMyDeliveries,
  updatePickupStatus,
  fetchAllUsers,
  fetchAllDonations
} from "../api/services";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ list1: [], list2: [] });
  const [loading, setLoading] = useState(true);
  const [pickupForm, setPickupForm] = useState({});

  const loadRoleData = async () => {
    setLoading(true);
    try {
      if (user?.role === "DONOR") {
        const [donationsRes, requestsRes] = await Promise.all([
          fetchMyDonations(),
          fetchDonationRequests()
        ]);
        setData({ list1: donationsRes.data.donations || [], list2: requestsRes.data.requests || [] });
      } else if (user?.role === "NGO") {
        const [requestsRes, pickupsRes] = await Promise.all([
          fetchMyRequests(),
          fetchMyPickups()
        ]);
        setData({ list1: requestsRes.data.requests || [], list2: pickupsRes.data.pickups || [] });
      } else if (user?.role === "DELIVERY") {
        const [availableRes, myJobsRes] = await Promise.all([
          fetchAvailableDeliveries(),
          fetchMyDeliveries()
        ]);
        setData({ list1: availableRes.data.deliveries || [], list2: myJobsRes.data.deliveries || [] });
      } else if (user?.role === "ADMIN") {
        const [usersRes, allDonationsRes] = await Promise.all([
          fetchAllUsers(),
          fetchAllDonations()
        ]);
        setData({ list1: usersRes.data.users || [], list2: allDonationsRes.data.donations || [] });
      }
    } catch (err) {
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadRoleData();
  }, [user]);

  if (loading) return <div style={{ textAlign: "center", padding: "3rem" }}>Loading dashboard insights...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2>Dashboard</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Manage operations for {user?.name}</p>
        </div>
        <span className="badge badge-role" style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
          {user?.role} Portal
        </span>
      </div>

      {/* DONOR DASHBOARD */}
      {user?.role === "DONOR" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <section className="card">
            <h3 style={{ marginBottom: "1rem" }}>Incoming Requests ({data.list2.length})</h3>
            {data.list2.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No pending requests from NGOs.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {data.list2.map((req) => (
                  <div key={req._id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <strong>{req.ngo?.name}</strong>
                      <span className={`badge ${req.status === "PENDING" ? "badge-requested" : "badge-available"}`}>{req.status}</span>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
                      Item: <strong>{req.donation?.title}</strong>
                    </p>
                    <p style={{ fontSize: "0.85rem", background: "var(--background)", padding: "0.5rem", borderRadius: "4px" }}>
                      "{req.message || "No notes provided."}"
                    </p>
                    {req.status === "PENDING" && (
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                        <button onClick={async () => { await acceptRequest(req._id); loadRoleData(); }} className="btn btn-primary" style={{ padding: "0.4rem 0.8rem" }}>
                          Accept
                        </button>
                        <button onClick={async () => { await rejectRequest(req._id); loadRoleData(); }} className="btn btn-danger" style={{ padding: "0.4rem 0.8rem" }}>
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <h3 style={{ marginBottom: "1rem" }}>My Listed Donations ({data.list1.length})</h3>
            {data.list1.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>You haven't listed any surplus items yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {data.list1.map((d) => (
                  <div key={d._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "0.75rem" }}>
                    <div>
                      <div style={{ fontWeight: "600" }}>{d.title}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{d.quantity} • {d.pickupAddress}</div>
                    </div>
                    <span className="badge badge-available">{d.status}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* NGO DASHBOARD */}
      {user?.role === "NGO" && (
        <div className="card">
          <h3 style={{ marginBottom: "1rem" }}>Requested Items & Pickups ({data.list1.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.list1.map((req) => (
              <div key={req._id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1.2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4>{req.donation?.title}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Pickup from: {req.donation?.pickupAddress}</p>
                  </div>
                  <span className={`badge ${req.status === "ACCEPTED" ? "badge-available" : "badge-requested"}`}>{req.status}</span>
                </div>

                {req.status === "ACCEPTED" && (
                  <div style={{ background: "var(--background)", padding: "1rem", borderRadius: "var(--radius-sm)", marginTop: "1rem" }}>
                    <h5 style={{ marginBottom: "0.5rem" }}>Schedule Collection Details</h5>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: "0.75rem", alignItems: "end" }}>
                      <div>
                        <label>Pickup Location</label>
                        <input
                          type="text"
                          placeholder="Address"
                          value={pickupForm[req._id]?.pickupAddress || req.donation?.pickupAddress || ""}
                          onChange={(e) => setPickupForm({ ...pickupForm, [req._id]: { ...pickupForm[req._id], pickupAddress: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label>Date & Time</label>
                        <input
                          type="datetime-local"
                          value={pickupForm[req._id]?.scheduledDate || ""}
                          onChange={(e) => setPickupForm({ ...pickupForm, [req._id]: { ...pickupForm[req._id], scheduledDate: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label>Method</label>
                        <select
                          value={pickupForm[req._id]?.pickupMethod || "SELF_PICKUP"}
                          onChange={(e) => setPickupForm({ ...pickupForm, [req._id]: { ...pickupForm[req._id], pickupMethod: e.target.value } })}
                        >
                          <option value="SELF_PICKUP">Self Pickup</option>
                          <option value="DELIVERY">Delivery Courier</option>
                        </select>
                      </div>
                      <button
                        onClick={async () => {
                          await schedulePickup({
                            requestId: req._id,
                            pickupMethod: pickupForm[req._id]?.pickupMethod || "SELF_PICKUP",
                            pickupAddress: pickupForm[req._id]?.pickupAddress || req.donation?.pickupAddress,
                            scheduledDate: pickupForm[req._id]?.scheduledDate
                          });
                          loadRoleData();
                        }}
                        className="btn btn-primary"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DELIVERY DASHBOARD */}
      {user?.role === "DELIVERY" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <section className="card">
            <h3 style={{ marginBottom: "1rem" }}>Open Courier Jobs ({data.list1.length})</h3>
            {data.list1.map((p) => (
              <div key={p._id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1rem", marginBottom: "0.75rem" }}>
                <div><strong>Pickup:</strong> {p.pickupAddress}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0.3rem 0 0.8rem" }}>
                  Delivery Fee: <strong>${p.deliveryFee || 0}</strong>
                </div>
                <button onClick={async () => { await acceptDelivery(p._id); loadRoleData(); }} className="btn btn-primary" style={{ width: "100%" }}>
                  Claim Delivery Job
                </button>
              </div>
            ))}
          </section>

          <section className="card">
            <h3 style={{ marginBottom: "1rem" }}>My Assigned Jobs ({data.list2.length})</h3>
            {data.list2.map((p) => (
              <div key={p._id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "1rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <strong>{p.pickupAddress}</strong>
                  <span className="badge badge-available">{p.deliveryStatus}</span>
                </div>
                {p.deliveryStatus === "SCHEDULED" && (
                  <button onClick={async () => { await updatePickupStatus(p._id, "PICKED_UP"); loadRoleData(); }} className="btn btn-primary" style={{ width: "100%" }}>
                    Mark Picked Up
                  </button>
                )}
                {p.deliveryStatus === "PICKED_UP" && (
                  <button onClick={async () => { await updatePickupStatus(p._id, "DELIVERED"); loadRoleData(); }} className="btn btn-secondary" style={{ width: "100%" }}>
                    Mark Delivered
                  </button>
                )}
              </div>
            ))}
          </section>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {user?.role === "ADMIN" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <section className="card">
            <h3 style={{ marginBottom: "1rem" }}>Users Directory ({data.list1.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {data.list1.map((u) => (
                <div key={u._id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <span>{u.name} ({u.email})</span>
                  <span className="badge badge-role">{u.role}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h3 style={{ marginBottom: "1rem" }}>All Platform Donations ({data.list2.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {data.list2.map((d) => (
                <div key={d._id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--border)" }}>
                  <span>{d.title}</span>
                  <span className="badge badge-available">{d.status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}