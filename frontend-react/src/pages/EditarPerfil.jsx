import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../utils/auth"; // Función para obtener el token del usuario
import "../styles/Perfil.css";

/**
 * Componente para la página de edición de perfil.
 * Permite:
 * - Modificar nombre y apellidos.
 * - Gestionar alérgenos (checkboxes).
 * - Cambiar la contraseña (opcional).
 */
export default function EditarPerfil() {
  // Estados para almacenar la información del usuario y del formulario
  const [usuario, setUsuario] = useState(null); // Objeto completo del usuario
  const [nombre, setNombre] = useState(""); // Nombre del usuario
  const [apellidos, setApellidos] = useState(""); // Apellidos del usuario
  const [alergenos, setAlergenos] = useState([]); // Alérgenos seleccionados
  const [email, setEmail] = useState(""); // Email del usuario (solo visual)
  const [alergenosDisponibles, setAlergenosDisponibles] = useState([]); // Lista de alérgenos disponibles

  // Estados para el cambio de contraseña
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para mensajes de error y confirmación
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Efecto que carga:
   * - Los datos actuales del perfil del usuario.
   * - La lista de alérgenos disponibles.
   */
  useEffect(() => {
    // Carga los datos del usuario
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

    // Carga la lista de alérgenos disponibles
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

  /**
   * Handler para alternar la selección de un alérgeno.
   * Si ya estaba seleccionado, lo quita; si no, lo añade.
   */
  const handleAlergenoToggle = (alergeno) => {
    setAlergenos((prev) =>
      prev.includes(alergeno)
        ? prev.filter((al) => al !== alergeno)
        : [...prev, alergeno]
    );
  };

  /**
   * Handler para enviar el formulario de actualización.
   * - Comprueba que las contraseñas coincidan si se introduce una.
   * - Envía los datos al backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk("");

    // Validación de contraseñas
    if (password && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Construir cuerpo de la petición
      const body = { nombre, apellidos, alergenos };
      if (password) body.password = password;

      // Enviar petición PATCH al backend
      const res = await fetch(`${API_URL}/users/${usuario.id}`, {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Validar respuesta
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al actualizar el perfil");
      }

      // Mostrar mensaje de éxito y redirigir
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
        {/* Email (solo lectura) */}
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

        {/* Nombre */}
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

        {/* Apellidos */}
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

        {/* Alérgenos */}
        <div className="perfil-form-row align-top">
          <label className="perfil-form-label">
            <span className="perfil-label-strong">Alérgenos:</span>
          </label>
          <div className="alergenos-checkbox-list">
            {/* Mensaje si no hay alérgenos disponibles */}
            {alergenosDisponibles.length === 0 && (
              <span style={{ fontSize: "0.96em", color: "#a33" }}>
                No hay alérgenos disponibles.
              </span>
            )}
            {/* Lista de checkboxes de alérgenos */}
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

        {/* Campo para nueva contraseña */}
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

        {/* Confirmar nueva contraseña */}
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

        {/* Botones de acción */}
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

        {/* Mensajes de error y éxito */}
        {error && <div className="perfil-error">{error}</div>}
        {ok && <div className="perfil-ok">{ok}</div>}
      </form>
    </div>
  );
}