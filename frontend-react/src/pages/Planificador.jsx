import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Planificador.css";

/**
 * Página del planificador semanal:
 * - Permite al usuario elegir alérgenos que quiere evitar.
 * - Puede generar menús para almuerzo, cena o ambos.
 * - Obtiene las recetas filtradas y navega a la pantalla de resultados.
 */
export default function Planificador() {
  // Lista de alérgenos disponibles (desde la API)
  const [alergenosDisponibles, setAlergenosDisponibles] = useState([]);
  // Alérgenos seleccionados por el usuario
  const [selectedAlergenos, setSelectedAlergenos] = useState([]);
  // Tipo de comida a planificar (A=almuerzo, C=cena, ambos)
  const [tipoComida, setTipoComida] = useState("ambos");
  // Estado de carga y error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Al cargar la página, obtiene la lista de alérgenos disponibles.
   */
  useEffect(() => {
    fetch(`${API_URL}/alergenos`)
      .then((res) => res.json())
      .then((data) => setAlergenosDisponibles(data))
      .catch(() => setAlergenosDisponibles([]));
  }, []);

  /**
   * Handler para los checkboxes de alérgenos.
   */
  const handleAlergenoChange = (alergeno) => {
    setSelectedAlergenos((prev) =>
      prev.includes(alergeno)
        ? prev.filter((a) => a !== alergeno)
        : [...prev, alergeno]
    );
  };

  /**
   * Handler para el cambio del tipo de comida (radio buttons).
   */
  const handleTipoComidaChange = (e) => {
    setTipoComida(e.target.value);
  };

  /**
   * Genera el plan semanal al pulsar el botón.
   * - Hace peticiones GET a la API para obtener recetas filtradas.
   * - Pasa los resultados a la vista de resultados usando `navigate`.
   */
  const handleGenerar = async () => {
    setLoading(true);
    setError("");

    try {
      // Construye el query string para los alérgenos seleccionados
      const alergenoQuery =
        selectedAlergenos.length > 0
          ? `sinAlergeno=${selectedAlergenos.join(",")}`
          : "";

      let recetasComida = [];
      let recetasCena = [];

      // Fetch para comidas (si corresponde)
      if (tipoComida === "A" || tipoComida === "ambos") {
        const urlComida = `${API_URL}/recipes?almuerzoCena=A${
          alergenoQuery ? `&${alergenoQuery}` : ""
        }`;
        const res = await fetch(urlComida, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        recetasComida = await res.json();
      }

      // Fetch para cenas (si corresponde)
      if (tipoComida === "C" || tipoComida === "ambos") {
        const urlCena = `${API_URL}/recipes?almuerzoCena=C${
          alergenoQuery ? `&${alergenoQuery}` : ""
        }`;
        const res = await fetch(urlCena, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        recetasCena = await res.json();
      }

      // Navega a la vista de resultados pasando los datos y los filtros
      navigate("/planificador/resultados", {
        state: {
          recetasComida,
          recetasCena,
          filtros: {
            alergenos: selectedAlergenos,
            tipoComida,
          },
        },
      });
    } catch (err) {
      setError("No se han podido obtener las recetas. Inténtalo más tarde.");
    }

    setLoading(false);
  };

  return (
    <div className="planificador-container">
      <h2>Planificador semanal</h2>

      {/* Formulario con filtros */}
      <form
        className="planificador-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerar();
        }}
      >
        {/* Selección de tipo de comida */}
        <div className="form-group">
          <label>¿Qué quieres planificar?</label>
          <div className="tipo-comida-select">
            <label>
              <input
                type="radio"
                name="tipoComida"
                value="ambos"
                checked={tipoComida === "ambos"}
                onChange={handleTipoComidaChange}
              />
              Almuerzo y cena
            </label>
            <label>
              <input
                type="radio"
                name="tipoComida"
                value="A"
                checked={tipoComida === "A"}
                onChange={handleTipoComidaChange}
              />
              Solo almuerzo
            </label>
            <label>
              <input
                type="radio"
                name="tipoComida"
                value="C"
                checked={tipoComida === "C"}
                onChange={handleTipoComidaChange}
              />
              Solo cena
            </label>
          </div>
        </div>

        {/* Filtro de alérgenos */}
        <div className="form-group">
          <label>Elige los alérgenos que quieres evitar:</label>
          <div className="alergenos-list">
            {alergenosDisponibles.length === 0 ? (
              <span style={{ color: "#666" }}>Cargando alérgenos...</span>
            ) : (
              alergenosDisponibles.map((alergeno) => (
                <label key={alergeno} className="alergeno-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedAlergenos.includes(alergeno)}
                    onChange={() => handleAlergenoChange(alergeno)}
                  />
                  {alergeno}
                </label>
              ))
            )}
          </div>
        </div>

        {/* Botón de generar plan */}
        <div className="form-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Generando..." : "Generar semana"}
          </button>
        </div>

        {/* Muestra error si hay */}
        {error && (
          <div
            className="form-error"
            style={{ color: "red", marginTop: "1em" }}
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
}