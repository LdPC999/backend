import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserRole } from "../utils/auth";
import "../styles/Recetas.css";

/**
 * Formulario de gestión de recetas para admin (crear o editar).
 * Modo crear: ruta /recetas/crear
 * Modo editar: ruta /recetas/editar/:id
 */
export default function GestionRecetas({ modo }) {
  const params = useParams();
  const editingId = params.id;
  const [nombre, setNombre] = useState("");
  const [dificultad, setDificultad] = useState("fácil");
  const [tiempoPreparacion, setTiempoPreparacion] = useState(30);
  const [imagen, setImagen] = useState("");
  const [ingredientes, setIngredientes] = useState([]);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();

  // Solo permite acceso si es admin
  useEffect(() => {
    if (getUserRole() !== "admin") {
      navigate("/recetas");
    }
  }, [navigate]);

  // Carga los ingredientes disponibles
  useEffect(() => {
    fetch("http://localhost:3000/ingredients", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(data => setIngredientesDisponibles(data))
      .catch(() => setIngredientesDisponibles([]));
  }, []);

  // Si estamos en modo editar, carga la receta a editar
  useEffect(() => {
    if (modo === "editar" && editingId) {
      fetch(`http://localhost:3000/recipes/${editingId}`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(data => {
          setNombre(data.nombre || "");
          setDificultad(data.dificultad || "fácil");
          setTiempoPreparacion(data.tiempoPreparacion || 30);
          setImagen(data.imagen || "");
          setIngredientes(data.ingredientes?.map(i => i.id) || []);
        })
        .catch(() => {
          setError("No se pudo cargar la receta");
        });
    }
  }, [modo, editingId]);

  const handleIngredienteChange = (e) => {
    const id = Number(e.target.value);
    setIngredientes((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleImagenChange = (e) => {
    setImagen(e.target.value);
  };

  // Guardar: POST para crear, PATCH para editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);
    try {
      const url = modo === "editar"
        ? `http://localhost:3000/recipes/${editingId}`
        : "http://localhost:3000/recipes";
      const method = modo === "editar" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre,
          dificultad,
          tiempoPreparacion: Number(tiempoPreparacion),
          imagen,
          ingredientes
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al guardar la receta");
      }
      setOk(true);
      setTimeout(() => navigate("/recetas"), 1200);
    } catch (err) {
      setError(err.message || "Error inesperado");
    }
  };

  return (
    <div className="recetas-page">
      <h2>{modo === "editar" ? "Editar receta" : "Crear nueva receta"}</h2>
      <form className="receta-form" onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} required />
        </div>
        <div>
          <label>Dificultad:</label>
          <select value={dificultad} onChange={e => setDificultad(e.target.value)}>
            <option value="fácil">Fácil</option>
            <option value="media">Media</option>
            <option value="difícil">Difícil</option>
          </select>
        </div>
        <div>
          <label>Tiempo de preparación (min):</label>
          <input
            type="number"
            value={tiempoPreparacion}
            onChange={e => setTiempoPreparacion(e.target.value)}
            min="1"
            required
          />
        </div>
        <div>
          <label>URL de imagen (opcional):</label>
          <input value={imagen} onChange={handleImagenChange} />
        </div>
        <div style={{ width: "100%" }}>
          <label>Ingredientes:</label>
          <div className="ingredientes-checkboxes">
            {ingredientesDisponibles.map(ing => (
              <label key={ing.id}>
                <input
                  type="checkbox"
                  value={ing.id}
                  checked={ingredientes.includes(ing.id)}
                  onChange={handleIngredienteChange}
                />
                {ing.nombre}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-admin">
          {modo === "editar" ? "Guardar cambios" : "Crear receta"}
        </button>
        {error && <div className="recetas-error">{error}</div>}
        {ok && <div className="recetas-ok">
          {modo === "editar" ? "¡Receta actualizada!" : "¡Receta creada!"}
        </div>}
      </form>
    </div>
  );
}