import React, { useState, useEffect } from "react";
import api from "../api";

const PublicBloodAvailability = () => {
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchBlood = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (city) params.city = city;
      if (pincode) params.pincode = pincode;
      
      const res = await api.get("/inventory", { params });
      setHospitals(res.data);
    } catch (err) {
      console.error("Failed to search blood availability", err);
      alert("Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <h2>Check Blood Availability</h2>
      <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
        Search for available blood in hospitals near you
      </p>

      {/* Search Form */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3>Search by Location</h3>
        <form onSubmit={searchBlood} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
          <div>
            <div className="label">City</div>
            <input
              type="text"
              className="input"
              placeholder="e.g., Bangalore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div>
            <div className="label">Pincode</div>
            <input
              type="text"
              className="input"
              placeholder="e.g., 560001"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="card">Loading...</div>
      ) : searched && hospitals.length === 0 ? (
        <div className="card">
          <p style={{ color: "#9ca3af" }}>No hospitals found in this area. Try a different location.</p>
        </div>
      ) : hospitals.length > 0 ? (
        <div>
          <h3 style={{ marginBottom: "1rem" }}>Available Blood Stock ({hospitals.length} hospitals)</h3>
          {hospitals.map((hospital) => (
            <div key={hospital._id} className="card" style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: "0.3rem" }}>{hospital.hospital?.name || "Hospital"}</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#9ca3af" }}>
                    {hospital.hospital?.city && `${hospital.hospital.city}, `}
                    {hospital.hospital?.pincode && `Pincode: ${hospital.hospital.pincode}`}
                  </p>
                  {hospital.hospital?.phone && (
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.2rem" }}>
                      📞 {hospital.hospital.phone}
                    </p>
                  )}
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.8rem" }}>
                {bloodGroups.map((bg) => {
                  const units = hospital.stocks?.[bg] || 0;
                  const isAvailable = units > 0;
                  return (
                    <div
                      key={bg}
                      style={{
                        padding: "0.8rem",
                        borderRadius: "0.5rem",
                        background: isAvailable ? "rgba(34, 197, 94, 0.1)" : "rgba(0,0,0,0.3)",
                        border: `1px solid ${isAvailable ? "rgba(34, 197, 94, 0.3)" : "rgba(255,255,255,0.1)"}`,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>{bg}</div>
                      <div style={{ fontSize: "1.2rem", fontWeight: 700, color: isAvailable ? "#22c55e" : "#9ca3af" }}>
                        {units} {units === 1 ? "unit" : "units"}
                      </div>
                      {isAvailable && <div style={{ fontSize: "0.7rem", color: "#22c55e", marginTop: "0.2rem" }}>✓ Available</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </main>
  );
};

export default PublicBloodAvailability;
