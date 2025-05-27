// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "../styles/Layout.css"; // Importa los estilos del layout

export default function Layout() {
  return (
    <div className="layout-app">
      {/* Navbar fijo arriba */}
      <Navbar />
      {/* Contenido central, rellena el espacio entre navbar y footer */}
      <main className="main-content">
        <Outlet />
      </main>
      {/* Footer fijo abajo */}
      <Footer />
    </div>
  );
}
