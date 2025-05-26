import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importamos las páginas principales de la aplicación
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import Planificador from "./pages/Planificador";
import PlanificadorResultados from "./pages/PlanificadorResultados";
import Recetas from "./pages/Recetas";

// Importamos el componente Layout, que envuelve a las páginas internas
import Layout from "./components/Layout";

/**
 * Componente principal de la aplicación.
 * Define las rutas de navegación utilizando react-router-dom.
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de login */}
        <Route path="/login" element={<Auth />} />

        {/* Rutas que están dentro del Layout (menú de navegación y contenedor principal) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/editar" element={<EditarPerfil />} />
          <Route path="/planificador" element={<Planificador />} />
          <Route path="/planificador/resultados" element={<PlanificadorResultados />} />
          <Route path="/recetas" element={<Recetas />} />
        </Route>

        {/* Redirección a login si no se encuentra la ruta */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
