// frontend/src/pages/HospitalDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { io } from "socket.io-client";
import LiveMap from "../components/LiveMap";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const HospitalDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    bloodGroup: "O+",
    units: 1,
    city: "",
    pincode: "",
    isEmergency: false,
  });

  const [requests, setRequests] = useState([]);
  const [stocks, setStocks] = useState({
    "O+": 0,
    "O-": 0,
    "A+": 0,
    "A-": 0,
    "B+": 0,
    "B-": 0,
    "AB+": 0,
    "AB-": 0,
  });
  const [bloodLent, setBloodLent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [suggestedDonors, setSuggestedDonors] = useState([]);

  const [donorLocations, setDonorLocations] = useState([]);
  const [hospitalLocation, setHospitalLocation] = useState(null);

  const [pledgeNotification, setPledgeNotification] = useState(null);

  const [trackedDonor, setTrackedDonor] = useState(null);
  const [trackedDistanceKm, setTrackedDistanceKm] = useState(null);
  const [trackedEtaMin, setTrackedEtaMin] = useState(null);
  const [arrivedDonorIds, setArrivedDonorIds] = useState([]);
  
  const socketRef = useRef(null);

  const loadData = async () => {
    try {
      const [reqRes, invRes] = await Promise.all([
        api.get("/requests/mine"),
        api.get("/inventory/mine")
      ]);
      setRequests(reqRes.data);
      
      // Load inventory stocks and blood lent
      if (invRes.data) {
        const stocksObj = {};
        Object.keys(stocks).forEach(bg => {
          stocksObj[bg] = invRes.data.stocks?.[bg] || 0;
        });
        setStocks(stocksObj);
        
        // Calculate total blood lent
        const lentObj = invRes.data.bloodLent || {};
        const totalLent = Object.values(lentObj).reduce((sum, val) => sum + (val || 0), 0);
        setBloodLent(totalLent);
        
        // Find low stock blood groups and suggest donors
        const lowStockGroups = Object.keys(stocksObj).filter(bg => stocksObj[bg] < 5);
        if (lowStockGroups.length > 0) {
          loadSuggestedDonors(lowStockGroups);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const loadSuggestedDonors = async (bloodGroups) => {
    try {
      const res = await api.get("/donors/me/nearby-requests");
      // This returns donors, but we need to filter by blood group
      // Since we don't have a direct donor API, we'll use a workaround
      setSuggestedDonors(bloodGroups);
    } catch (err) {
      console.error("Failed to load suggested donors", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const haversineKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    // Create socket only once
    if (!socketRef.current) {
      const socket = io(import.meta.env.VITE_BACKEND_URL, { transports: ['websocket'] });
      socketRef.current = socket;

      socket.on("donorLocationUpdated", (data) => {
        setDonorLocations((prev) => {
          const exists = prev.find((d) => d.userId === data.userId);
          if (exists) {
            return prev.map((d) => (d.userId === data.userId ? data : d));
          }
          return [...prev, data];
        });
      });

      socket.on("donorPledged", (data) => {
        setPledgeNotification(
          `Donor ${data.donorName} pledged for your request.`
        );
        loadData();
        setTimeout(() => setPledgeNotification(null), 7000);
      });
    }

    // Register user when user._id is available
    if (user?._id && socketRef.current) {
      socketRef.current.emit("registerUser", user._id);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?._id]);
  
  // Separate effect for location-based calculations
  useEffect(() => {
    if (!hospitalLocation) return;
    
    donorLocations.forEach(data => {
      const distKm = haversineKm(
        hospitalLocation.latitude,
        hospitalLocation.longitude,
        data.latitude,
        data.longitude
      );

      if (trackedDonor && trackedDonor.donorId === data.userId) {
        setTrackedDistanceKm(distKm);
        const speedKmh = 25;
        const etaMin = (distKm / speedKmh) * 60;
        setTrackedEtaMin(etaMin);
      }

      const isAccepted = requests.some(
        (req) => req.acceptedDonor && req.acceptedDonor._id === data.userId
      );

      if (isAccepted && distKm <= 1) {
        setArrivedDonorIds((prev) => {
          if (prev.includes(data.userId)) return prev;
          alert(
            `🚨 Donor is arriving (within ~${distKm.toFixed(1)} km).`
          );
          return [...prev, data.userId];
        });
      }
    });
  }, [hospitalLocation, donorLocations, trackedDonor, requests]);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("No geolocation support.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setHospitalLocation(coords);

        api
          .patch("/admin/hospital/location", coords)
          .catch((err) =>
            console.error("Failed hospital GPS update", err)
          );
      },
      (err) => console.error("Hospital GPS error:", err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const onChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name in stocks) {
      setStocks((s) => ({ ...s, [name]: Number(value) }));
    } else {
      setForm((f) => ({
        ...f,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const createRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/requests", form);
      alert(`Request created. Matched donors: ${res.data.matchedDonorsCount}`);
      setForm((f) => ({ ...f, units: 1, isEmergency: false }));
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create request");
    }
  };

  const saveInventory = async () => {
    try {
      await api.post("/inventory", { stocks });
      alert("Inventory saved.");
    } catch (err) {
      alert("Failed to save inventory");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/requests/${id}/status`, { status });
      if (status === "fulfilled" && res.status >= 400) {
        alert("Select a donor before fulfilling.");
      }
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const acceptDonor = async (requestId, donorId) => {
    try {
      await api.patch(`/requests/${requestId}/accept-donor`, { donorId });
      alert("Donor accepted.");
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept donor");
    }
  };

  const startTrackingDonor = (request, donor) => {
    if (!hospitalLocation) {
      alert("Enable GPS to track.");
      return;
    }
    setTrackedDonor({
      donorId: donor._id,
      donorName: donor.name,
      requestId: request._id,
    });
    setTrackedDistanceKm(null);
    setTrackedEtaMin(null);
  };

  const stopTrackingDonor = () => {
    setTrackedDonor(null);
    setTrackedDistanceKm(null);
    setTrackedEtaMin(null);
  };

  let route = null;
  if (hospitalLocation && trackedDonor) {
    const loc = donorLocations.find(
      (d) => d.userId === trackedDonor.donorId
    );
    if (loc) {
      route = {
        from: hospitalLocation,
        to: { latitude: loc.latitude, longitude: loc.longitude },
      };
    }
  }

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <h2>Hospital Dashboard</h2>

      {/* TOP ACTION BUTTONS */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/hospital/inventory')}
        >
          Manage Blood Inventory
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/hospital/chats')}
        >
          View Chat Windows
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/hospital/requests')}
        >
          Manage Requests & Pledges
        </button>
      </div>

      {/* BLOOD STATISTICS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="label">Total Blood in Stock</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#4ade80' }}>
            {Object.values(stocks).reduce((a, b) => a + b, 0)} units
          </div>
        </div>
        <div className="card">
          <div className="label">Blood Lent to Receivers</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#60a5fa' }}>
            {bloodLent} units
          </div>
        </div>
        <div className="card">
          <div className="label">Active Requests</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f59e0b' }}>
            {requests.filter(r => r.status === 'open').length}
          </div>
        </div>
        <div className="card">
          <div className="label">Fulfilled Requests</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#8b5cf6' }}>
            {requests.filter(r => r.status === 'fulfilled').length}
          </div>
        </div>
      </div>

      {/* LOW STOCK ALERT & DONOR SUGGESTIONS */}
      {suggestedDonors.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <h3 style={{ color: '#ef4444', marginTop: 0 }}>🔴 Low Stock Alert!</h3>
          <p style={{ marginBottom: '1rem' }}>The following blood groups have critical low stock (less than 5 units):</p>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {suggestedDonors.map(bg => (
              <div key={bg} style={{ padding: '0.6rem 1rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '0.5rem', fontWeight: 600 }}>
                {bg}: {stocks[bg]} units
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#9ca3af' }}>
            Consider creating a request to alert nearby donors of these blood groups.
          </p>
        </div>
      )}

      {pledgeNotification && (
        <div className="notification-green">{pledgeNotification}</div>
      )}

      {hospitalLocation && (
        <div className="card">
          <h3>Live donor map</h3>

          {trackedDonor && (
            <div className="tracking-box">
              <div>
                <strong>Tracking {trackedDonor.donorName}</strong>
                <div>
                  {trackedDistanceKm != null ? (
                    <>
                      Distance:{" "}
                      <strong>{trackedDistanceKm.toFixed(2)} km</strong> · ETA:{" "}
                      <strong>
                        {trackedEtaMin
                          ? `${Math.max(
                              1,
                              Math.round(trackedEtaMin)
                            )} min`
                          : "..." }
                      </strong>
                    </>
                  ) : (
                    <>Waiting for donor GPS…</>
                  )}
                </div>
              </div>
              <button onClick={stopTrackingDonor}>Stop</button>
            </div>
          )}

          <LiveMap
            donors={donorLocations}
            hospitals={[
              {
                userId: user?._id,
                name: user?.name || "Hospital",
                latitude: hospitalLocation.latitude,
                longitude: hospitalLocation.longitude,
              },
            ]}
            route={route}
          />
        </div>
      )}

      <section className="grid-2">
        {/* =============== LEFT SIDE =============== */}
        <div className="card">
          <h3>Raise new request</h3>

          <form
            onSubmit={createRequest}
            className="form-grid"
          >
            <div>
              <div className="label">Blood Group</div>
              <select
                className="input"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
              >
                {Object.keys(stocks).map((bg) => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="label">Units</div>
              <input
                type="number"
                className="input"
                name="units"
                min="1"
                value={form.units}
                onChange={onChange}
              />
            </div>

            <div>
              <div className="label">City</div>
              <input
                className="input"
                name="city"
                value={form.city}
                onChange={onChange}
              />
            </div>

            <div>
              <div className="label">Pincode</div>
              <input
                className="input"
                name="pincode"
                value={form.pincode}
                onChange={onChange}
              />
            </div>

            <div className="checkbox-line">
              <input
                id="isEmergency"
                type="checkbox"
                name="isEmergency"
                checked={form.isEmergency}
                onChange={onChange}
              />
              <label htmlFor="isEmergency">Emergency request</label>
            </div>
          </form>

          <button className="btn btn-primary" onClick={createRequest}>
            Create Request
          </button>

          <h3 style={{ marginTop: "1.5rem" }}>
            Recent requests & pledged donors
          </h3>

          {loading ? (
            <div>Loading...</div>
          ) : requests.length === 0 ? (
            <div>No requests yet.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Blood</th>
                  <th>Units</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {requests.map((r) => (
                  <React.Fragment key={r._id}>
                    {/* MAIN REQUEST ROW */}
                    <tr>
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
                        {r.status}
                        {r.acceptedDonor && (
                          <div className="accepted-small">
                            Accepted: {r.acceptedDonor.name}
                          </div>
                        )}
                      </td>

                      <td>
                        {r.status === "open" && (
                          <div className="row-actions">
                            <button
                              className="btn btn-outline"
                              onClick={() => updateStatus(r._id, "fulfilled")}
                            >
                              Fulfilled
                            </button>
                            <button
                              className="btn btn-outline"
                              onClick={() => updateStatus(r._id, "cancelled")}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* ============= PLEDGED DONORS ROW ============= */}
                    <tr>
                      <td colSpan={5}>
                        {r.pledgedDonors?.length > 0 ? (
                          <div className="pledge-list">
                            <div className="pledge-title">
                              Pledged donors:
                            </div>

                            {r.pledgedDonors.map((p) => (
                              <div className="pledge-card" key={p._id}>
                                <div>
                                  <div className="bold">
                                    {p.donor?.name || "Donor"}
                                  </div>
                                  <div className="small">
                                    {p.donor?.email &&
                                      `${p.donor.email} · `}
                                    {p.donor?.phone}
                                  </div>
                                </div>

                                {/* ACCEPTED / BUTTONS */}
                                <div className="pledge-buttons">
                                  {r.acceptedDonor &&
                                  r.acceptedDonor._id === p.donor?._id ? (
                                    <>
                                      <span className="badge badge-open accepted">
                                        Accepted
                                      </span>
                                      <button
                                        className="btn btn-outline"
                                        onClick={() =>
                                          startTrackingDonor(r, p.donor)
                                        }
                                      >
                                        Track donor
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      className="btn btn-outline"
                                      disabled={!!r.acceptedDonor}
                                      onClick={() =>
                                        acceptDonor(r._id, p.donor._id)
                                      }
                                    >
                                      {r.acceptedDonor
                                        ? "Selected"
                                        : "Accept donor"}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="small grey">
                            No donors pledged yet.
                          </div>
                        )}
                      </td>
                    </tr>


                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>


      </section>
    </main>
  );
};

export default HospitalDashboard;
