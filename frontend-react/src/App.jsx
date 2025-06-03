import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Páginas principales
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import Planificador from "./pages/Planificador";
import PlanificadorResultados from "./pages/PlanificadorResultados";
import Recetas from "./pages/Recetas";
import GestionRecetas from "./pages/GestionRecetas";

// Componentes comunes
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

/**
 * Componente principal de la aplicación.
 * Define las rutas de navegación usando react-router-dom y asegura que
 * las rutas privadas solo sean accesibles si el usuario tiene un token.
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* ==== RUTA PÚBLICA: LOGIN ==== */}
        <Route path="/login" element={<Auth />} />

        {/* ==== RUTAS PRIVADAS ==== */}
        {/* Contenedor PrivateRoute: verifica si hay token */}
        <Route
          element={
            <PrivateRoute>
              <Layout /> {/* Layout con Navbar, Footer y espacio central */}
            </PrivateRoute>
          }
        >
          {/* ==== PÁGINAS PRIVADAS ==== */}
          <Route path="/home" element={<Home />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/editar" element={<EditarPerfil />} />
          <Route path="/planificador" element={<Planificador />} />
          <Route
            path="/planificador/resultados"
            element={<PlanificadorResultados />}
          />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/recetas/crear" element={<GestionRecetas />} />
          {/* Modo editar para GestionRecetas */}
          <Route
            path="/recetas/editar/:id"
            element={<GestionRecetas modo="editar" />}
          />
        </Route>

        {/* ==== RUTA POR DEFECTO ==== */}
        {/* Redirige cualquier ruta desconocida al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}