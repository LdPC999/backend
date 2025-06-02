import React from "react";
import "../styles/Footer.css"; // Importa los estilos específicos del footer

/**
 * Componente Footer
 * 
 * Este componente muestra el pie de página común a toda la aplicación.
 * Incluye el año actual, el nombre de la app y los derechos reservados.
 * 
 * Se recomienda mantener el Footer siempre fuera de los componentes que cambian según la ruta,
 * para que siempre se visualice en la parte inferior de la interfaz.
 */
export default function Footer() {
  return (
    <footer className="footer-app">
      {/* 
        Muestra el año actual usando JavaScript (para que siempre esté actualizado),
        el nombre de la app y la autoría.
        Los símbolos &nbsp; y | ayudan a separar visualmente los textos.
      */}
      {new Date().getFullYear()} Recipe Planner &nbsp;|&nbsp; 
      Todos los derechos reservados | © Luis de Pablo Cárabe
    </footer>
  );
}
