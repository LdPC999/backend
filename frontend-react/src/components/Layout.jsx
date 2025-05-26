import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import "../styles/Layout.css";
import React from "react";

/**
 * Componente de layout principal que incluye header, footer y menú lateral
 */
export default function Layout() {
  const navigate = useNavigate();
  const canGoBack = window.history.length > 2;
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="app-layout">
      {/* Header con enlaces a perfil y logout */}
      <header className="app-header">
        <div className="header-left">
          <Link to="/perfil" aria-label="Perfil">
            👤
          </Link>
        </div>
        <div className="header-center">
          <span>NombreApp</span>
        </div>
        <div className="header-right">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            aria-label="Cerrar sesión"
          >
            LOGOUT
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="app-main">
        <Outlet />
      </main>

      {/* Footer con navegación */}
      <nav className="app-footer">
        {canGoBack ? (
          <button
            aria-label="Atrás"
            onClick={() => navigate(-1)}
          >
            ⬅️
          </button>
        ) : (
          <span style={{ width: "1.6em" }}></span>
        )}
        <Link to="/home" aria-label="Home">
          🏠
        </Link>
        <button
          aria-label="Menú"
          onClick={() => setShowMenu(true)}
        >
          ☰
        </button>
      </nav>

      {/* Menú lateral desplegable */}
      {showMenu && (
        <div className="side-menu" onClick={() => setShowMenu(false)}>
          <div
            className="side-menu-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowMenu(false)}
              style={{ float: "right" }}
              aria-label="Cerrar menú"
            >
              ✖️
            </button>
            <h3>Menú</h3>
            <ul>
              <li>
                <Link to="/home" onClick={() => setShowMenu(false)}>Home</Link>
              </li>
              <li>
                <Link to="/planificador" onClick={() => setShowMenu(false)}>Planificador</Link>
              </li>
              <li>
                <Link to="/recetas" onClick={() => setShowMenu(false)}>Recetas</Link>
              </li>
              <li>
                <Link to="/perfil" onClick={() => setShowMenu(false)}>Perfil</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
