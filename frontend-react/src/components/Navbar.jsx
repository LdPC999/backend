// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css"; // Importa los estilos de la navbar

/**
 * Navbar principal fijo arriba, con logo+nombre y menú.
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
        <span className="navbar-title">NombreApp</span>
      </div>
      {/* Menú de navegación */}
      <ul className="navbar-menu">
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
        {/* Si necesitas un botón de logout, lo puedes añadir aquí */}
        {/* <li>
          <button className="link" id="logout" onClick={onLogout} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </li> */}
      </ul>
    </nav>
  );
}
