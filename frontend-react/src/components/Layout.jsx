// components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "./Layout.css";

/**
 * Layout principal de la app:
 * - Navbar fijo arriba
 * - Contenido central (Outlet)
 * - Footer fijo abajo
 */
export default function Layout() {
  return (
    <div className="layout-app">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
