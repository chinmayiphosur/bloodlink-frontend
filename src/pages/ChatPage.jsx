import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Get unique accepted donors across all requests
  const getUniqueDonors = () => {
    const uniqueDonors = [];
    const donorMap = new Map();
    
    requests.forEach(req => {
      if (req.acceptedDonor && !donorMap.has(req.acceptedDonor._id)) {
        donorMap.set(req.acceptedDonor._id, {
          donor: req.acceptedDonor,
          requestId: req._id
        });
        uniqueDonors.push(donorMap.get(req.acceptedDonor._id));
      }
    });

    return uniqueDonors;
  };

  const uniqueDonors = getUniqueDonors();

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2>Chat Windows</h2>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          ← Back to Dashboard
        </button>
      </div>

      {loading ? (
        <div className="card">Loading...</div>
      ) : uniqueDonors.length > 0 ? (
        <div>
          {uniqueDonors.map(({ donor, requestId }) => (
            <div key={donor._id} className="card" style={{ marginBottom: "1rem" }}>
              <h3>Chat with Donor: {donor.name}</h3>
              <div className="small grey" style={{ marginBottom: "1rem" }}>
                Email: {donor.email} | Phone: {donor.phone}
              </div>
              <ChatWindow requestId={requestId} user={user} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card">
          <p className="small grey">No active chats. Accept a donor from your requests to start chatting.</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
            Go to Dashboard
          </button>
        </div>
      )}
    </main>
  );
};

export default ChatPage;
