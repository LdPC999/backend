// components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css"; // Creamos el css adaptado a tus colores y marca

/**
 * Navbar principal fijo arriba, con enlaces y logo.
 * Los enlaces usan react-router-dom para navegación SPA.
 */
export default function Navbar() {
  const location = useLocation();

  // Puedes marcar activo el enlace según la ruta actual
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-app">
      <ul>
        {/* Logo (puedes poner un icono diferente si quieres) */}
        <li>
          <Link to="/home" className="logo" aria-label="Logo">
            <i className="fa-solid fa-utensils"></i>
          </Link>
        </li>
        <li>
          <Link to="/home" className={`link ${isActive("/home") ? "active" : ""}`}>Home</Link>
        </li>
        <li>
          <Link to="/planificador" className={`link ${isActive("/planificador") ? "active" : ""}`}>Planificador</Link>
        </li>
        <li>
          <Link to="/recetas" className={`link ${isActive("/recetas") ? "active" : ""}`}>Recetas</Link>
        </li>
        <li>
          <Link to="/perfil" className={`link ${isActive("/perfil") ? "active" : ""}`}>Perfil</Link>
        </li>
      </ul>
    </nav>
  );
}
