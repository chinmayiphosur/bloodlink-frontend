// frontend/src/pages/DonorCertificates.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const DonorCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const res = await api.get("/donors/me/certificates");
      setCertificates(res.data);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout" style={{ marginTop: "2rem" }}>
      <h2>My Donation Certificates</h2>
      <p style={{ color: "#9ca3af", marginBottom: "1.5rem" }}>
        Download your certificates for your resume, portfolio, or records.
      </p>

      {loading ? (
        <div className="card">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="card">
          <h3>No certificates yet</h3>
          <p style={{ color: "#9ca3af" }}>
            Complete a donation to receive your first certificate!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {certificates.map((cert) => (
            <div
              key={cert._id}
              className="card"
              style={{
                background: "linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(51,65,85,0.6) 100%)",
                border: "2px solid rgba(230,57,70,0.3)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                  paddingBottom: "0.8rem",
                  borderBottom: "1px solid rgba(148,163,184,0.2)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      color: "#e63946",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {cert.request?.hospital?.name || "Hospital"}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
                    Certificate ID: {cert._id.slice(-8)}
                  </div>
                </div>
                <span
                  className="badge"
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    fontSize: "0.9rem",
                  }}
                >
                  {cert.request?.bloodGroup}
                </span>
              </div>

              {/* Details */}
              <div style={{ marginBottom: "1.2rem" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.8rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Donation Date
                    </div>
                    <div style={{ fontWeight: 500, marginTop: "0.2rem" }}>
                      {new Date(cert.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Points Awarded
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        marginTop: "0.2rem",
                        color: "#fbbf24",
                      }}
                    >
                      +{cert.pointsAwarded} points
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "0.8rem" }}>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Blood Type & Units
                  </div>
                  <div style={{ fontWeight: 500, marginTop: "0.2rem" }}>
                    {cert.request?.bloodGroup} • {cert.request?.units || 1}{" "}
                    unit(s)
                  </div>
                </div>

                {cert.certificateGeneratedAt && (
                  <div style={{ marginTop: "0.8rem" }}>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#9ca3af",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Certificate Generated
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        marginTop: "0.2rem",
                        color: "#9ca3af",
                      }}
                    >
                      {new Date(cert.certificateGeneratedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}
              <a
                href={`http://localhost:4000${cert.certificateUrl}`}
                download
                className="btn btn-primary"
                style={{
                  width: "100%",
                  textAlign: "center",
                  background: "#e63946",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>📄</span>
                <span>Download Certificate</span>
              </a>

              <div
                style={{
                  marginTop: "0.8rem",
                  padding: "0.6rem",
                  backgroundColor: "rgba(59,130,246,0.1)",
                  borderRadius: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  textAlign: "center",
                }}
              >
                💡 Perfect for resumes, portfolios, and job applications
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div
        className="card"
        style={{
          marginTop: "2rem",
          backgroundColor: "rgba(30,41,59,0.5)",
          borderLeft: "4px solid #e63946",
        }}
      >
        <h3>About Your Certificates</h3>
        <ul style={{ color: "#9ca3af", lineHeight: "1.8" }}>
          <li>
            Each certificate is digitally signed and includes your name, the
            hospital name, donation date, and blood type.
          </li>
          <li>
            Certificates are automatically generated when a hospital marks your
            donation as fulfilled.
          </li>
          <li>
            These certificates can be used for resume building, college
            applications, and job interviews.
          </li>
          <li>
            Keep your certificates safe - they serve as official proof of your
            contribution to society.
          </li>
        </ul>
      </div>
    </main>
  );
};

export default DonorCertificates;
