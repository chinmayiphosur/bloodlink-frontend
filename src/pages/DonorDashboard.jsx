// frontend/src/pages/DonorDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { io } from "socket.io-client";
import LiveMap from "../components/LiveMap";
import ChatWindow from "../components/ChatWindow";
import { useTranslation } from "react-i18next";

const DonorDashboard = () => {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const [availability, setAvailability] = useState(user?.isAvailable || false);
  const [requests, setRequests] = useState([]);
  const [mine, setMine] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [myLocation, setMyLocation] = useState(null);
  const [hospitalLocations, setHospitalLocations] = useState([]);
  const [routeTarget, setRouteTarget] = useState(null);
  
  const socketRef = useRef(null);

  const loadData = async () => {
    try {
      const [nearbyRes, mineRes, meRes, certsRes] = await Promise.all([
        api.get("/donors/me/nearby-requests"),
        api.get("/requests/mine"),
        api.get("/auth/me"),
        api.get("/donors/me/certificates"),
      ]);
      setRequests(nearbyRes.data);
      setMine(mineRes.data);
      updateUser(meRes.data);
      setCertificates(certsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    // Create socket only once
    if (!socketRef.current) {
      const socket = io("http://localhost:4000");
      socketRef.current = socket;

      // Join user's personal notification room
      if (user?._id) {
        socket.emit("joinUser", user._id);
      }

      // Listen for emergency alerts
      socket.on("emergencyAlert", (data) => {
        const { bloodGroup, units, hospitalName } = data;
        
        // Show browser notification if permitted
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🚨 Emergency Blood Request!", {
            body: `${hospitalName} urgently needs ${units} unit(s) of ${bloodGroup} blood!`,
            icon: "/favicon.ico",
            tag: "emergency-blood",
          });
        }

        // Show alert popup
        alert(
          `🚨 EMERGENCY BLOOD REQUEST!\n\n` +
          `Hospital: ${hospitalName}\n` +
          `Blood Group: ${bloodGroup}\n` +
          `Units Needed: ${units}\n\n` +
          `Please check the dashboard for details.`
        );

        // Reload data to show new emergency request
        loadData();
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
  }, [user]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Browser lacks geolocation.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setMyLocation(coords);

        api.patch("/donors/me/location", coords).catch((err) =>
          console.error("Failed to update donor location", err)
        );
      },
      (err) => console.error("GPS error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const toggleAvailability = async () => {
    try {
      const res = await api.patch("/donors/me/availability", {
        isAvailable: !availability,
      });
      setAvailability(res.data.isAvailable);
      updateUser({ ...user, isAvailable: res.data.isAvailable });
    } catch (err) {
      alert("Failed to update availability");
    }
  };

  const pledge = async (id) => {
    try {
      await api.post(`/requests/${id}/pledge`);
      alert("Thank you! Your pledge is recorded.");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not pledge");
    }
  };

  const currentPoints = user?.points ?? 0;
  const currentBadge = user?.badgeLevel || "Bronze";

  // Deduplicate chat windows by hospital - show only one chat per unique hospital
  const uniqueHospitalChats = React.useMemo(() => {
    const hospitalMap = new Map();
    mine.forEach((r) => {
      // Only include requests where this donor is accepted
      if (
        r.acceptedDonor &&
        (r.acceptedDonor._id === user?._id || r.acceptedDonor._id === user?.id) &&
        r.hospital?._id
      ) {
        // Use hospital ID as key to avoid duplicates
        if (!hospitalMap.has(r.hospital._id)) {
          hospitalMap.set(r.hospital._id, {
            hospitalId: r.hospital._id,
            hospitalName: r.hospital.name,
            requestId: r._id, // Use the first request for this hospital
            requests: [r],
          });
        } else {
          // Add this request to the existing hospital entry
          hospitalMap.get(r.hospital._id).requests.push(r);
        }
      }
    });
    return Array.from(hospitalMap.values());
  }, [mine, user]);

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <h2>{t("donorDashboard")}</h2>
      <p style={{ color: "#9ca3af" }}>{t("helpHospitals")}</p>

      {/* Rewards */}
      <section
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "0.9rem",
        }}
      >
        <div className="card">
          <div className="label">{t("yourPoints")}</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
            {currentPoints}
          </div>
        </div>
        <div className="card">
          <div className="label">{t("badgeLevel")}</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
            {currentBadge}
          </div>
        </div>
        <div className="card">
          <div className="label">{t("certificates")}</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
            {certificates.length}
          </div>
        </div>
      </section>

      {/* Certificates Section - MOVED TO TOP */}
      {certificates.length > 0 && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3>Your Donation Certificates</h3>
          <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>
            Download your certificates for your resume and records.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}
          >
            {certificates.map((cert) => (
              <div
                key={cert._id}
                style={{
                  padding: "1rem",
                  border: "1px solid rgba(51,65,85,0.8)",
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
                    <div style={{ fontWeight: 600, marginBottom: "0.3rem" }}>
                      {cert.request?.hospital?.name || "Hospital"}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(cert.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <span
                    className="badge badge-open"
                    style={{ backgroundColor: "#10b981" }}
                  >
                    {cert.request?.bloodGroup}
                  </span>
                </div>

                <div style={{ marginBottom: "0.8rem" }}>
                  <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                    Points Awarded: <strong>{cert.pointsAwarded}</strong>
                  </div>
                </div>

                <a
                  href={`http://localhost:4000${cert.certificateUrl}`}
                  download
                  className="btn btn-primary"
                  style={{ width: "100%", textAlign: "center" }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📄 Download Certificate
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live map */}
      {myLocation && (
        <div className="card" style={{ marginTop: "1.2rem" }}>
          <h3>Live map – you & hospitals</h3>
          <LiveMap
            donors={[
              {
                userId: user?._id,
                name: user?.name || "You",
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              },
            ]}
            hospitals={hospitalLocations}
            route={
              routeTarget && myLocation
                ? { from: myLocation, to: routeTarget }
                : null
            }
          />
        </div>
      )}

      {/* Main Content - SIDE BY SIDE: Requests on left, Chats on right */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1.8fr 1.2fr",
          gap: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        {/* LEFT SIDE — REQUESTS */}
        <div>
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.8rem",
              }}
            >
              <div>
                <div className="label">Availability</div>
                <div>
                  Your status:{" "}
                  <strong style={{ color: availability ? "#4ade80" : "#f97316" }}>
                    {availability ? "Available" : "Not Available"}
                  </strong>
                </div>
              </div>

              <button className="btn btn-outline" onClick={toggleAvailability}>
                {availability ? "Turn off" : "I'm available"}
              </button>
            </div>

            <h3>Matching requests near you</h3>

            {loading ? (
              <div>Loading...</div>
            ) : requests.length === 0 ? (
              <div>No nearby requests.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Hospital</th>
                    <th>Blood</th>
                    <th>Units</th>
                    <th>Urgency</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r._id}>
                      <td>{r.hospital?.name || "Hospital"}</td>
                      <td>{r.bloodGroup}</td>
                      <td>{r.units}</td>
                      <td>
                        {r.isEmergency ? (
                          <span className="badge badge-emer">Emergency</span>
                        ) : (
                          <span className="badge badge-open">Open</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => pledge(r._id)}
                        >
                          Pledge
                        </button>

                        {r.hospital?.latitude != null && myLocation && (
                          <button
                            className="btn btn-outline"
                            onClick={() =>
                              setRouteTarget({
                                latitude: r.hospital.latitude,
                                longitude: r.hospital.longitude,
                              })
                            }
                          >
                            Route
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Your Requests */}
          <div className="card">
            <h3>Your requests</h3>

            {mine.length === 0 ? (
              <div>No matched requests yet.</div>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {mine.map((r) => (
                  <li
                    key={r._id}
                    style={{
                      marginBottom: "0.8rem",
                      padding: "0.7rem",
                      borderRadius: "0.85rem",
                      border: "1px solid rgba(51,65,85,0.8)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.85rem",
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <span>
                        {r.bloodGroup} · {r.city || "Unknown"}
                      </span>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          textTransform: "capitalize",
                          color: "#9ca3af",
                        }}
                      >
                        {r.status}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                      {r.hospital?.name || "Hospital"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* RIGHT SIDE — CHATS */}
        <div>
          {uniqueHospitalChats.length === 0 ? (
            <div className="card">
              <h3>Hospital Communications</h3>
              <p style={{ color: "#9ca3af" }}>
                No active chats yet. Chat will appear here once a hospital accepts your donation.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {uniqueHospitalChats.map((hospital) => (
                <div
                  key={hospital.hospitalId}
                  className="card"
                  style={{
                    border: "2px solid rgba(230,57,70,0.3)",
                    backgroundColor: "rgba(30,41,59,0.6)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.8rem",
                      paddingBottom: "0.6rem",
                      borderBottom: "1px solid rgba(148,163,184,0.2)",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "1rem",
                        color: "#e63946",
                      }}
                    >
                      {hospital.hospitalName}
                    </h4>
                    <span
                      className="badge badge-open"
                      style={{ backgroundColor: "#3b82f6" }}
                    >
                      {hospital.requests.length} request(s)
                    </span>
                  </div>

                  <ChatWindow requestId={hospital.requestId} user={user} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default DonorDashboard;
