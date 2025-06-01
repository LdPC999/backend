// PlanificadorResultados.jsx
// src/pages/PlanificadorResultados.jsx

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
 * Utilidad para seleccionar 'n' elementos aleatorios de un array sin repetir.
 * Si hay menos de 'n', repite elementos.
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
    // Si hay menos de n, se repiten aleatoriamente
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
 * Componente Modal para mostrar el detalle de una receta.
 * Recibe la receta y la función para cerrar el modal por props.
 */
function RecetaModal({ receta, onClose }) {
  if (!receta) return null;

  // Utilidad para recoger alérgenos únicos de todos los ingredientes de la receta
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
    // Fondo oscuro del modal. Si pulsas fuera del contenido, se cierra.
    <div className="modal-fondo" onClick={onClose}>
      {/* Contenido del modal. Al hacer click aquí NO se cierra */}
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onClose}>
          ✕
        </button>
        <div className="receta-detalle">
          {/* Imagen de la receta */}
          <div className="receta-imagen">
            {receta.imagen ? (
              <img src={receta.imagen} alt={receta.nombre} />
            ) : (
              <div className="receta-imagen-placeholder">
                <span>Sin imagen</span>
              </div>
            )}
          </div>
          {/* Información principal */}
          <div className="receta-info">
            <h3 style={{ margin: 0 }}>{receta.nombre}</h3>
            <p>
              <strong>Tiempo de preparación:</strong> {receta.tiempoPreparacion} minutos
            </p>
            <p>
              <strong>Dificultad:</strong> {receta.dificultad}
            </p>
          </div>
          {/* Ingredientes de la receta */}
          <div className="receta-ingredientes">
            <h4>Ingredientes:</h4>
            <ul>
              {receta.ingredientes && receta.ingredientes.length > 0 ? (
                receta.ingredientes.map((ing) => (
                  <li key={ing.id || ing.nombre}>{ing.nombre}</li>
                ))
              ) : (
                <li>No hay ingredientes asociados</li>
              )}
            </ul>
          </div>
          {/* Alérgenos presentes en la receta */}
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
 * Componente principal que muestra el resultado del menú semanal generado.
 * Permite hacer click en una receta para ver el detalle en un modal.
 */
export default function PlanificadorResultados() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado para almacenar el menú semanal generado SOLO al montar el componente
  const [semanaComidas, setSemanaComidas] = useState([]);
  const [semanaCenas, setSemanaCenas] = useState([]);

  // Estados para el popup/modal de detalle de receta
  const [modalAbierto, setModalAbierto] = useState(false);
  const [recetaModal, setRecetaModal] = useState(null);

  // Si no hay información previa, mostramos mensaje y botón para volver
  if (!location.state) {
    return (
      <div>
        <h2>No has generado ningún plan. Vuelve al planificador.</h2>
        <button onClick={() => navigate("/planificador")}>Volver</button>
      </div>
    );
  }

  // Desestructuramos la información recibida desde la pantalla anterior
  const { recetasComida = [], recetasCena = [], filtros = {} } = location.state;

  // Generamos el menú semanal SOLO al montar el componente
  useEffect(() => {
    setSemanaComidas(seleccionarAleatoriosSinRepetir(recetasComida, 7));
    setSemanaCenas(seleccionarAleatoriosSinRepetir(recetasCena, 7));
    // eslint-disable-next-line
  }, []);

  // Si no hay recetas con los filtros seleccionados, mostramos aviso
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

  // Función para mostrar el modal con la receta seleccionada
  const handleOpenModal = (receta) => {
    setRecetaModal(receta);
    setModalAbierto(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setModalAbierto(false);
    setRecetaModal(null);
  };

  return (
    <div className="planificador-resultados">
      <h2>Menú semanal generado</h2>
      <div className="planificador-semana">
        {/* Mostramos el menú de lunes a domingo */}
        {DIAS.map((dia, idx) => (
          <div key={dia} className="planificador-dia">
            <h3>{dia}</h3>
            {/* Si hay comida, la mostramos */}
            {(filtros.tipoComida === "A" || filtros.tipoComida === "ambos") && (
              <div className="tarjeta-receta comida">
                <strong>Comida:</strong>
                {/* Al pulsar en el nombre de la receta se abre el modal */}
                <span
                  className="receta-link"
                  onClick={() =>
                    semanaComidas[idx] && handleOpenModal(semanaComidas[idx])
                  }
                  style={{
                    cursor: semanaComidas[idx] ? "pointer" : "default",
                    textDecoration: "underline",
                  }}
                >
                  {semanaComidas[idx]?.nombre || "No disponible"}
                </span>
              </div>
            )}
            {/* Si hay cena, la mostramos */}
            {(filtros.tipoComida === "C" || filtros.tipoComida === "ambos") && (
              <div className="tarjeta-receta cena">
                <strong>Cena:</strong>
                <span
                  className="receta-link"
                  onClick={() =>
                    semanaCenas[idx] && handleOpenModal(semanaCenas[idx])
                  }
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
      {/* Botón para volver a generar el menú */}
      <button
        onClick={() => navigate("/planificador")}
        className="btn btn-primary"
      >
        Volver a generar
      </button>
      {/* Mostramos el modal SOLO si hay una receta seleccionada */}
      {modalAbierto && recetaModal && (
        <RecetaModal receta={recetaModal} onClose={handleCloseModal} />
      )}
    </div>
  );
}
