import React from "react";
import "../styles/Home.css";

/**
 * Página principal adaptada al nuevo estilo moderno inspirado en la plantilla.
 */
export default function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">NombreApp</h1>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <h2>Descubre, planifica y gestiona</h2>
          <h1>Tu semana gastronómica</h1>
          <p>
            Organiza tus recetas favoritas, controla tus alérgenos y crea
            planificaciones semanales personalizadas.
          </p>
          <div className="home-buttons">
            <a href="/planificador" className="btn btn-primary">
              Ir al Planificador
            </a>
            <a href="/recetas" className="btn btn-secondary">
              Ver Recetas
            </a>
          </div>
        </div>

        <div className="home-hero-image"></div>
      </section>
    </div>
  );
}
