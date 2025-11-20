import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "donor",
    bloodGroup: "",
    city: "",
    pincode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { ...form };
      if (payload.role !== "donor") {
        delete payload.bloodGroup;
      }
      // Just signup, don't try to login immediately
      await api.post("/auth/signup", payload);
      // Redirect to login page with success message
      navigate("/login?signup=success");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout" style={{ marginTop: "2.5rem", maxWidth: 720 }}>
      <div className="card">
        <h2 style={{ margin: 0, marginBottom: "0.25rem" }}>Create your account</h2>
        <p style={{ marginTop: 0, marginBottom: "1.4rem", fontSize: "0.9rem", color: "#9ca3af" }}>
          Choose your role and join the BloodLink network.
        </p>
        <form onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
          <div>
            <div className="label">Full Name</div>
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <div className="label">Email</div>
            <input
              className="input"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <div className="label">Password</div>
            <input
              className="input"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <div className="label">Role</div>
            <select
              className="input"
              name="role"
              value={form.role}
              onChange={onChange}
            >
              <option value="donor">Donor</option>
              <option value="hospital">Hospital</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.role === "donor" && (
            <div>
              <div className="label">Blood Group</div>
              <select
                className="input"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                required
              >
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          )}
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
        </form>
        {error && (
          <div style={{ color: "#fecaca", fontSize: "0.82rem", marginTop: "0.9rem" }}>
            {error}
          </div>
        )}
        <div style={{ marginTop: "1.2rem" }}>
          <button className="btn btn-primary" onClick={onSubmit} disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Signup;
