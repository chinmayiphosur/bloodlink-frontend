// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "donor",
    adminKey: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check for signup success message
  const signupSuccess = new URLSearchParams(location.search).get("signup") === "success";

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        adminKey: form.role === "admin" ? form.adminKey : undefined,
      });

      login(res.data);

      // Redirect to appropriate dashboard based on the role they logged in as
      // (not based on the user's actual role, which might be different)
      const loginRole = form.role;
      if (loginRole === "donor") navigate("/donor");
      else if (loginRole === "hospital") navigate("/hospital");
      else if (loginRole === "admin") navigate("/admin");
      else navigate("/"); // fallback
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="layout" style={{ marginTop: "2.5rem", maxWidth: 640 }}>
      <div className="card">
        <h2 style={{ margin: 0, marginBottom: "0.25rem" }}>Welcome back</h2>
        <p style={{ marginTop: 0, marginBottom: "1.4rem", fontSize: "0.9rem", color: "#9ca3af" }}>
          Log in to your BloodLink dashboard.
        </p>

        {/* Signup Success Message */}
        {signupSuccess && (
          <div
            style={{
              padding: "0.8rem",
              backgroundColor: "rgba(34,197,94,0.15)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              color: "#86efac",
            }}
          >
            ✅ Account created successfully! Please log in.
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.9rem" }}>
          {/* Role Selection */}
          <div>
            <div className="label">Login As</div>
            <select name="role" className="input" value={form.role} onChange={onChange}>
              <option value="donor">Donor</option>
              <option value="hospital">Hospital</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Admin Key ONLY if role=admin */}
          {form.role === "admin" && (
            <div>
              <div className="label">Admin Access Key</div>
              <input
                className="input"
                name="adminKey"
                type="password"
                placeholder="Enter admin secret key"
                value={form.adminKey}
                onChange={onChange}
                required
              />
            </div>
          )}

          {error && (
            <div style={{ color: "#fecaca", fontSize: "0.82rem" }}>{error}</div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
