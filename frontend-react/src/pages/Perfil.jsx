// src/pages/Perfil.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole, getToken } from "../utils/auth";
import { AiFillHeart } from "react-icons/ai"; // Icono de corazón lleno
import "../styles/Perfil.css";

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminOk, setAdminOk] = useState("");
  const navigate = useNavigate();
  const rol = getUserRole();

  // Al montar, pide los datos del usuario y favoritos
  useEffect(() => {
    async function fetchPerfil() {
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        const data = await res.json();
        setUsuario(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error de red");
        setLoading(false);
      }
    }
    fetchPerfil();
  }, []);

  useEffect(() => {
    // Pide recetas favoritas
    async function fetchFavoritos() {
      setFavLoading(true);
      try {
        const res = await fetch("http://localhost:3000/users/favoritos/me", {
          headers: {
            Authorization: "Bearer " + getToken(),
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("No se pudieron cargar los favoritos");
        const data = await res.json();
        setFavoritos(data); // Array de recetas completas favoritas
        setFavLoading(false);
      } catch (err) {
        setFavoritos([]);
        setFavLoading(false);
      }
    }
    fetchFavoritos();
  }, []);

  // Navega a editar perfil
  const handleEditarPerfil = () => {
    navigate("/perfil/editar");
  };

  // Formulario para dar permisos de admin (solo admins pueden verlo)
  const handleDarAdmin = async (e) => {
    e.preventDefault();
    setAdminError("");
    setAdminOk("");
    try {
      const res = await fetch("http://localhost:3000/users/admin", {
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: adminEmail }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "No se pudo actualizar el usuario");
      }
      setAdminOk(`Permisos de administrador otorgados a ${adminEmail}`);
      setAdminEmail(""); // Limpiar campo
    } catch (err) {
      setAdminError(err.message || "Error inesperado");
    }
  };

  return (
    <div className="perfil-page">
      <h2>Mi perfil</h2>

      {loading && <div className="perfil-loading">Cargando perfil...</div>}
      {error && <div className="perfil-error">{error}</div>}

      {usuario && (
        <div className="perfil-card">
          <div className="perfil-info">
            <div>
              <strong>Nombre:</strong> {usuario.nombre || "-"}
            </div>
            <div>
              <strong>Apellidos:</strong> {usuario.apellidos || "-"}
            </div>
            <div>
              <strong>Email:</strong> {usuario.email || "-"}
            </div>
            <div>
              <strong>Rol:</strong> {rol === "admin" ? "Administrador" : "Usuario"}
            </div>
            {usuario.alergenos && usuario.alergenos.length > 0 && (
              <div>
                <strong>Alérgenos:</strong>{" "}
                {usuario.alergenos.join(", ")}
              </div>
            )}
          </div>
          <div className="perfil-actions">
            <button className="btn" onClick={handleEditarPerfil}>
              Editar perfil
            </button>
          </div>
          {/* Si es admin, mostramos el formulario para dar permisos */}
          {rol === "admin" && (
            <div className="perfil-admin-box">
              <span>👑 Tienes permisos de administrador</span>
              <form
                style={{ marginTop: "1em" }}
                onSubmit={handleDarAdmin}
                autoComplete="off"
              >
                <label>
                  <strong>Otorgar permisos de administrador a:</strong>
                  <input
                    type="email"
                    placeholder="Email del usuario"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    style={{ marginLeft: "0.5em", minWidth: "210px" }}
                  />
                </label>
                <button
                  type="submit"
                  className="btn btn-admin"
                  style={{ marginLeft: "0.8em" }}
                >
                  Dar permisos
                </button>
              </form>
              {adminError && <div className="perfil-error">{adminError}</div>}
              {adminOk && <div className="perfil-ok">{adminOk}</div>}
            </div>
          )}

          {/* FAVORITOS */}
          <div className="perfil-favoritos-bloque">
            <h3 className="perfil-favoritos-titulo">
              <AiFillHeart color="#d42332" size={25} style={{verticalAlign:"-3px", marginRight:"8px"}} />
              Mis recetas favoritas
            </h3>
            {favLoading ? (
              <div style={{ textAlign: "center", padding: "0.7em" }}>Cargando favoritos...</div>
            ) : favoritos.length === 0 ? (
              <div style={{ color: "#444", padding: "1em 0 1.2em 0", textAlign:"center", fontSize:"1.09em" }}>
                No tienes recetas favoritas marcadas aún.
              </div>
            ) : (
              <ul className="perfil-favoritos-lista">
                {favoritos.map(receta => (
                  <li key={receta.id} className="perfil-favorito-item">
                    <AiFillHeart color="#d42332" size={21} style={{marginRight:"6px"}} />
                    <span>{receta.nombre}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
