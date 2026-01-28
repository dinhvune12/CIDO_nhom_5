import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppShell from "./components/AppShell.jsx";

import Feed from "./pages/Feed.jsx";
import RestaurantsPage from "./pages/RestaurantsPage.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import AppointmentDetail from "./pages/AppointmentDetail.jsx";

function WithShell({ children }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/feed" element={<WithShell><Feed /></WithShell>} />
      <Route path="/restaurants" element={<WithShell><RestaurantsPage /></WithShell>} />
      <Route path="/restaurants/:id" element={<WithShell><RestaurantDetail /></WithShell>} />

      <Route path="/appointments" element={<WithShell><AppointmentsPage /></WithShell>} />
      <Route path="/appointments/:id" element={<WithShell><AppointmentDetail /></WithShell>} />

      <Route path="*" element={<div style={{ padding: 16 }}>404</div>} />
    </Routes>
  );
}
