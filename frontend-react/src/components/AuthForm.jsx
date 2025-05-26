import React, { useState } from "react";
import "../styles/Auth.css"; // Estilos específicos para la pantalla de login/registro

/**
 * Componente para el formulario de autenticación (login/registro)
 */
export default function AuthForm({
  isLogin,
  onToggle,
  termsAccepted,
  setTermsAccepted,
  onLogin,
  onRegister,
}) {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { email, password, nombre, apellidos };

    if (isLogin) {
      if (typeof onLogin === "function") onLogin(formData);
    } else {
      if (!termsAccepted) {
        alert("Debes aceptar los términos y condiciones.");
        return;
      }
      if (typeof onRegister === "function") onRegister(formData);
    }
  };

  return (
    <div className={`form-content ${isLogin ? "light" : "dark"}`}>
      <h2 className="header">{isLogin ? "LOGIN" : "REGISTRO"}</h2>

      {/* Campos adicionales solo en el registro */}
      {!isLogin && (
        <>
          <label>Nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <label>Apellidos</label>
          <input
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
          />
        </>
      )}

      {/* Campo email */}
      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
      />

      {/* Campo contraseña */}
      <label>Contraseña</label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
      />

      {/* Checkbox de términos solo en registro */}
      {!isLogin && (
        <div className="checkbox-container">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            aria-label="Acepto los términos y condiciones"
          />
          <span className="checkbox-text">
            Acepto los <a href="#" className="link">términos</a> y la{" "}
            <a href="#" className="link">política</a>
          </span>
        </div>
      )}

      {/* Botón de acción */}
      <button
        type="button"
        className={`btn ${isLogin ? "btn-login" : "btn-signup"}`}
        onClick={handleSubmit}
        aria-label={isLogin ? "Iniciar sesión" : "Registrarme"}
      >
        {isLogin ? "Iniciar sesión" : "Registrarme"}
      </button>

      {/* Botón de alternar login/registro */}
      <button
        type="button"
        className="link-button"
        onClick={onToggle}
      >
        {isLogin
          ? "¿No tienes cuenta? Regístrate aquí"
          : "¿Ya tienes cuenta? Inicia sesión"}
      </button>
    </div>
  );
}
