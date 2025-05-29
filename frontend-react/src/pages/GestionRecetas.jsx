import React, { useState, useEffect, useMemo } from "react";
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
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");
  const navigate = useNavigate();

  // Solo permite acceso si es admin
  useEffect(() => {
    if (getUserRole() !== "admin") {
      navigate("/recetas");
    }
  }, [navigate]);

  // Carga los ingredientes disponibles desde el backend
  useEffect(() => {
    fetch("http://localhost:3000/ingredients", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setIngredientesDisponibles(data))
      .catch(() => setIngredientesDisponibles([]));
  }, []);

  // Si estamos en modo editar, carga la receta a editar
  useEffect(() => {
    if (modo === "editar" && editingId) {
      fetch(`http://localhost:3000/recipes/${editingId}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setNombre(data.nombre || "");
          setDificultad(data.dificultad || "fácil");
          setTiempoPreparacion(data.tiempoPreparacion || 30);
          setImagen(data.imagen || "");
          // Guarda solo los IDs de los ingredientes seleccionados
          setIngredientes(data.ingredientes?.map((i) => i.id) || []);
        })
        .catch(() => {
          setError("No se pudo cargar la receta");
        });
    }
  }, [modo, editingId]);

  // Maneja la selección/deselección de ingredientes
  const handleIngredienteChange = (e) => {
    const id = Number(e.target.value);
    setIngredientes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Maneja el cambio en el campo de la URL de la imagen
  const handleImagenChange = (e) => {
    setImagen(e.target.value);
  };

  // Envía el formulario: POST para crear, PATCH para editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);
    try {
      const url =
        modo === "editar"
          ? `http://localhost:3000/recipes/${editingId}`
          : "http://localhost:3000/recipes";
      const method = modo === "editar" ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          dificultad,
          tiempoPreparacion: Number(tiempoPreparacion),
          imagen,
          ingredientes,
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

  /**
   * Agrupa los ingredientes disponibles por tipo.
   * Devuelve un objeto cuyas claves son los tipos y el valor es un array de ingredientes de ese tipo.
   */
  const ingredientesPorTipo = useMemo(() => {
    const grupos = {};
    ingredientesDisponibles.forEach((ing) => {
      if (!grupos[ing.tipo]) {
        grupos[ing.tipo] = [];
      }
      grupos[ing.tipo].push(ing);
    });
    return grupos;
  }, [ingredientesDisponibles]);

  /**
   * Crea un array de los tipos de ingredientes ordenados alfabéticamente.
   * Esto se usa para mostrar el desplegable de tipos en orden.
   */
  const tiposOrdenados = useMemo(
    () =>
      Object.keys(ingredientesPorTipo)
        .filter((tipo) => tipo && tipo !== "todos")
        .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" })),
    [ingredientesPorTipo]
  );

  return (
    <div className="recetas-page">
      <h2>{modo === "editar" ? "Editar receta" : "Crear nueva receta"}</h2>
      <form className="receta-form" onSubmit={handleSubmit}>
        {/* Campo nombre */}
        <div>
          <label>Nombre:</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        {/* Campo dificultad */}
        <div>
          <label>Dificultad:</label>
          <select
            value={dificultad}
            onChange={(e) => setDificultad(e.target.value)}
          >
            <option value="fácil">Fácil</option>
            <option value="media">Media</option>
            <option value="difícil">Difícil</option>
          </select>
        </div>
        {/* Campo tiempo de preparación */}
        <div>
          <label>Tiempo de preparación (min):</label>
          <input
            type="number"
            value={tiempoPreparacion}
            onChange={(e) => setTiempoPreparacion(e.target.value)}
            min="1"
            required
          />
        </div>
        {/* Campo imagen */}
        <div>
          <label>URL de imagen (opcional):</label>
          <input value={imagen} onChange={handleImagenChange} />
        </div>
        {/* Desplegable de tipos de ingredientes, ordenado alfabéticamente */}
        <div style={{ width: "100%" }}>
          <label>Selecciona tipo de ingrediente:</label>
          <div className="select-wrapper">
            <select
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              className="tipo-select"
              data-dropup="false"
            >
              <option value="">Selecciona un tipo</option>
              {/* Tipos ordenados alfabéticamente */}
              {tiposOrdenados.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>
          {/* Checkboxes de ingredientes, ordenados alfabéticamente */}
          {tipoSeleccionado && tipoSeleccionado !== "" && (
            <div className="ingredientes-checkboxes">
              <div className="grupo-ingredientes">
                <h4>{tipoSeleccionado}</h4>
                {ingredientesPorTipo[tipoSeleccionado]
                  ?.slice() // Crea una copia para no mutar el original
                  .sort((a, b) =>
                    a.nombre.localeCompare(b.nombre, "es", {
                      sensitivity: "base",
                    })
                  )
                  .map((ing) => (
                    <label key={ing.id}>
                      <input
                        type="checkbox"
                        value={ing.id}
                        checked={ingredientes.includes(ing.id)}
                        onChange={handleIngredienteChange}
                      />
                      <span>{ing.nombre}</span>
                    </label>
                  ))}
              </div>
            </div>
          )}
        </div>
        {/* Botón de guardar */}
        <button type="submit" className="btn btn-admin">
          {modo === "editar" ? "Guardar cambios" : "Crear receta"}
        </button>
        {/* Mensajes de error y confirmación */}
        {error && <div className="recetas-error">{error}</div>}
        {ok && (
          <div className="recetas-ok">
            {modo === "editar" ? "¡Receta actualizada!" : "¡Receta creada!"}
          </div>
        )}
      </form>
    </div>
  );
}
