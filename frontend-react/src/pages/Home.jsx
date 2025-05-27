import React, { useState } from "react";
import HeroSlider from "../components/HeroSlider";
import "../styles/Home.css";

/**
 * Home: Página principal con layout flexible para evitar
 * que el slider tape el footer.
 * Estructura:
 * - header:
 * - main: slider ocupa el espacio entre header y footer
 * - footer:
 */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-page">
      {/* Header fijo arriba */}
      <header className="pageHeader"></header>
      {/* Slider ocupa el espacio disponible */}
      <main className="home-slider-container">
        <HeroSlider />
      </main>
      {/* Descripción */}
      <section className="home-description">
        <h2>¿Qué hace esta aplicación?</h2>
        <p>
          Organiza tu semana con recetas variadas, ahorra tiempo planificando
          tus menús y comparte tus platos favoritos con familia y amigos. ¡Todo
          en un solo lugar!
        </p>
      </section>
    </div>
  );
}
