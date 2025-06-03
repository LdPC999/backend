import React from "react";
import "../styles/LogoAnimado.css"; // Importa los estilos específicos del logo animado

/**
 * Componente LogoAnimado
 *
 * Este componente visualiza el logo animado de la aplicación, adaptando
 * su posición (izquierda/derecha) y estilo visual según el modo de pantalla
 * (login o registro). Está diseñado para integrarse en la pantalla de autenticación,
 * reforzando la identidad visual y mejorando la experiencia de usuario.
 *
 * Props:
 *  - position: "left" | "right" -> Define la posición visual del logo en la pantalla
 *  - mode: "login" | "registro" -> Cambia la gama cromática y animaciones del logo
 */
export default function LogoAnimado({ position = "left", mode = "login" }) {
  // Calcula la clase CSS principal según la posición recibida por props.
  // Ejemplo: 'logo-animado logo-animado--left'
  const mainClass = `logo-animado logo-animado--${position}`;

  // El logo se compone de dos líneas (Recipe / Planner) que alternan el color según el modo (login o registro).
  // Esto refuerza visualmente el estado de la UI.
  return (
    <div className={mainClass}>
      {/* Primera línea del logo: cambia de color según el modo */}
      <span className={mode === "login" ? "logo-login" : "logo-registro"}>
        Recipe
      </span>
      <br />
      {/* Segunda línea: cambia a un color secundario según el modo */}
      <span className={mode === "login" ? "logo-login-sec" : "logo-registro-sec"}>
        Planner
      </span>
    </div>
  );
}