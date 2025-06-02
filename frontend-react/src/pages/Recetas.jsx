// src/pages/Recetas.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; 
import "../styles/Recetas.css";

export default function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userRole = getUserRole();
  const API_URL = import.meta.env.VITE_API_URL;

  // Carga recetas
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

  // Carga favoritos del usuario
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
          setFavoritos(data.map(r => r.id)); // Array de IDs de recetas favoritas
        }
      } catch {
        setFavoritos([]);
      }
    }
    fetchFavoritos();
  }, []);

  // Cambia receta seleccionada al elegir en el desplegable
  const handleChange = (e) => {
    const recetaId = Number(e.target.value);
    const receta = recetas.find((r) => r.id === recetaId);
    setRecetaSeleccionada(receta || null);
  };

  // Recoge alérgenos únicos de la receta seleccionada
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

  // Marcar/desmarcar favorito
  const toggleFavorito = async (recetaId) => {
    try {
      if (favoritos.includes(recetaId)) {
        // Quitar favorito
        await fetch(`${API_URL}/users/favoritos/${recetaId}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setFavoritos(favoritos.filter(favId => favId !== recetaId));
      } else {
        // Añadir favorito
        await fetch(`${API_URL}/users/favoritos/${recetaId}`, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setFavoritos([...favoritos, recetaId]);
      }
    } catch (err) {
      // Puedes mostrar un error si quieres
    }
  };

  return (
    <div className="recetas-page">
      <h2>Recetario</h2>

      {/* Botón solo visible si es admin */}
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

      {/* Desplegable de selección */}
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

      {loading && <div className="recetas-loading">Cargando recetas...</div>}
      {error && <div className="recetas-error">{error}</div>}

      {recetaSeleccionada && (
        <div className="receta-detalle">
          {/* Imagen */}
          <div className="receta-imagen">
            {recetaSeleccionada.imagen ? (
              <img
                src={recetaSeleccionada.imagen}
                alt={recetaSeleccionada.nombre}
              />
            ) : (
              <div className="receta-imagen-placeholder">
                <span>Sin imagen</span>
              </div>
            )}
          </div>
          {/* Info */}
          <div className="receta-info">
            <div style={{ display: "flex", alignItems: "center", gap: "0.85em" }}>
              <h3 style={{ margin: 0 }}>{recetaSeleccionada.nombre}</h3>
              {/* Icono de favorito solo si hay usuario logueado */}
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
                    : <AiOutlineHeart size={29} color="#d42332" />
                  }
                </button>
              )}
            </div>
            <p>
              <strong>Tiempo de preparación:</strong>{" "}
              {recetaSeleccionada.tiempoPreparacion} minutos
            </p>
            <p>
              <strong>Dificultad:</strong> {recetaSeleccionada.dificultad}
            </p>
          </div>
          {/* Ingredientes */}
          <div className="receta-ingredientes">
            <h4>Ingredientes:</h4>
            <ul>
              {recetaSeleccionada.ingredientes &&
              recetaSeleccionada.ingredientes.length > 0 ? (
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

          {/* Botón de modificar solo para admin */}
          {userRole === "admin" && (
            <div style={{ textAlign: "right", marginTop: "1em" }}>
              <button
                className="btn btn-admin"
                onClick={() =>
                  navigate(`/recetas/editar/${recetaSeleccionada.id}`)
                }
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
