import React from "react";
import "../styles/Planificador.css";

/**
 * Página principal del planificador semanal.
 */
export default function Planificador() {
  const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  return (
    <div className="planificador-page card">
      <h2>Planificador Semanal</h2>
      <div className="planificador-grid">
        {dias.map(dia => (
          <div className="planificador-dia" key={dia}>
            <strong>{dia}</strong>
            <div className="planificador-slot">Añadir receta</div>
          </div>
        ))}
      </div>
    </div>
  );
}
