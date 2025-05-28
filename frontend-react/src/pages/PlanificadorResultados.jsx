// src/pages/PlanificadorResultados.jsx
import React , { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PlanificadorResultados.css";

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// Utilidad para seleccionar n elementos aleatorios sin repetir
function seleccionarAleatoriosSinRepetir(array, n) {
  if (!Array.isArray(array) || array.length === 0) return [];
  if (array.length >= n) {
    const copia = [...array];
    const seleccionados = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * copia.length);
      seleccionados.push(copia[idx]);
      copia.splice(idx, 1);
    }
    return seleccionados;
  } else {
    // Si hay menos de n, se repiten
    const seleccionados = [];
    let fuente = [...array];
    while (seleccionados.length < n) {
      if (fuente.length === 0) fuente = [...array];
      const idx = Math.floor(Math.random() * fuente.length);
      seleccionados.push(fuente[idx]);
      fuente.splice(idx, 1);
    }
    return seleccionados;
  }
}

export default function PlanificadorResultados() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("PlanificadorResultados location.state:", location.state);
  }, [location.state]);

  if (!location.state) {
    return (
      <div>
        <h2>No has generado ningún plan. Vuelve al planificador.</h2>
        <button onClick={() => navigate("/planificador")}>Volver</button>
      </div>
    );
  }

  const { recetasComida = [], recetasCena = [], filtros = {} } = location.state;

  // Genera la selección aleatoria al cargar el componente
  const semanaComidas = seleccionarAleatoriosSinRepetir(recetasComida, 7);
  const semanaCenas = seleccionarAleatoriosSinRepetir(recetasCena, 7);

  // Si no hay ninguna receta para comida o cena, muestra aviso
  if (
    (filtros.tipoComida === "A" && recetasComida.length === 0) ||
    (filtros.tipoComida === "C" && recetasCena.length === 0) ||
    (filtros.tipoComida === "ambos" &&
      recetasComida.length === 0 &&
      recetasCena.length === 0)
  ) {
    return (
      <div className="planificador-resultados">
        <h2>No se han encontrado recetas con los filtros elegidos.</h2>
        <button
          onClick={() => navigate("/planificador")}
          className="btn btn-primary"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="planificador-resultados">
      <h2>Menú semanal generado</h2>
      <div className="planificador-semana">
        {DIAS.map((dia, idx) => (
          <div key={dia} className="planificador-dia">
            <h3>{dia}</h3>
            {(filtros.tipoComida === "A" || filtros.tipoComida === "ambos") && (
              <div className="tarjeta-receta comida">
                <strong>Comida:</strong>
                <span>{semanaComidas[idx]?.nombre || "No disponible"}</span>
              </div>
            )}
            {(filtros.tipoComida === "C" || filtros.tipoComida === "ambos") && (
              <div className="tarjeta-receta cena">
                <strong>Cena:</strong>
                <span>{semanaCenas[idx]?.nombre || "No disponible"}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/planificador")}
        className="btn btn-primary"
      >
        Volver a generar
      </button>
    </div>
  );
}
