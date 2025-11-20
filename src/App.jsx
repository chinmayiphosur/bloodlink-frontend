// frontend/src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DonorProfile from "./pages/DonorProfile";
import DonorCertificates from "./pages/DonorCertificates";
import HospitalProfile from "./pages/HospitalProfile";
import BloodInventory from "./pages/BloodInventory";
import ChatPage from "./pages/ChatPage";
import PublicBloodAvailability from "./pages/PublicBloodAvailability";
import Analytics from "./pages/Analytics";
import RequestsManagement from "./pages/RequestsManagement";
import HospitalVerification from "./pages/HospitalVerification";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blood-availability" element={<PublicBloodAvailability />} />

        <Route
          path="/donor"
          element={
            <ProtectedRoute roles={["donor"]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/profile"
          element={
            <ProtectedRoute roles={["donor"]}>
              <DonorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/certificates"
          element={
            <ProtectedRoute roles={["donor"]}>
              <DonorCertificates />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital"
          element={
            <ProtectedRoute roles={["hospital"]}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/profile"
          element={
            <ProtectedRoute roles={["hospital"]}>
              <HospitalProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/inventory"
          element={
            <ProtectedRoute roles={["hospital"]}>
              <BloodInventory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/chats"
          element={
            <ProtectedRoute roles={["hospital"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/requests"
          element={
            <ProtectedRoute roles={["hospital"]}>
              <RequestsManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute roles={["admin"]}>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hospital-verification"
          element={
            <ProtectedRoute roles={["admin"]}>
              <HospitalVerification />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
