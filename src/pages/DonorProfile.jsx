// frontend/src/pages/DonorProfile.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const DonorProfile = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    bloodGroup: user?.bloodGroup || "",
    phone: user?.phone || "",
    city: user?.city || "",
    pincode: user?.pincode || "",
    isAvailable: user?.isAvailable || false,
  });

  const [preview, setPreview] = useState(user?.profileImageUrl || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch latest profile from backend (optional but nice)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/donors/me/profile");
        const u = res.data.user;
        setForm({
          name: u.name || "",
          bloodGroup: u.bloodGroup || "",
          phone: u.phone || "",
          city: u.city || "",
          pincode: u.pincode || "",
          isAvailable: u.isAvailable || false,
        });
        setPreview(u.profileImageUrl || "");
        updateUser({ ...user, ...u });
      } catch (err) {
        console.error("Get donor profile error", err);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.patch("/donors/me/profile", form);
      const updated = res.data.user;
      updateUser({ ...user, ...updated });
      alert("Profile updated");
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
      const res = await api.post("/donors/me/profile-picture", fd, {
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

  return (
    <main className="layout" style={{ marginTop: "2rem", maxWidth: 720 }}>
      <div className="card">
        <h2 style={{ marginTop: 0, marginBottom: "0.25rem" }}>Donor profile</h2>
        <p style={{ marginTop: 0, marginBottom: "1.2rem", fontSize: "0.9rem", color: "#9ca3af" }}>
          Keep your details up to date so hospitals can reach you quickly in emergencies.
        </p>

        {/* Photo + basic info */}
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
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: "2.2rem" }}>🩸</span>
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
              {uploading ? "Uploading..." : "Change photo"}
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
              Status:{" "}
              <span
                style={{
                  color: form.isAvailable ? "#4ade80" : "#f97316",
                  fontWeight: 600,
                }}
              >
                {form.isAvailable ? "Available for donation" : "Not available"}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={onSave} style={{ display: "grid", gap: "0.9rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.9rem" }}>
            <div>
              <div className="label">Name</div>
              <input
                className="input"
                name="name"
                value={form.name}
                onChange={onChange}
              />
            </div>
            <div>
              <div className="label">Blood group</div>
              <select
                className="input"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
              >
                <option value="">Select</option>
                {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
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
          </div>

          <div style={{ marginTop: "0.4rem" }}>
            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontSize: "0.85rem" }}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={form.isAvailable}
                onChange={onChange}
              />
              I’m currently available for donations
            </label>
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

export default DonorProfile;
