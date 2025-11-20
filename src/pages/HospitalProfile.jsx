// frontend/src/pages/HospitalProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const HospitalProfile = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
    address: user?.address || "",
    accreditationNumber: user?.accreditationNumber || "",
    emergencyContact: user?.emergencyContact || "",
    licenseCertificateNumber: user?.licenseCertificateNumber || "",
    gstNumber: user?.gstNumber || "",
  });

  const [verificationStatus, setVerificationStatus] = useState(user?.verificationStatus || "pending");
  const [verificationNotes, setVerificationNotes] = useState(user?.verificationNotes || "");

  const [preview, setPreview] = useState(user?.profileImageUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Load latest profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/hospital/me/profile");
        const u = res.data.user;
        setForm({
          name: u.name || "",
          phone: u.phone || "",
          city: u.city || "",
          pincode: u.pincode || "",
          address: u.address || "",
          accreditationNumber: u.accreditationNumber || "",
          emergencyContact: u.emergencyContact || "",
          licenseCertificateNumber: u.licenseCertificateNumber || "",
          gstNumber: u.gstNumber || "",
        });
        setVerificationStatus(u.verificationStatus || "pending");
        setVerificationNotes(u.verificationNotes || "");
        setPreview(u.profileImageUrl || "");
        updateUser({ ...user, ...u });
      } catch (err) {
        console.error("Get hospital profile error", err);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/hospital/me/profile", form);
      const updated = res.data.user;
      updateUser({ ...user, ...updated });
      alert("Hospital profile updated");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const onImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await api.post("/hospital/me/profile-picture", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreview(res.data.profileImageUrl);
      updateUser({ ...user, profileImageUrl: res.data.profileImageUrl });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Auto-fill GPS (optional)
  const fillLocationFromGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const payload = {
            ...form,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          const res = await api.patch("/hospital/me/profile", payload);
          const updated = res.data.user;
          updateUser({ ...user, ...updated });
          alert("Location updated using GPS");
        } catch (err) {
          console.error(err);
          alert("Failed to save GPS location");
        }
      },
      (err) => {
        console.error("GPS error", err);
        alert("Could not fetch GPS location");
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <main className="layout" style={{ marginTop: "2rem", maxWidth: 820 }}>
      <div className="card">
        <h2 style={{ marginTop: 0, marginBottom: "0.25rem" }}>Hospital profile</h2>
        <p style={{ marginTop: 0, marginBottom: "1.2rem", fontSize: "0.9rem", color: "#9ca3af" }}>
          Keep your hospital details and emergency contacts accurate for donor trust and quick response.
        </p>

        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.4rem", alignItems: "center" }}>
          <div>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "999px",
                overflow: "hidden",
                border: "2px solid rgba(148,163,184,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15,23,42,0.9)",
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Hospital"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "2.2rem" }}>🏥</span>
              )}
            </div>
            <label
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                fontSize: "0.8rem",
                cursor: "pointer",
                color: "#38bdf8",
              }}
            >
              {uploading ? "Uploading..." : "Change logo"}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={onImageChange}
              />
            </label>
          </div>
          <div style={{ fontSize: "0.9rem", color: "#e5e7eb" }}>
            <div style={{ fontWeight: 600 }}>{form.name || user?.name}</div>
            <div style={{ fontSize: "0.85rem", color: "#9ca3af" }}>{user?.email}</div>
            <div style={{ marginTop: "0.3rem", fontSize: "0.85rem" }}>
              Emergency contact:{" "}
              <span style={{ fontWeight: 500 }}>
                {form.emergencyContact || "Not set"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={onSave} style={{ display: "grid", gap: "0.9rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "0.9rem",
            }}
          >
            <div>
              <div className="label">Hospital name</div>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={onChange}
              />
            </div>
            <div>
              <div className="label">Phone</div>
              <input
                className="input"
                name="phone"
                value={form.phone}
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
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="label">Address</div>
              <textarea
                className="input"
                name="address"
                value={form.address}
                onChange={onChange}
                rows={2}
              />
            </div>
            <div>
              <div className="label">Accreditation number</div>
              <input
                className="input"
                name="accreditationNumber"
                value={form.accreditationNumber}
                onChange={onChange}
              />
            </div>
            <div>
              <div className="label">Emergency contact number</div>
              <input
                className="input"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={onChange}
              />
            </div>
          </div>

          {/* Verification Documents Section */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "0.85rem",
              border: `2px solid ${verificationStatus === "approved" ? "rgba(34,197,94,0.4)" : verificationStatus === "rejected" ? "rgba(239,68,68,0.4)" : "rgba(148,163,184,0.4)"}`,
              backgroundColor: "rgba(15,23,42,0.5)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "0.5rem", fontSize: "1rem" }}>
              📝 Hospital Verification Documents
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: 0, marginBottom: "1rem" }}>
              Provide your license certificate number and GST number for admin verification.
            </p>

            {/* Verification Status Badge */}
            <div style={{ marginBottom: "1rem" }}>
              <span
                className="badge"
                style={{
                  backgroundColor:
                    verificationStatus === "approved"
                      ? "rgba(34,197,94,0.2)"
                      : verificationStatus === "rejected"
                      ? "rgba(239,68,68,0.2)"
                      : "rgba(249,115,22,0.2)",
                  color:
                    verificationStatus === "approved"
                      ? "#86efac"
                      : verificationStatus === "rejected"
                      ? "#fca5a5"
                      : "#fdba74",
                  padding: "0.3rem 0.8rem",
                  fontSize: "0.85rem",
                }}
              >
                Status: {verificationStatus.toUpperCase()}
              </span>
            </div>

            {verificationNotes && verificationStatus === "rejected" && (
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.8rem",
                  backgroundColor: "rgba(239,68,68,0.1)",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
              >
                <div style={{ fontSize: "0.75rem", color: "#fca5a5", marginBottom: "0.3rem" }}>
                  REJECTION REASON:
                </div>
                <div style={{ fontSize: "0.9rem", color: "#fecaca" }}>
                  {verificationNotes}
                </div>
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.9rem",
              }}
            >
              <div>
                <div className="label">License Certificate Number</div>
                <input
                  className="input"
                  name="licenseCertificateNumber"
                  value={form.licenseCertificateNumber}
                  onChange={onChange}
                  placeholder="e.g., LIC-2024-12345"
                />
              </div>
              <div>
                <div className="label">GST Number</div>
                <input
                  className="input"
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={onChange}
                  placeholder="e.g., 22AAAAA0000A1Z5"
                />
              </div>
            </div>

            {(form.licenseCertificateNumber || form.gstNumber) && verificationStatus === "pending" && (
              <div
                style={{
                  marginTop: "0.8rem",
                  padding: "0.6rem",
                  backgroundColor: "rgba(59,130,246,0.1)",
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                  color: "#9ca3af",
                }}
              >
                🕒 Your documents are pending admin verification. You will be notified once reviewed.
              </div>
            )}
          </div>

          <div style={{ marginTop: "0.4rem" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={fillLocationFromGPS}
            >
              Use current GPS location
            </button>
          </div>

          <div style={{ marginTop: "0.8rem" }}>
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default HospitalProfile;
