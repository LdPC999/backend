// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

/**
 * Navbar principal fijo arriba, con logo+nombre, menú y botón de logout.
 */
export default function Navbar({ onLogout }) {
  const location = useLocation();

  // Marca como activo el enlace del menú correspondiente a la ruta actual
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar-app">
      {/* Bloque superior: Logo y nombre */}
      <div className="navbar-brand">
        <Link to="/home" className="navbar-logo" aria-label="Logo">
          <i className="fa-solid fa-utensils"></i>
        </Link>
        <span className="navbar-title">Recipe Planner</span>
      </div>

      {/* Contenedor flexible para menú y logout */}
      <div className="navbar-content">
        {/* Menú de navegación */}
        <ul className="navbar-menu">
          <li>
            <Link to="/home" className={`link ${isActive("/home") ? "active" : ""}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/planificador" className={`link ${isActive("/planificador") ? "active" : ""}`}>
              Planificador
            </Link>
          </li>
          <li>
            <Link to="/recetas" className={`link ${isActive("/recetas") ? "active" : ""}`}>
              Recetas
            </Link>
          </li>
          <li>
            <Link to="/perfil" className={`link ${isActive("/perfil") ? "active" : ""}`}>
              Perfil
            </Link>
          </li>
        </ul>

        {/* Botón de logout */}
        <button className="logout-btn" onClick={onLogout}>
          <i className="fa-solid fa-right-from-bracket logout-icon"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
}
