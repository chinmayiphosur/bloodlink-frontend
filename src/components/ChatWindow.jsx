import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api from "../api";

const ChatWindow = ({ requestId, user }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!requestId) return;

    // Create socket connection
    const socket = io("http://localhost:4000", {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`✅ Socket connected for chat:${requestId}`, socket.id);
      setIsConnected(true);
      // Join the room
      socket.emit("joinChat", requestId);
      console.log(`📨 Joined room: chat:${requestId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected for chat:${requestId}`);
      setIsConnected(false);
    });

    // Load chat history
    loadHistory();

    // Listen for new messages
    const eventName = `chat:${requestId}`;
    socket.on(eventName, (data) => {
      console.log(`📩 Received message:`, data);
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup
    return () => {
      console.log(`🧹 Cleaning up chat:${requestId}`);
      socket.off(eventName);
      socket.disconnect();
    };
  }, [requestId]);

  const loadHistory = async () => {
    try {
      const res = await api.get(`/chat/${requestId}`);
      setMessages(res.data);
      console.log(`📜 Loaded ${res.data.length} messages`);
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  const sendMsg = async () => {
    if (!msg.trim()) return;
    try {
      console.log(`📤 Sending message:`, msg);
      await api.post(`/chat/${requestId}`, { message: msg });
      setMsg("");
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Failed to send message");
    }
  };

  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.2)",
        padding: "1rem",
        borderRadius: "0.8rem",
        height: "250px",
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "0.5rem",
          paddingRight: "5px",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: "0.4rem", fontSize: "0.85rem" }}>
            <strong>{m.sender?.name || "User"}:</strong> {m.message}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.4rem" }}>
        <input
          style={{ flex: 1 }}
          className="input"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" onClick={sendMsg}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
