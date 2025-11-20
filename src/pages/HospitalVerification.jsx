// frontend/src/pages/HospitalVerification.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const HospitalVerification = () => {
  const [pendingHospitals, setpendingHospitals] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        api.get("/admin/hospitals/pending-verification"),
        api.get("/admin/users"),
      ]);

      setpendingHospitals(pendingRes.data);
      setAllHospitals(allRes.data.filter((u) => u.role === "hospital"));
    } catch (err) {
      console.error("Failed to load hospitals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerification = async (hospitalId, status) => {
    if (status === "rejected" && !notes.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }

    setProcessing(hospitalId);
    try {
      await api.patch(`/admin/hospitals/${hospitalId}/verify-documents`, {
        verificationStatus: status,
        verificationNotes: notes.trim(),
      });

      alert(`Hospital ${status === "approved" ? "approved" : "rejected"} successfully`);
      setSelectedHospital(null);
      setNotes("");
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update verification status");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "approved":
        return { bg: "rgba(34,197,94,0.2)", color: "#86efac" };
      case "rejected":
        return { bg: "rgba(239,68,68,0.2)", color: "#fca5a5" };
      default:
        return { bg: "rgba(249,115,22,0.2)", color: "#fdba74" };
    }
  };

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <h2>Hospital Document Verification</h2>
      <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
        Review and approve hospital license certificates and GST numbers.
      </p>

      {loading ? (
        <div className="card">Loading...</div>
      ) : (
        <>
          {/* Pending Verifications */}
          {pendingHospitals.length > 0 && (
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ marginTop: 0, color: "#f97316" }}>
                ⏳ Pending Verifications ({pendingHospitals.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {pendingHospitals.map((hospital) => (
                  <div
                    key={hospital._id}
                    style={{
                      padding: "1rem",
                      border: "2px solid rgba(249,115,22,0.4)",
                      borderRadius: "0.85rem",
                      backgroundColor: "rgba(30,41,59,0.5)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.8rem",
                      }}
                    >
                      <div>
                        <h4 style={{ margin: 0, fontSize: "1.1rem" }}>
                          {hospital.name}
                        </h4>
                        <div style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.3rem" }}>
                          {hospital.email}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                          {hospital.city}, {hospital.pincode}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem",
                        marginBottom: "1rem",
                        padding: "0.8rem",
                        backgroundColor: "rgba(15,23,42,0.6)",
                        borderRadius: "0.5rem",
                      }}
                    >
                      <div>
                        <div className="label">License Certificate Number</div>
                        <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>
                          {hospital.licenseCertificateNumber || (
                            <span style={{ color: "#9ca3af" }}>Not provided</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="label">GST Number</div>
                        <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>
                          {hospital.gstNumber || (
                            <span style={{ color: "#9ca3af" }}>Not provided</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedHospital === hospital._id && (
                      <div style={{ marginBottom: "1rem" }}>
                        <div className="label">Rejection Notes (required for rejection)</div>
                        <textarea
                          className="input"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Provide reason for rejection..."
                          rows={3}
                        />
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleVerification(hospital._id, "approved")}
                        disabled={processing === hospital._id}
                        style={{ backgroundColor: "#10b981" }}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => {
                          if (selectedHospital === hospital._id) {
                            handleVerification(hospital._id, "rejected");
                          } else {
                            setSelectedHospital(hospital._id);
                            setNotes("");
                          }
                        }}
                        disabled={processing === hospital._id}
                        style={{ borderColor: "#ef4444", color: "#ef4444" }}
                      >
                        ❌ {selectedHospital === hospital._id ? "Confirm Rejection" : "Reject"}
                      </button>
                      {selectedHospital === hospital._id && (
                        <button
                          className="btn btn-outline"
                          onClick={() => {
                            setSelectedHospital(null);
                            setNotes("");
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Hospitals Overview */}
          <div className="card">
            <h3 style={{ marginTop: 0 }}>All Hospitals ({allHospitals.length})</h3>
            {allHospitals.length === 0 ? (
              <div>No hospitals registered yet.</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Hospital Name</th>
                      <th>Email</th>
                      <th>City</th>
                      <th>License #</th>
                      <th>GST #</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allHospitals.map((hospital) => {
                      const statusColors = getStatusBadgeColor(hospital.verificationStatus);
                      return (
                        <tr key={hospital._id}>
                          <td>{hospital.name}</td>
                          <td style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                            {hospital.email}
                          </td>
                          <td>{hospital.city || "-"}</td>
                          <td style={{ fontSize: "0.85rem" }}>
                            {hospital.licenseCertificateNumber || (
                              <span style={{ color: "#6b7280" }}>-</span>
                            )}
                          </td>
                          <td style={{ fontSize: "0.85rem" }}>
                            {hospital.gstNumber || (
                              <span style={{ color: "#6b7280" }}>-</span>
                            )}
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: statusColors.bg,
                                color: statusColors.color,
                              }}
                            >
                              {hospital.verificationStatus || "pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default HospitalVerification;
