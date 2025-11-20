// frontend/src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const onLogout = () => {
    logout();
    navigate("/");
  };

  const profilePath =
    user?.role === "donor"
      ? "/donor/profile"
      : user?.role === "hospital"
      ? "/hospital/profile"
      : "/admin";

  return (
    <nav
      style={{
        borderBottom: "1px solid rgba(148,163,184,0.2)",
        backdropFilter: "blur(18px)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "rgba(15,23,42,0.82)",
      }}
    >
      <div
        className="layout"
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 30% 0%, #f97316, transparent 60%), radial-gradient(circle at 70% 120%, #ef4444, transparent 60%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🩸
          </div>
          <Link
            to="/"
            style={{
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontSize: "0.9rem",
              textTransform: "uppercase",
            }}
          >
            {t("bloodlink")}
          </Link>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          {/* Language Switcher */}
          <div style={{ display: "flex", gap: "0.3rem", marginRight: "0.5rem" }}>
            <button
              onClick={() => changeLanguage("en")}
              style={{
                padding: "0.3rem 0.6rem",
                fontSize: "0.75rem",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: "0.4rem",
                background: i18n.language === "en" ? "rgba(230,57,70,0.3)" : "transparent",
                color: i18n.language === "en" ? "#fff" : "#9ca3af",
                cursor: "pointer",
                fontWeight: i18n.language === "en" ? 600 : 400,
              }}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage("kn")}
              style={{
                padding: "0.3rem 0.6rem",
                fontSize: "0.75rem",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: "0.4rem",
                background: i18n.language === "kn" ? "rgba(230,57,70,0.3)" : "transparent",
                color: i18n.language === "kn" ? "#fff" : "#9ca3af",
                cursor: "pointer",
                fontWeight: i18n.language === "kn" ? 600 : 400,
              }}
            >
              ಕನ್
            </button>
            <button
              onClick={() => changeLanguage("hi")}
              style={{
                padding: "0.3rem 0.6rem",
                fontSize: "0.75rem",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: "0.4rem",
                background: i18n.language === "hi" ? "rgba(230,57,70,0.3)" : "transparent",
                color: i18n.language === "hi" ? "#fff" : "#9ca3af",
                cursor: "pointer",
                fontWeight: i18n.language === "hi" ? 600 : 400,
              }}
            >
              हि
            </button>
          </div>
          
          {!user && (
            <Link to="/blood-availability">
              <button className="btn btn-outline">{t("checkAvailability")}</button>
            </Link>
          )}
          {user && (
            <>
              <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                {user.name} ·{" "}
                <span style={{ textTransform: "capitalize" }}>{t(user.role)}</span>
              </span>
              {/* 🆕 Profile button for logged-in users */}
              <Link to={profilePath}>
                <button className="btn btn-outline">{t("profile")}</button>
              </Link>
              {/* 🆕 Certificates for donors */}
              {user.role === "donor" && (
                <Link to="/donor/certificates">
                  <button className="btn btn-outline">📄 {t("certificates")}</button>
                </Link>
              )}
            </>
          )}
          {!user ? (
            <>
              <Link to="/login">
                <button className="btn btn-outline">{t("login")}</button>
              </Link>
              <Link to="/signup">
                <button className="btn btn-primary">{t("signup")}</button>
              </Link>
            </>
          ) : (
            <button className="btn btn-outline" onClick={onLogout}>
              {t("logout")}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
