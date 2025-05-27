// components/Footer.jsx
import React from "react";
import "./Footer.css";

/**
 * Footer fijo abajo, solo con info legal/copyright.
 */
export default function Footer() {
  return (
    <footer className="footer-app">
      © {new Date().getFullYear()} NombreApp &nbsp;|&nbsp; Todos los derechos reservados
    </footer>
  );
}
