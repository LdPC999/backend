// src/pages/Planificador.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Planificador.css";

export default function Planificador() {
  const [alergenosDisponibles, setAlergenosDisponibles] = useState([]);
  const [selectedAlergenos, setSelectedAlergenos] = useState([]);
  const [tipoComida, setTipoComida] = useState("ambos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Carga la lista de alérgenos (no protegida, puede ir sin token)
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetch(`${API_URL}/alergenos`)
      .then((res) => res.json())
      .then((data) => setAlergenosDisponibles(data))
      .catch(() => setAlergenosDisponibles([]));
  }, []);

  // Maneja cambios en los checkboxes de alérgenos
  const handleAlergenoChange = (alergeno) => {
    setSelectedAlergenos((prev) =>
      prev.includes(alergeno)
        ? prev.filter((a) => a !== alergeno)
        : [...prev, alergeno]
    );
  };

  // Cambia el tipo de comida a planificar
  const handleTipoComidaChange = (e) => {
    setTipoComida(e.target.value);
  };

  // Al pulsar "Generar semana"
  const handleGenerar = async () => {
    setLoading(true);
    setError("");
    try {
      const alergenoQuery =
        selectedAlergenos.length > 0
          ? `sinAlergeno=${selectedAlergenos.join(",")}`
          : "";

      let recetasComida = [];
      let recetasCena = [];

      // Fetch para comidas (protegido, añade token en Authorization)
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

      // Fetch para cenas (protegido, añade token en Authorization)
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

      // Navega a la pantalla de resultados pasando los arrays y los filtros
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

        {/* Botón de generar */}
        <div className="form-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Generando..." : "Generar semana"}
          </button>
        </div>

        {/* Muestra errores si los hay */}
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
