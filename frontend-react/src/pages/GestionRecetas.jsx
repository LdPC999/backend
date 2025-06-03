import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserRole } from "../utils/auth"; // Utilidad para obtener el rol del usuario
import "../styles/Recetas.css";

/**
 * Componente para crear o editar recetas (solo accesible para admin).
 * - Permite subir imágenes (archivo o URL).
 * - Permite seleccionar ingredientes agrupados por tipo.
 * - Modo "editar" o "crear" se gestiona con el prop `modo`.
 */
export default function GestionRecetas({ modo }) {
  // Obtiene el parámetro "id" de la URL (si se está editando)
  const params = useParams();
  const editingId = params.id;

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [dificultad, setDificultad] = useState("fácil");
  const [tiempoPreparacion, setTiempoPreparacion] = useState(30);
  const [imagen, setImagen] = useState(""); // URL de la imagen (si se pega manualmente)
  const [imagenFile, setImagenFile] = useState(null); // Archivo de imagen (opcional)
  const [preview, setPreview] = useState(""); // Preview de la imagen
  const [ingredientes, setIngredientes] = useState([]); // IDs de ingredientes seleccionados
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]); // Ingredientes disponibles desde el backend
  const [tipoSeleccionado, setTipoSeleccionado] = useState(""); // Tipo de ingrediente seleccionado para ver los checkboxes

  // Estados para mensajes de error y confirmación
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Efecto para restringir el acceso solo a administradores.
   * Si no es admin, redirige a la lista de recetas.
   */
  useEffect(() => {
    if (getUserRole() !== "admin") {
      navigate("/recetas");
    }
  }, [navigate]);

  /**
   * Efecto para cargar la lista de ingredientes disponibles.
   */
  useEffect(() => {
    fetch(`${API_URL}/ingredients`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setIngredientesDisponibles(data))
      .catch(() => setIngredientesDisponibles([]));
  }, []);

  /**
   * Si estamos en modo "editar", carga la receta actual para rellenar el formulario.
   */
  useEffect(() => {
    if (modo === "editar" && editingId) {
      fetch(`${API_URL}/recipes/${editingId}`, {
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
          setPreview(data.imagen || "");
          setIngredientes(data.ingredientes?.map((i) => i.id) || []);
        })
        .catch(() => {
          setError("No se pudo cargar la receta");
        });
    }
  }, [modo, editingId]);

  /**
   * Handler para los checkboxes de ingredientes.
   */
  const handleIngredienteChange = (e) => {
    const id = Number(e.target.value);
    setIngredientes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /**
   * Handler para el cambio manual del campo de URL de la imagen.
   */
  const handleImagenChange = (e) => {
    setImagen(e.target.value);
    setPreview(e.target.value);
    setImagenFile(null); // Si se introduce URL, se deselecciona el archivo
  };

  /**
   * Handler para la selección de un archivo de imagen.
   * Muestra una vista previa de la imagen seleccionada.
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(imagen || "");
    }
  };

  /**
   * Envía el formulario: crea o edita la receta.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setOk(false);

    let imageUrl = imagen; // Valor por defecto: la URL que está en el input

    // Si hay un archivo, primero lo sube a Cloudinary a través del backend
    if (imagenFile) {
      const formData = new FormData();
      formData.append("file", imagenFile);
      try {
        const resImg = await fetch(`${API_URL}/upload/receta`, {
          method: "POST",
          body: formData,
        });
        const dataImg = await resImg.json();
        if (!resImg.ok) throw new Error("Error al subir la imagen");
        imageUrl = dataImg.url;
      } catch (err) {
        setError("Error al subir la imagen: " + err.message);
        return;
      }
    }

    // Guarda la receta (POST o PATCH)
    try {
      const url =
        modo === "editar"
          ? `${API_URL}/recipes/${editingId}`
          : `${API_URL}/recipes`;
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
          imagen: imageUrl,
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
   * Agrupa los ingredientes disponibles por su tipo.
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
   * Obtiene los tipos de ingredientes ordenados alfabéticamente.
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

        {/* Tiempo de preparación */}
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

        {/* Imagen */}
        <div>
          <label>Imagen de la receta:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <input
            type="text"
            placeholder="O pega la URL de una imagen (opcional)"
            value={imagen}
            onChange={handleImagenChange}
            style={{ marginTop: "0.5em" }}
          />
          {preview && (
            <div className="imagen-preview" style={{ marginTop: "0.8em" }}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: 200, borderRadius: 8 }}
              />
            </div>
          )}
        </div>

        {/* Ingredientes por tipo */}
        <div style={{ width: "100%" }}>
          <label>Selecciona tipo de ingrediente:</label>
          <div className="select-wrapper">
            <select
              value={tipoSeleccionado}
              onChange={(e) => setTipoSeleccionado(e.target.value)}
              className="tipo-select"
            >
              <option value="">Selecciona un tipo</option>
              {tiposOrdenados.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de checkboxes para ingredientes */}
          {tipoSeleccionado && (
            <div className="ingredientes-checkboxes">
              <div className="grupo-ingredientes">
                <h4>{tipoSeleccionado}</h4>
                {ingredientesPorTipo[tipoSeleccionado]
                  ?.slice()
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

        {/* Botón de submit */}
        <button type="submit" className="btn btn-admin">
          {modo === "editar" ? "Guardar cambios" : "Crear receta"}
        </button>

        {/* Mensajes */}
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