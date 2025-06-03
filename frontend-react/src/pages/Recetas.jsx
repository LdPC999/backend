import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/auth"; // Utilidad para obtener el rol del usuario
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // Iconos de favoritos
import "../styles/Recetas.css";

/**
 * Página de listado de recetas.
 * - Permite al usuario seleccionar una receta para ver detalles.
 * - Usuarios pueden marcar o quitar favoritos.
 * - Admins pueden crear y modificar recetas.
 */
export default function Recetas() {
  // Estados para la lista de recetas y la receta seleccionada
  const [recetas, setRecetas] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  // Estados para favoritos y mensajes
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const userRole = getUserRole(); // Rol del usuario logueado
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Al montar, carga la lista de recetas.
   */
  useEffect(() => {
    async function fetchRecetas() {
      try {
        const res = await fetch(`${API_URL}/recipes`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("No se han podido cargar las recetas");
        const data = await res.json();
        setRecetas(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error de red");
        setLoading(false);
      }
    }
    fetchRecetas();
  }, []);

  /**
   * Al montar, carga los favoritos del usuario.
   */
  useEffect(() => {
    async function fetchFavoritos() {
      try {
        const res = await fetch(`${API_URL}/users/favoritos/me`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFavoritos(data.map(r => r.id)); // Solo IDs de recetas favoritas
        }
      } catch {
        setFavoritos([]);
      }
    }
    fetchFavoritos();
  }, []);

  /**
   * Cambia la receta seleccionada cuando el usuario la elige en el desplegable.
   */
  const handleChange = (e) => {
    const recetaId = Number(e.target.value);
    const receta = recetas.find((r) => r.id === recetaId);
    setRecetaSeleccionada(receta || null);
  };

  /**
   * Obtiene los alérgenos únicos de los ingredientes de la receta.
   */
  const getAlergenos = (receta) => {
    if (!receta || !receta.ingredientes) return [];
    const alergenosSet = new Set();
    receta.ingredientes.forEach((ing) => {
      if (ing.alergeno) {
        if (Array.isArray(ing.alergeno)) {
          ing.alergeno.forEach((al) => alergenosSet.add(al.trim()));
        } else {
          ing.alergeno.split(",").forEach((al) => alergenosSet.add(al.trim()));
        }
      }
    });
    return Array.from(alergenosSet).filter(Boolean);
  };

  /**
   * Marca o desmarca una receta como favorita.
   */
  const toggleFavorito = async (recetaId) => {
    try {
      if (favoritos.includes(recetaId)) {
        // Quitar de favoritos
        await fetch(`${API_URL}/users/favoritos/${recetaId}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setFavoritos(favoritos.filter(favId => favId !== recetaId));
      } else {
        // Añadir a favoritos
        await fetch(`${API_URL}/users/favoritos/${recetaId}`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setFavoritos([...favoritos, recetaId]);
      }
    } catch {
      // Podrías mostrar un error si lo deseas
    }
  };

  return (
    <div className="recetas-page">
      <h2>Recetario</h2>

      {/* Botón para crear nueva receta (solo para admin) */}
      {userRole === "admin" && (
        <div style={{ textAlign: "right", marginBottom: "1em" }}>
          <button
            className="btn btn-admin"
            onClick={() => navigate("/recetas/crear")}
          >
            + Nueva receta
          </button>
        </div>
      )}

      {/* Selector de receta */}
      <div className="recetas-select-container">
        <label htmlFor="select-receta">Selecciona una receta:</label>
        <select
          id="select-receta"
          onChange={handleChange}
          defaultValue=""
          className="recetas-select"
        >
          <option value="" disabled>
            -- Elige una receta --
          </option>
          {recetas
            .slice()
            .sort((a, b) =>
              a.nombre.trim().toLocaleLowerCase("es").localeCompare(b.nombre.trim().toLocaleLowerCase("es"), "es", { sensitivity: "base" })
            )
            .map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
        </select>
      </div>

      {/* Estado de carga o error */}
      {loading && <div className="recetas-loading">Cargando recetas...</div>}
      {error && <div className="recetas-error">{error}</div>}

      {/* Detalle de la receta seleccionada */}
      {recetaSeleccionada && (
        <div className="receta-detalle">
          {/* Imagen */}
          <div className="receta-imagen">
            {recetaSeleccionada.imagen ? (
              <img src={recetaSeleccionada.imagen} alt={recetaSeleccionada.nombre} />
            ) : (
              <div className="receta-imagen-placeholder">
                <span>Sin imagen</span>
              </div>
            )}
          </div>

          {/* Información principal */}
          <div className="receta-info">
            <div style={{ display: "flex", alignItems: "center", gap: "0.85em" }}>
              <h3 style={{ margin: 0 }}>{recetaSeleccionada.nombre}</h3>
              {/* Icono de favorito si el usuario está logueado */}
              {userRole && (
                <button
                  className="btn-favorito"
                  aria-label={favoritos.includes(recetaSeleccionada.id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                  onClick={() => toggleFavorito(recetaSeleccionada.id)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center"
                  }}
                  tabIndex={0}
                >
                  {favoritos.includes(recetaSeleccionada.id)
                    ? <AiFillHeart size={29} color="#d42332" />
                    : <AiOutlineHeart size={29} color="#d42332" />}
                </button>
              )}
            </div>
            <p><strong>Tiempo de preparación:</strong> {recetaSeleccionada.tiempoPreparacion} minutos</p>
            <p><strong>Dificultad:</strong> {recetaSeleccionada.dificultad}</p>
          </div>

          {/* Ingredientes */}
          <div className="receta-ingredientes">
            <h4>Ingredientes:</h4>
            <ul>
              {recetaSeleccionada.ingredientes?.length > 0 ? (
                recetaSeleccionada.ingredientes.map((ing) => (
                  <li key={ing.id || ing.nombre}>{ing.nombre}</li>
                ))
              ) : (
                <li>No hay ingredientes asociados</li>
              )}
            </ul>
          </div>

          {/* Alérgenos */}
          <div className="receta-alergenos">
            <h4>Alérgenos:</h4>
            <ul>
              {getAlergenos(recetaSeleccionada).length > 0 ? (
                getAlergenos(recetaSeleccionada).map((alergeno, idx) => (
                  <li key={idx}>{alergeno}</li>
                ))
              ) : (
                <li>No contiene alérgenos importantes</li>
              )}
            </ul>
          </div>

          {/* Botón para modificar la receta (solo para admin) */}
          {userRole === "admin" && (
            <div style={{ textAlign: "right", marginTop: "1em" }}>
              <button
                className="btn btn-admin"
                onClick={() => navigate(`/recetas/editar/${recetaSeleccionada.id}`)}
              >
                Modificar receta
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}