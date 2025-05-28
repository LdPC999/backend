// src/pages/Recetas.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../utils/auth";
import "../styles/Recetas.css";

export default function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userRole = getUserRole();

  useEffect(() => {
    async function fetchRecetas() {
      try {
        const res = await fetch("http://localhost:3000/recipes", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          }
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

  const handleChange = (e) => {
    const recetaId = Number(e.target.value);
    const receta = recetas.find(r => r.id === recetaId);
    setRecetaSeleccionada(receta || null);
  };

  const getAlergenos = (receta) => {
    if (!receta || !receta.ingredientes) return [];
    const alergenosSet = new Set();
    receta.ingredientes.forEach(ing => {
      if (ing.alergeno) {
        if (Array.isArray(ing.alergeno)) {
          ing.alergeno.forEach(al => alergenosSet.add(al.trim()));
        } else {
          ing.alergeno.split(",").forEach(al => alergenosSet.add(al.trim()));
        }
      }
    });
    return Array.from(alergenosSet).filter(Boolean);
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
        <label htmlFor="select-receta">
          Selecciona una receta:
        </label>
        <select
          id="select-receta"
          onChange={handleChange}
          defaultValue=""
          className="recetas-select"
        >
          <option value="" disabled>
            -- Elige una receta --
          </option>
          {recetas.map((r) => (
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
              <img src={recetaSeleccionada.imagen} alt={recetaSeleccionada.nombre} />
            ) : (
              <div className="receta-imagen-placeholder">
                <span>Sin imagen</span>
              </div>
            )}
          </div>
          {/* Info */}
          <div className="receta-info">
            <h3>{recetaSeleccionada.nombre}</h3>
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
              {recetaSeleccionada.ingredientes && recetaSeleccionada.ingredientes.length > 0 ? (
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
