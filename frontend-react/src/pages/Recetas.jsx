import React from "react";
import "../styles/Recetas.css";

/**
 * Página de listado de recetas.
 */
const recetas = [
  { nombre: "Ensalada César", img: "https://picsum.photos/seed/cesar/320/200" },
  { nombre: "Tortilla de patatas", img: "https://picsum.photos/seed/tortilla/320/200" },
  { nombre: "Paella", img: "https://picsum.photos/seed/paella/320/200" }
];

export default function Recetas() {
  return (
    <div className="recetas-page">
      <h2>Recetas</h2>
      <div className="recetas-grid">
        {recetas.map((receta, idx) => (
          <div className="card receta-card" key={idx}>
            <img src={receta.img} alt={receta.nombre} className="receta-img" />
            <h3>{receta.nombre}</h3>
            <a href="#" className="btn btn-secondary">Ver receta</a>
          </div>
        ))}
      </div>
    </div>
  );
}
