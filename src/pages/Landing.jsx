import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <main className="layout">
      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 2.1fr) minmax(0, 1.4fr)", gap: "2rem", marginTop: "2.5rem" }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", padding: "0.15rem 0.6rem", borderRadius: 999, border: "1px solid rgba(248,250,252,0.12)", fontSize: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ marginRight: "0.35rem" }}>⚡</span> Real-time blood request & donor matcher
          </div>
          <h1 style={{ fontSize: "2.6rem", lineHeight: 1.1, marginBottom: "0.8rem" }}>
            Save precious time
            <span style={{ display: "block", color: "#f97316" }}>when every drop counts.</span>
          </h1>
          <p style={{ maxWidth: 520, color: "#9ca3af", fontSize: "0.98rem" }}>
            BloodLink connects verified donors, hospitals, and patients on a single cloud-based platform.
            Raise authenticated requests, alert nearby donors instantly, and track availability on a live dashboard.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.4rem" }}>
            <Link to="/blood-availability">
              <button className="btn btn-primary">Check Blood Availability</button>
            </Link>
            <Link to="/signup">
              <button className="btn btn-outline">Get started – it's free</button>
            </Link>
            <Link to="/login">
              <button className="btn btn-outline">Login</button>
            </Link>
          </div>
          <div style={{ marginTop: "1.6rem", display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "#9ca3af" }}>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#e5e7eb" }}>3 roles</div>
              Donor, Hospital & Admin dashboards
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "#e5e7eb" }}>Location-based</div>
              Matches donors by pincode & blood group
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>Live Requests Snapshot</span>
              <span className="chip">Demo</span>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Blood</th>
                  <th>Urgency</th>
                  <th>Area</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sai City Hospital</td>
                  <td>O-</td>
                  <td><span className="badge badge-emer">Emergency</span></td>
                  <td>560076</td>
                </tr>
                <tr>
                  <td>Sunrise Medical</td>
                  <td>A+</td>
                  <td><span className="badge badge-open">Open</span></td>
                  <td>560034</td>
                </tr>
                <tr>
                  <td>Green Valley</td>
                  <td>B+</td>
                  <td><span className="badge badge-muted">Scheduled</span></td>
                  <td>560102</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "#9ca3af", marginBottom: "0.35rem" }}>
                Why BloodLink?
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 500, marginBottom: "0.2rem" }}>
                Built for speed, trust & transparency.
              </div>
              <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Role-based access, verified hospitals, and auditable history so every donation is traceable and safe.
              </p>
            </div>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "1rem",
                background:
                  "radial-gradient(circle at 20% 0%, #22c55e, transparent 60%), radial-gradient(circle at 80% 120%, #f97316, transparent 55%)",
              }}
            ></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
