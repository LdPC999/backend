// src/pages/EditarPerfil.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth";
import "../styles/Perfil.css";

/**
 * Página para editar perfil de usuario.
 * Permite modificar: nombre, apellidos, alérgenos (con checkbox) y contraseña.
 */
export default function EditarPerfil() {
  // Estados para los datos del usuario
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [alergenos, setAlergenos] = useState([]);
  const [email, setEmail] = useState("");
  const [alergenosDisponibles, setAlergenosDisponibles] = useState([]);

  // Campos para cambio de contraseña
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para mensajes
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar usuario y alérgenos disponibles
  useEffect(() => {
    async function fetchPerfil() {
      try {
        const res = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        const data = await res.json();
        setUsuario(data);
        setNombre(data.nombre || "");
        setApellidos(data.apellidos || "");
        setAlergenos(data.alergenos || []);
        setEmail(data.email || "");
      } catch (err) {
        setError(err.message || "Error de red");
      }
    }
    async function fetchAlergenos() {
      try {
        const res = await fetch(`${API_URL}/alergenos`);
        const data = await res.json();
        setAlergenosDisponibles(data);
      } catch {
        setAlergenosDisponibles([]);
      }
    }
    fetchPerfil();
    fetchAlergenos();
  }, []);

  // Checkbox handler
  const handleAlergenoToggle = (alergeno) => {
    setAlergenos((prev) =>
      prev.includes(alergeno)
        ? prev.filter((al) => al !== alergeno)
        : [...prev, alergeno]
    );
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");
    if (password && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const body = { nombre, apellidos, alergenos };
      if (password) body.password = password;
      const res = await fetch(`${API_URL}/users/${usuario.id}`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al actualizar el perfil");
      }
      setOk("Perfil actualizado correctamente");
      setTimeout(() => navigate("/perfil"), 1200);
    } catch (err) {
      setError(err.message || "Error inesperado");
    }
  };

  return (
    <div className="perfil-page">
      <h2>Editar perfil</h2>
      <form className="perfil-card perfil-form-grid" onSubmit={handleSubmit}>
        {/* Email (sólo visual) */}
        <div className="perfil-form-row">
          <label className="perfil-form-label">
            <span className="perfil-label-strong">Email:</span>
          </label>
          <input
            className="perfil-form-field perfil-email"
            type="text"
            value={email}
            disabled
            tabIndex={-1}
            aria-readonly="true"
          />
        </div>
        <div className="perfil-form-row">
          <label className="perfil-form-label">
            <span className="perfil-label-strong">Nombre:</span>
          </label>
          <input
            className="perfil-form-field"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="perfil-form-row">
          <label className="perfil-form-label">
            <span className="perfil-label-strong">Apellidos:</span>
          </label>
          <input
            className="perfil-form-field"
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
        </div>
        <div className="perfil-form-row align-top">
          <label className="perfil-form-label">
            <span className="perfil-label-strong">Alérgenos:</span>
          </label>
          <div className="alergenos-checkbox-list">
            {alergenosDisponibles.length === 0 && (
              <span style={{ fontSize: "0.96em", color: "#a33" }}>
                No hay alérgenos disponibles.
              </span>
            )}
            {alergenosDisponibles.map((al) => (
              <label key={al} className="alergeno-checkbox">
                <input
                  type="checkbox"
                  value={al}
                  checked={alergenos.includes(al)}
                  onChange={() => handleAlergenoToggle(al)}
                />
                {al}
              </label>
            ))}
          </div>
        </div>
        <div className="perfil-form-row">
          <label className="perfil-form-label">
            <span className="perfil-label-strong">Nueva contraseña:</span>
          </label>
          <input
            className="perfil-form-field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Deja vacío para no cambiar"
          />
        </div>
        <div className="perfil-form-row">
          <label className="perfil-form-label">
            <span className="perfil-label-strong">Repetir contraseña:</span>
          </label>
          <input
            className="perfil-form-field"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="Repite la contraseña"
          />
        </div>
        {/* Botones */}
        <div className="perfil-actions perfil-actions-form">
          <button className="btn btn-admin" type="submit">
            GUARDAR CAMBIOS
          </button>
          <button
            className="btn"
            type="button"
            style={{ background: "#bbb", color: "#222" }}
            onClick={() => navigate("/perfil")}
          >
            CANCELAR
          </button>
        </div>
        {error && <div className="perfil-error">{error}</div>}
        {ok && <div className="perfil-ok">{ok}</div>}
      </form>
    </div>
  );
}
