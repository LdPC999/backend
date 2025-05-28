import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Componente para proteger rutas privadas.
 * Solo permite acceso si existe un token JWT en localStorage.
 * Si no hay token, redirige automáticamente a /login.
 */
export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
