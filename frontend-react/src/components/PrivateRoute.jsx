import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Componente que protege rutas privadas en la aplicación.
 * - Comprueba si hay un token JWT en el localStorage.
 * - Si no hay token, redirige automáticamente a la pantalla de login.
 * - Si existe el token, renderiza el componente hijo pasado como prop.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - El componente que se quiere renderizar si el usuario está autenticado.
 */
export default function PrivateRoute({ children }) {
  // Obtiene el token JWT del localStorage
  const token = localStorage.getItem("token");

  // Si no existe token, redirige a la ruta de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si existe token, renderiza los hijos
  return children;
}