// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css"; // Importa los estilos del footer

export default function Footer() {
  return (
    <footer className="footer-app">
      © {new Date().getFullYear()} NombreApp &nbsp;|&nbsp; Todos los derechos reservados
    </footer>
  );
}
