import React, { useEffect } from "react";
import HeroSlider from "../components/HeroSlider"; // Slider principal de la página
import "../styles/Home.css";
import { Element, scroller } from "react-scroll"; // Librería para scroll suave

/**
 * Componente Home: página principal de la aplicación.
 * - Muestra un slider principal y una descripción de la app.
 * - Usa react-scroll para que comience siempre desde arriba al cargar.
 * - El navbar y el footer están en Layout.jsx, no aquí.
 */
export default function Home() {
  useEffect(() => {
    /**
     * Al montar el componente, hace scroll suave al inicio de la página.
     * - Usamos el contenedor con id="home-container" para que funcione bien.
     * - Duración de la animación: 100ms.
     */
    scroller.scrollTo('home-top', {
      duration: 100,
      smooth: true,
      containerId: 'home-container'
    });
  }, []);

  return (
    <div className="home-page" id="home-container">
      {/* Elemento de referencia para el scroll suave */}
      <Element name="home-top"></Element>

      {/* Slider principal que ocupa todo el espacio disponible */}
      <main className="home-slider-container">
        <HeroSlider />
      </main>

      {/* Sección de descripción */}
      <Element name="description">
        <section className="home-description">
          <h2>¿Qué hace esta aplicación?</h2>
          <p>
            Organiza tu semana con recetas variadas, ahorra tiempo planificando
            tus menús y comparte tus platos favoritos con familia y amigos. ¡Todo
            en un solo lugar!
          </p>
        </section>
      </Element>

      {/* Tarjetas descriptivas con los puntos clave */}
      <Element name="cards">
        <div className="home-description-cards">
          <div className="home-description-card">
            <h3>Planifica Fácil</h3>
            <p>Crea menús semanales en segundos y ahorra tiempo cada día.</p>
          </div>
          <div className="home-description-card">
            <h3>Recetas Variadas</h3>
            <p>Descubre nuevas recetas y mantén tu alimentación siempre interesante.</p>
          </div>
          <div className="home-description-card">
            <h3>Comparte y Disfruta</h3>
            <p>Comparte tus menús y recetas favoritas con amigos y familia.</p>
          </div>
        </div>
      </Element>
    </div>
  );
}