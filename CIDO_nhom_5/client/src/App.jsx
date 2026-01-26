import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Feed from "./pages/Feed.jsx";
import RestaurantsPage from "./pages/RestaurantsPage.jsx";
import RestaurantDetail from "./pages/RestaurantDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        }
      />

      <Route
        path="/restaurants"
        element={
          <ProtectedRoute>
            <RestaurantsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/restaurants/:id"
        element={
          <ProtectedRoute>
            <RestaurantDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<div style={{ padding: 16 }}>404</div>} />
    </Routes>
  );
}
