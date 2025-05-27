// Home.jsx con react-scroll implementado
import React, { useEffect } from "react";
import HeroSlider from "../components/HeroSlider";
import "../styles/Home.css";
import { Element, scroller } from "react-scroll";

/**
 * Home: Página principal solo con slider y descripción.
 * El layout general (Navbar y Footer) lo pone Layout.jsx.
 */
export default function Home() {
  useEffect(() => {
    // Asegura que la página comience desde arriba al cargar
    scroller.scrollTo('home-top', {
      duration: 100,
      smooth: true,
      containerId: 'home-container'
    });
  }, []);

  return (
    <div className="home-page" id="home-container">
      <Element name="home-top"></Element>
      {/* Slider ocupa el espacio disponible */}
      <main className="home-slider-container">
        <HeroSlider />
      </main>
      {/* Descripción */}
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
