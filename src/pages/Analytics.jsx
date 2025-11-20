import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await api.get("/admin/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="layout" style={{ marginTop: "2rem" }}>
        <div className="card">Loading analytics...</div>
      </main>
    );
  }

  if (!analytics) {
    return (
      <main className="layout" style={{ marginTop: "2rem" }}>
        <div className="card">Failed to load analytics</div>
      </main>
    );
  }

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>Blood Bank Analytics</h2>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Low Stock Hospitals */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>🔴 Hospitals with Low Stock (Critical Alert)</h3>
        <p className="small grey" style={{ marginBottom: "1rem" }}>
          Hospitals with total blood stock below 10 units
        </p>
        {analytics.lowStockHospitals.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>All hospitals have adequate stock!</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Location</th>
                <th>Total Stock</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.lowStockHospitals.map((h) => (
                <tr key={h.hospitalId}>
                  <td>{h.hospitalName}</td>
                  <td>{h.city || "N/A"}, {h.pincode || "N/A"}</td>
                  <td style={{ fontWeight: 600, color: "#f97316" }}>{h.totalStock} units</td>
                  <td>
                    <span className="badge badge-emer">Critical</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Blood Group Shortage Analysis */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>📊 Blood Group Shortage Analysis</h3>
        <p className="small grey" style={{ marginBottom: "1rem" }}>
          Blood groups with consistently low availability across all hospitals
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}>
          {analytics.bloodGroupShortage.map((bg) => (
            <div
              key={bg.bloodGroup}
              className="card"
              style={{
                background: bg.totalAvailable < 20 ? "rgba(239, 68, 68, 0.1)" : "rgba(0,0,0,0.3)",
                border: bg.totalAvailable < 20 ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.5rem" }}>{bg.bloodGroup}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700, color: bg.totalAvailable < 20 ? "#ef4444" : "#4ade80" }}>
                {bg.totalAvailable}
              </div>
              <div className="small grey">units available</div>
              {bg.totalAvailable < 20 && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#ef4444" }}>⚠ Low Stock</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Demand vs Supply */}
      <div className="card">
        <h3>📈 Demand vs Supply Report</h3>
        <p className="small grey" style={{ marginBottom: "1rem" }}>
          Comparison of blood requested vs blood available by blood group
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {analytics.demandVsSupply.map((item) => {
            const supplyDemandRatio = item.supply / Math.max(item.demand, 1);
            const status = supplyDemandRatio >= 2 ? "Surplus" : supplyDemandRatio >= 1 ? "Balanced" : "Shortage";
            const statusColor = status === "Surplus" ? "#22c55e" : status === "Balanced" ? "#f59e0b" : "#ef4444";

            return (
              <div key={item.bloodGroup} className="card">
                <h4 style={{ margin: 0, marginBottom: "0.8rem" }}>{item.bloodGroup}</h4>
                <div style={{ marginBottom: "0.5rem" }}>
                  <div className="small grey">Supply (Available)</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 600, color: "#4ade80" }}>{item.supply} units</div>
                </div>
                <div style={{ marginBottom: "0.5rem" }}>
                  <div className="small grey">Demand (Requested)</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 600, color: "#60a5fa" }}>{item.demand} units</div>
                </div>
                <div style={{ marginTop: "0.8rem", padding: "0.5rem", background: "rgba(0,0,0,0.3)", borderRadius: "0.5rem" }}>
                  <div className="small grey">Status</div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 600, color: statusColor }}>{status}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Analytics;
