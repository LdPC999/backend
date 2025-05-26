import React from "react";
import HeroSlider from "../components/HeroSlider";
import "../styles/Home.css";

/**
 * Home: Página principal, solo muestra el slider.
 * El header y el footer los pone el Layout global.
 */
export default function Home() {
  return (
    <div className="home-page">
      <main className="home-slider-container">
        <HeroSlider />
      </main>
    </div>
  );
}