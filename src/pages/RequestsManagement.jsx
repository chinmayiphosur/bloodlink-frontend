import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const RequestsManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, open, emergency, fulfilled, cancelled

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await api.get("/requests/mine");
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/requests/${id}/status`, { status });
      alert(`Request ${status} successfully!`);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const acceptDonor = async (requestId, donorId) => {
    try {
      await api.patch(`/requests/${requestId}/accept-donor`, { donorId });
      alert("Donor accepted.");
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept donor");
    }
  };

  // Filter and sort requests
  const getFilteredRequests = () => {
    let filtered = [...requests];

    // Apply filter
    if (filter === "open") {
      filtered = filtered.filter(r => r.status === "open" && !r.isEmergency);
    } else if (filter === "emergency") {
      filtered = filtered.filter(r => r.isEmergency && r.status === "open");
    } else if (filter === "fulfilled") {
      filtered = filtered.filter(r => r.status === "fulfilled");
    } else if (filter === "cancelled") {
      filtered = filtered.filter(r => r.status === "cancelled");
    }

    // Sort: Emergency first, then by date
    filtered.sort((a, b) => {
      if (a.isEmergency && !b.isEmergency) return -1;
      if (!a.isEmergency && b.isEmergency) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  const getStatusCounts = () => {
    return {
      all: requests.length,
      open: requests.filter(r => r.status === "open" && !r.isEmergency).length,
      emergency: requests.filter(r => r.isEmergency && r.status === "open").length,
      fulfilled: requests.filter(r => r.status === "fulfilled").length,
      cancelled: requests.filter(r => r.status === "cancelled").length,
    };
  };

  const counts = getStatusCounts();

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>Requests & Pledged Donors</h2>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter("all")}
          >
            All ({counts.all})
          </button>
          <button
            className={`btn ${filter === "emergency" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter("emergency")}
            style={filter === "emergency" ? { background: "#dc2626" } : {}}
          >
            🚨 Emergency ({counts.emergency})
          </button>
          <button
            className={`btn ${filter === "open" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter("open")}
          >
            Open ({counts.open})
          </button>
          <button
            className={`btn ${filter === "fulfilled" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter("fulfilled")}
          >
            Fulfilled ({counts.fulfilled})
          </button>
          <button
            className={`btn ${filter === "cancelled" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled ({counts.cancelled})
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="card">Loading...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="card">
          <p style={{ color: "#9ca3af" }}>No requests found for this filter.</p>
        </div>
      ) : (
        filteredRequests.map((request) => (
          <div key={request._id} className="card" style={{ marginBottom: "1rem" }}>
            {/* Request Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
              <div>
                <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ margin: 0 }}>
                    {request.bloodGroup} - {request.units} {request.units === 1 ? "unit" : "units"}
                  </h3>
                  {request.isEmergency && (
                    <span className="badge badge-emer">🚨 EMERGENCY</span>
                  )}
                  <span className={`badge badge-${request.status === "open" ? "open" : request.status === "fulfilled" ? "open" : "muted"}`}>
                    {request.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                  {request.city && `${request.city}, `}
                  {request.pincode && `Pincode: ${request.pincode}`}
                  {request.createdAt && ` • Created: ${new Date(request.createdAt).toLocaleDateString()}`}
                </div>
              </div>

              {/* Action Buttons */}
              {request.status === "open" && (
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    className="btn btn-outline"
                    onClick={() => updateStatus(request._id, "fulfilled")}
                    disabled={!request.acceptedDonor}
                  >
                    Mark Fulfilled
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => updateStatus(request._id, "cancelled")}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Accepted Donor */}
            {request.acceptedDonor && (
              <div style={{ padding: "0.8rem", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "0.5rem", marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#22c55e", marginBottom: "0.3rem" }}>
                  ✓ Accepted Donor
                </div>
                <div style={{ fontSize: "0.9rem" }}>
                  <strong>{request.acceptedDonor.name}</strong>
                  {request.acceptedDonor.email && ` • ${request.acceptedDonor.email}`}
                  {request.acceptedDonor.phone && ` • ${request.acceptedDonor.phone}`}
                </div>
              </div>
            )}

            {/* Pledged Donors */}
            {request.pledgedDonors && request.pledgedDonors.length > 0 ? (
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.8rem" }}>
                  Pledged Donors ({request.pledgedDonors.length})
                </div>
                <div style={{ display: "grid", gap: "0.8rem" }}>
                  {request.pledgedDonors.map((pledge) => (
                    <div
                      key={pledge._id}
                      style={{
                        padding: "0.8rem",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "0.5rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: "0.2rem" }}>
                          {pledge.donor?.name || "Donor"}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                          {pledge.donor?.email && `${pledge.donor.email}`}
                          {pledge.donor?.phone && ` • ${pledge.donor.phone}`}
                          {pledge.donor?.bloodGroup && ` • ${pledge.donor.bloodGroup}`}
                        </div>
                      </div>
                      {request.status === "open" && !request.acceptedDonor && (
                        <button
                          className="btn btn-primary"
                          onClick={() => acceptDonor(request._id, pledge.donor._id)}
                        >
                          Accept
                        </button>
                      )}
                      {request.acceptedDonor && request.acceptedDonor._id === pledge.donor._id && (
                        <span className="badge badge-open" style={{ background: "#22c55e" }}>Accepted</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.85rem", color: "#9ca3af", fontStyle: "italic" }}>
                No donors pledged yet
              </div>
            )}
          </div>
        ))
      )}
    </main>
  );
};

export default RequestsManagement;
