// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import LiveMap from "../components/LiveMap";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // global live locations
  const [donorLocations, setDonorLocations] = useState([]);
  const [hospitalLocations, setHospitalLocations] = useState([]);

  const [downloadingLogs, setDownloadingLogs] = useState(false);
  
  const socketRef = useRef(null);

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadUsers();
  }, []);

  // WebSocket: global live locations
  useEffect(() => {
    // Create socket only once
    if (!socketRef.current) {
      const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:4000");
      socketRef.current = socket;

      socket.on("donorLocationUpdated", (data) => {
        setDonorLocations((prev) => {
          const existing = prev.find((d) => d.userId === data.userId);
          if (existing) {
            return prev.map((d) => (d.userId === data.userId ? data : d));
          }
          return [...prev, data];
        });
      });

      socket.on("hospitalLocationUpdated", (data) => {
        setHospitalLocations((prev) => {
          const existing = prev.find((h) => h.userId === data.userId);
          if (existing) {
            return prev.map((h) => (h.userId === data.userId ? data : h));
          }
          return [...prev, data];
        });
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const toggleActive = async (id, current) => {
    try {
      const res = await api.patch(`/admin/users/${id}/active`, {
        isActive: !current,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? res.data : u))
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const downloadLogs = async () => {
    try {
      setDownloadingLogs(true);
      const res = await api.get("/admin/logs", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bloodlink-logs.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to download logs");
    } finally {
      setDownloadingLogs(false);
    }
  };

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <h2 style={{ marginBottom: "0.25rem" }}>Admin Dashboard</h2>
      <p style={{ marginTop: 0, color: "#9ca3af", fontSize: "0.9rem" }}>
        Monitor the entire BloodLink system: analytics, live locations, users, and logs.
      </p>

      {/* TOP: Stats / analytics */}
      <section
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "0.9rem",
        }}
      >
        {loadingStats || !stats ? (
          <div>Loading stats...</div>
        ) : (
          <>
            <div className="card" style={{ padding: "0.9rem" }}>
              <div className="label">Total donors</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                {stats.totalDonors}
              </div>
            </div>
            <div className="card" style={{ padding: "0.9rem" }}>
              <div className="label">Total hospitals</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                {stats.totalHospitals}
              </div>
            </div>
            <div className="card" style={{ padding: "0.9rem" }}>
              <div className="label">Open requests</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                {stats.openRequests}
              </div>
            </div>
            <div className="card" style={{ padding: "0.9rem" }}>
              <div className="label">Emergency open</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                {stats.emergencyOpen}
              </div>
            </div>
            <div className="card" style={{ padding: "0.9rem" }}>
              <div className="label">Fulfilled requests</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                {stats.fulfilledRequests}
              </div>
            </div>
            <div className="card" style={{ padding: "0.9rem" }}>
              <div className="label">Total donations</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
                {stats.totalDonations}
              </div>
            </div>
            <div className="card" style={{ padding: "0.9rem", border: "2px solid rgba(249,115,22,0.4)" }}>
              <div className="label">Pending Verifications</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 600, color: "#f97316" }}>
                {stats.pendingVerifications || 0}
              </div>
            </div>
          </>
        )}
      </section>

      {/* MIDDLE: Global live map */}
      <section style={{ marginTop: "1.6rem" }}>
        <div className="card">
          <h3
            style={{
              fontSize: "0.95rem",
              marginTop: 0,
              marginBottom: "0.4rem",
            }}
          >
            Global live map – donors & hospitals
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginTop: 0 }}>
            See all donors and hospitals sharing their real-time location on the platform.
          </p>
          <LiveMap donors={donorLocations} hospitals={hospitalLocations} />
        </div>
      </section>

      {/* BOTTOM: Users & Logs */}
      <section
        style={{
          marginTop: "1.6rem",
          display: "grid",
          gridTemplateColumns: "2.2fr 1.2fr",
          gap: "1.4rem",
        }}
      >
        {/* User management */}
        <div className="card">
          <h3
            style={{
              marginTop: 0,
              marginBottom: "0.5rem",
              fontSize: "0.95rem",
            }}
          >
            User management
          </h3>
          {loadingUsers ? (
            <div>Loading users...</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                    <td style={{ fontSize: "0.8rem" }}>{u.email}</td>
                    <td>
                      {u.isActive ? (
                        <span className="badge badge-open">Active</span>
                      ) : (
                        <span className="badge badge-emer">Disabled</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline"
                        type="button"
                        onClick={() => toggleActive(u._id, u.isActive)}
                      >
                        {u.isActive ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Logs panel */}
        <div className="card">
          <h3
            style={{
              marginTop: 0,
              marginBottom: "0.6rem",
              fontSize: "0.95rem",
            }}
          >
            System logs
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#9ca3af",
              marginBottom: "0.8rem",
            }}
          >
            Download raw application logs for auditing or debugging. This includes
            request traces and performance timings.
          </p>
          <button
            className="btn btn-outline"
            type="button"
            onClick={downloadLogs}
            disabled={downloadingLogs}
          >
            {downloadingLogs ? "Preparing..." : "Download logs file"}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/admin/analytics")}
            style={{ marginTop: "0.5rem" }}
          >
            View Analytics
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/admin/hospital-verification")}
            style={{ marginTop: "0.5rem", backgroundColor: "#f97316" }}
          >
            📝 Hospital Verification
          </button>

        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;