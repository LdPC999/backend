import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import Planificador from "./pages/Planificador";
import PlanificadorResultados from "./pages/PlanificadorResultados";
import Recetas from "./pages/Recetas";
import GestionRecetas from "./pages/GestionRecetas";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

/**
 * Componente principal de la aplicación.
 * Define las rutas de navegación utilizando react-router-dom y protege
 * las rutas internas mediante PrivateRoute (requiere estar autenticado).
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública: login */}
        <Route path="/login" element={<Auth />} />

        {/* Rutas privadas: requieren token */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
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
          <Route
            path="/recetas/editar/:id"
            element={<GestionRecetas modo="editar" />}
          />
        </Route>

        {/* Redirección a login si no se encuentra la ruta */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
