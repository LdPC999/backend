import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PlanificadorResultados.css";

// Array de días de la semana para mostrar en el planificador
const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

/**
 * Selecciona 'n' elementos aleatorios de un array sin repetir.
 * Si el array tiene menos de 'n' elementos, se repiten.
 */
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

/**
 * Modal para mostrar el detalle de una receta seleccionada.
 */
function RecetaModal({ receta, onClose }) {
  if (!receta) return null;

  // Obtiene alérgenos únicos de todos los ingredientes de la receta
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

  return (
    <div className="modal-fondo" onClick={onClose}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onClose}>✕</button>
        <div className="receta-detalle">
          <div className="receta-imagen">
            {receta.imagen ? (
              <img src={receta.imagen} alt={receta.nombre} />
            ) : (
              <div className="receta-imagen-placeholder">
                <span>Sin imagen</span>
              </div>
            )}
          </div>
          <div className="receta-info">
            <h3>{receta.nombre}</h3>
            <p><strong>Tiempo de preparación:</strong> {receta.tiempoPreparacion} minutos</p>
            <p><strong>Dificultad:</strong> {receta.dificultad}</p>
          </div>
          <div className="receta-ingredientes">
            <h4>Ingredientes:</h4>
            <ul>
              {receta.ingredientes?.length > 0 ? (
                receta.ingredientes.map((ing) => (
                  <li key={ing.id || ing.nombre}>{ing.nombre}</li>
                ))
              ) : (
                <li>No hay ingredientes asociados</li>
              )}
            </ul>
          </div>
          <div className="receta-alergenos">
            <h4>Alérgenos:</h4>
            <ul>
              {getAlergenos(receta).length > 0 ? (
                getAlergenos(receta).map((alergeno, idx) => (
                  <li key={idx}>{alergeno}</li>
                ))
              ) : (
                <li>No contiene alérgenos importantes</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente principal que muestra el menú semanal generado.
 */
export default function PlanificadorResultados() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado para el menú semanal generado
  const [semanaComidas, setSemanaComidas] = useState([]);
  const [semanaCenas, setSemanaCenas] = useState([]);

  // Estados para el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [recetaModal, setRecetaModal] = useState(null);

  // Si no hay datos, muestra mensaje y botón para volver
  if (!location.state) {
    return (
      <div>
        <h2>No has generado ningún plan. Vuelve al planificador.</h2>
        <button onClick={() => navigate("/planificador")}>Volver</button>
      </div>
    );
  }

  // Desestructura los datos recibidos de la navegación
  const { recetasComida = [], recetasCena = [], filtros = {} } = location.state;

  // Genera el menú semanal solo al cargar el componente
  useEffect(() => {
    setSemanaComidas(seleccionarAleatoriosSinRepetir(recetasComida, 7));
    setSemanaCenas(seleccionarAleatoriosSinRepetir(recetasCena, 7));
    // eslint-disable-next-line
  }, []);

  // Si no hay recetas según los filtros, muestra mensaje
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
        <button onClick={() => navigate("/planificador")} className="btn btn-primary">
          Volver
        </button>
      </div>
    );
  }

  // Funciones para abrir y cerrar el modal
  const handleOpenModal = (receta) => {
    setRecetaModal(receta);
    setModalAbierto(true);
  };
  const handleCloseModal = () => {
    setModalAbierto(false);
    setRecetaModal(null);
  };

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
                <span
                  className="receta-link"
                  onClick={() => semanaComidas[idx] && handleOpenModal(semanaComidas[idx])}
                  style={{
                    cursor: semanaComidas[idx] ? "pointer" : "default",
                    textDecoration: "underline",
                  }}
                >
                  {semanaComidas[idx]?.nombre || "No disponible"}
                </span>
              </div>
            )}
            {(filtros.tipoComida === "C" || filtros.tipoComida === "ambos") && (
              <div className="tarjeta-receta cena">
                <strong>Cena:</strong>
                <span
                  className="receta-link"
                  onClick={() => semanaCenas[idx] && handleOpenModal(semanaCenas[idx])}
                  style={{
                    cursor: semanaCenas[idx] ? "pointer" : "default",
                    textDecoration: "underline",
                  }}
                >
                  {semanaCenas[idx]?.nombre || "No disponible"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => navigate("/planificador")} className="btn btn-primary">
        Volver a generar
      </button>

      {/* Modal de detalle de la receta */}
      {modalAbierto && recetaModal && (
        <RecetaModal receta={recetaModal} onClose={handleCloseModal} />
      )}
    </div>
  );
}