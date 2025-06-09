import React, { useEffect } from "react";
import "../styles/Home.css"; 
import gsap from "gsap";     // Importación de GSAP, una librería para animaciones complejas

/**
 * Array de objetos que define las diapositivas del slider.
 * Cada diapositiva incluye título, texto principal, subtítulo e imagen de fondo.
 */
const slides = [
  {
    title: "Planifica tus",
    main: "Comidas y cenas",
    subtitle: "Organiza tu semana fácilmente",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "Descubre nuevas",
    main: "Recetas",
    subtitle: "Inspírate cada día",
    image:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "Ahorra tiempo",
    main: "Organizando",
    subtitle: "Tus ingredientes y compras",
    image:
      "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=2070&q=80",
  },
  {
    title: "Personaliza tu",
    main: "Menú",
    subtitle: "Teniendo en cuenta alérgenos",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2070&q=80",
  },
];

/**
 * Componente HeroSlider
 * 
 * Muestra un carrusel animado en la pantalla principal (home) con mensajes clave de la aplicación.
 * Utiliza GSAP para crear transiciones visuales suaves entre diapositivas, alternando títulos, subtítulos e imagen de fondo.
 */
export default function HeroSlider() {
  useEffect(() => {
    // Inicialización de la animación solo al montar el componente
    let i = 0;

    // Crea una timeline de GSAP para animar en bucle infinito (repeat: -1)
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: "expo.out" } });

    // Inicializa el clipPath de los textos de cada diapositiva para controlar su entrada/salida (efecto wipe)
    slides.forEach((_, idx) => {
      gsap.set([`.hero${idx} h2`, `.hero${idx} h1`, `.hero${idx} h3`], {
        clipPath: idx === 0
          ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"    // Visible la primera diapositiva
          : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",        // Ocultas las demás
      });
    });

    // Construye las transiciones de entrada/salida de cada diapositiva
    while (i < slides.length - 1) {
      tl.to(`.hero${i} h2`, { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)", delay: 2 }) // Sale el h2 de la diapositiva actual
        .to(`.hero${i} h1`, { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }, "-=0.3") // Sale el h1
        .to(`.hero${i} h3`, { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }, "-=0.3") // Sale el h3
        .to(`.hero${i} .home-slider-image`, { clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" }, "-=1") // Imagen sale antes
        // Entrada de la siguiente diapositiva (h2, h1, h3)
        .to(`.hero${i + 1} h2`, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" })
        .to(`.hero${i + 1} h1`, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, "-=0.3")
        .to(`.hero${i + 1} h3`, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }, "-=0.3");
      i++;
    }

    // Limpia la animación al desmontar el componente para evitar fugas de memoria
    return () => {
      tl.kill();
    };
  }, []);

  /**
   * Renderiza las diapositivas como artículos.
   * Cada diapositiva tiene su propio contenedor con clases únicas para facilitar la animación.
   */
  return (
    <main className="home-slider-main">
      {slides.map((slide, idx) => (
        <article
          key={idx}
          className={`hero${idx} home-slider-article`}
          style={{ zIndex: slides.length - idx }} // El z-index ordena las diapositivas para la superposición visual
        >
          <div className="home-slider-info">
            <h2>{slide.title}</h2>
            <h1>{slide.main}</h1>
            <h3>{slide.subtitle}</h3>
          </div>
          <div
            className="home-slider-image"
            style={{
              backgroundImage: `url('${slide.image}')`, // Imagen de fondo de la diapositiva
            }}
          ></div>
        </article>
      ))}
    </main>
  );
}