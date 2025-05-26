import React from "react";
import "../styles/Perfil.css";

/**
 * Página de perfil del usuario.
 */
export default function Perfil() {
  return (
    <div className="perfil-page card">
      <h2>Mi Perfil</h2>

      {/* Información de usuario */}
      <div className="perfil-info">
        <img
          src="https://api.dicebear.com/7.x/initials/svg?seed=Usuario"
          alt="Avatar"
          className="perfil-avatar"
        />
        <div>
          <p><strong>Nombre:</strong> Usuario Demo</p>
          <p><strong>Email:</strong> usuario@email.com</p>
        </div>
      </div>

      {/* Acciones del perfil */}
      <div className="perfil-actions">
        <a href="/favoritos" className="btn">Favoritos</a>
        <a href="/alergenos" className="btn btn-secondary">Alérgenos</a>
      </div>
    </div>
  );
}
