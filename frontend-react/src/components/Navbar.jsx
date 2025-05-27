// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

/**
 * Navbar principal: menú centrado y botón de cerrar sesión alineado a la derecha.
 */
export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determina si el enlace está activo según la ruta actual
  const isActive = (path) => location.pathname === path;

  /**
   * Cierra sesión, elimina datos y redirige al login
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Si tienes más claves, elimínalas aquí
    navigate("/login");
  };

  return (
    <nav className="navbar-app">
      {/* Bloque izquierdo: Logo y título */}
      <div className="navbar-brand">
        <Link to="/home" className="navbar-logo" aria-label="Inicio">
          <i className="fa-solid fa-utensils"></i>
        </Link>
        <span className="navbar-title">Recipe Planner</span>
      </div>

      {/* Bloque central: menú de navegación */}
      <div className="navbar-menu-wrapper">
        <ul className="navbar-menu">
          <li>
            <Link to="/home" className={`link${isActive("/home") ? " active" : ""}`}>Home</Link>
          </li>
          <li>
            <Link to="/planificador" className={`link${isActive("/planificador") ? " active" : ""}`}>Planificador</Link>
          </li>
          <li>
            <Link to="/recetas" className={`link${isActive("/recetas") ? " active" : ""}`}>Recetas</Link>
          </li>
          <li>
            <Link to="/perfil" className={`link${isActive("/perfil") ? " active" : ""}`}>Perfil</Link>
          </li>
        </ul>
      </div>

      {/* Bloque derecho: botón de logout */}
      <div className="navbar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket logout-icon"></i>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
}
