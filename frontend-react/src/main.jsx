import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/themes.css';   // Variables globales
import './styles/index.css';    // Estilos globales
import App from './App.jsx';

// Punto de entrada de la aplicación
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
