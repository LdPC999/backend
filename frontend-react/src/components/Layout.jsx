import React from "react";
import Navbar from "./Navbar";       // Importa el componente de la barra de navegación superior
import Footer from "./Footer";       // Importa el componente del pie de página
import { Outlet } from "react-router-dom"; // Importa Outlet para renderizar rutas anidadas
import "../styles/Layout.css";      // Importa los estilos específicos para el layout

/**
 * Componente Layout
 *
 * Este componente sirve como plantilla estructural para las páginas internas de la aplicación.
 * Envuelve el contenido principal con una barra de navegación fija superior (Navbar)
 * y un pie de página fijo inferior (Footer), asegurando coherencia y reutilización visual en todas las rutas protegidas.
 */
export default function Layout() {
  return (
    // Contenedor principal del layout, aplica estilos globales para asegurar
    // el correcto posicionamiento de la navbar, el contenido y el footer.
    <div className="layout-app">
      {/* Navbar fija en la parte superior de la aplicación */}
      <Navbar />
      {/* 
        Contenedor central para las rutas anidadas.
        <Outlet /> es un componente especial de React Router DOM que
        representa el contenido de la ruta hija activa.
      */}
      <main className="main-content">
        <Outlet />
      </main>
      {/* Footer fijo en la parte inferior */}
      <Footer />
    </div>
  );
}