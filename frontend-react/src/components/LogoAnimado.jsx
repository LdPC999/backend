// src/components/LogoAnimado.jsx
import React from "react";
import "../styles/LogoAnimado.css";

/**
 * Logo animado centrado en la mitad izquierda (login) o derecha (registro).
 * Recibe las props:
 *  - position: "left" | "right"
 *  - mode: "login" | "registro"
 */
export default function LogoAnimado({ position = "left", mode = "login" }) {
  // Clases CSS dinámicas según la posición y modo
  const mainClass = `logo-animado logo-animado--${position}`;
  // Según modo, se alternan colores de líneas
  return (
    <div className={mainClass}>
      <span className={mode === "login" ? "logo-login" : "logo-registro"}>
        Recipe
      </span>
      <br />
      <span className={mode === "login" ? "logo-login-sec" : "logo-registro-sec"}>
        Planner
      </span>
    </div>
  );
}
