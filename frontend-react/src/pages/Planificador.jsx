// src/pages/Planificador.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Planificador.css";

export default function Planificador() {
  // Estado para la lista de alérgenos
  const [alergenosDisponibles, setAlergenosDisponibles] = useState([]);
  // Estado de alérgenos seleccionados por el usuario
  const [selectedAlergenos, setSelectedAlergenos] = useState([]);
  // "ambos" (por defecto), "A" (almuerzo) o "C" (cena)
  const [tipoComida, setTipoComida] = useState("ambos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Al cargar el componente, obtiene los alérgenos desde el backend
  useEffect(() => {
    fetch("http://localhost:3000/alergenos")
      .then((res) => res.json())
      .then((data) => setAlergenosDisponibles(data))
      .catch(() => setAlergenosDisponibles([]));
  }, []);

  // Maneja el cambio de selección de alérgenos
  const handleAlergenoChange = (alergeno) => {
    setSelectedAlergenos((prev) =>
      prev.includes(alergeno)
        ? prev.filter((a) => a !== alergeno)
        : [...prev, alergeno]
    );
  };

  // Cambia el tipo de comida (ambos, solo almuerzo, solo cena)
  const handleTipoComidaChange = (e) => {
    setTipoComida(e.target.value);
  };

  // Al pulsar "Generar semana"
  const handleGenerar = async () => {
    setLoading(true);
    setError("");
    try {
      // Prepara los parámetros de la query
      const alergenoQuery =
        selectedAlergenos.length > 0
          ? `sinAlergeno=${selectedAlergenos.join(",")}`
          : "";

      // Pide recetas al backend según los filtros seleccionados
      let recetasComida = [];
      let recetasCena = [];

      if (tipoComida === "A" || tipoComida === "ambos") {
        const res = await fetch(
          `/recipes?almuerzoCena=A${alergenoQuery ? `&${alergenoQuery}` : ""}`
        );
        recetasComida = await res.json();
      }
      if (tipoComida === "C" || tipoComida === "ambos") {
        const res = await fetch(
          `/recipes?almuerzoCena=C${alergenoQuery ? `&${alergenoQuery}` : ""}`
        );
        recetasCena = await res.json();
      }

      // Pasa los resultados a la pantalla de resultados usando el estado de React Router
      navigate("/planificador-resultados", {
        state: {
          recetasComida,
          recetasCena,
          filtros: {
            alergenos: selectedAlergenos,
            tipoComida
          }
        }
      });
    } catch (err) {
      setError("No se han podido obtener las recetas. Inténtalo más tarde.");
    }
    setLoading(false);
  };

  return (
    <div className="planificador-container">
      <h2>Planificador semanal</h2>
      <form
        className="planificador-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerar();
        }}
      >
        {/* Filtro de tipo de comida */}
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

        {/* Filtro de alérgenos (checkbox múltiple) */}
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

        {/* Botón de generar */}
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Generando..." : "Generar semana"}
          </button>
        </div>

        {/* Muestra errores si los hay */}
        {error && (
          <div className="form-error" style={{ color: "red", marginTop: "1em" }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
