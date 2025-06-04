import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { FiLogOut } from "react-icons/fi";

/**
 * Componente Navbar: barra de navegación principal de la aplicación.
 * - Contiene enlaces a las diferentes páginas.
 * - Indica qué enlace está activo actualmente.
 * - Incluye un botón para cerrar sesión y limpiar el almacenamiento local.
 */
export default function Navbar() {
  // Hook de React Router que permite obtener la ubicación actual (ruta)
  const location = useLocation();
  // Hook de React Router que permite redireccionar a otra ruta
  const navigate = useNavigate();

  /**
   * Función auxiliar que determina si un enlace está activo
   * según la ruta actual.
   * @param {string} path - La ruta a verificar.
   * @returns {boolean} true si está activo, false si no.
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Función que gestiona el cierre de sesión.
   * - Elimina el token y los datos del usuario almacenados en localStorage.
   * - Redirige a la página de login.
   */
  const handleLogout = () => {
    localStorage.removeItem("token"); // Borra el token
    localStorage.removeItem("user"); // Borra los datos del usuario
    // Aquí puedes añadir más claves a eliminar si las hay
    navigate("/login"); // Redirige a la pantalla de login
  };

  return (
    <nav className="navbar-app">
      {/* Bloque izquierdo: logo y título de la aplicación */}
      <div className="navbar-brand">
        <Link to="/home" className="navbar-logo" aria-label="Inicio">
          <i className="fa-solid fa-utensils"></i>
        </Link>
        <span className="navbar-title">Recipe Planner</span>
      </div>

      {/* Bloque central: lista de enlaces de navegación */}
      <div className="navbar-menu-wrapper">
        <ul className="navbar-menu">
          <li>
            <Link
              to="/home"
              className={`link${isActive("/home") ? " active" : ""}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/planificador"
              className={`link${isActive("/planificador") ? " active" : ""}`}
            >
              Planificador
            </Link>
          </li>
          <li>
            <Link
              to="/recetas"
              className={`link${isActive("/recetas") ? " active" : ""}`}
            >
              Recetas
            </Link>
          </li>
          <li>
            <Link
              to="/perfil"
              className={`link${isActive("/perfil") ? " active" : ""}`}
            >
              Perfil
            </Link>
          </li>
        </ul>
      </div>

      {/* Bloque derecho: botón para cerrar sesión */}
      <div className="navbar-logout">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="logout-icon" title="Cerrar sesión" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </nav>
  );
}
