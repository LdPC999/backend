import React, { useState } from "react";
import "../styles/Auth.css"; // Importa los estilos específicos del formulario de autenticación

/**
 * Componente AuthForm
 * 
 * Formulario reutilizable para autenticación de usuarios, permitiendo tanto login como registro.
 * Su comportamiento se controla mediante las props:
 * - isLogin: booleano que indica si el formulario está en modo login o registro
 * - onToggle: función que alterna entre login y registro
 * - termsAccepted, setTermsAccepted: controlan el estado del checkbox de términos en registro
 * - onLogin, onRegister: funciones de callback para el envío de los formularios respectivos
 */
export default function AuthForm({
  isLogin,
  onToggle,
  termsAccepted,
  setTermsAccepted,
  onLogin,
  onRegister,
}) {
  // Estados locales para almacenar los campos del formulario
  const [nombre, setNombre] = useState("");       // Nombre del usuario (solo en registro)
  const [apellidos, setApellidos] = useState(""); // Apellidos del usuario (solo en registro)
  const [email, setEmail] = useState("");         // Email (siempre requerido)
  const [password, setPassword] = useState("");   // Contraseña (siempre requerida)

  /**
   * handleSubmit
   * 
   * Gestiona el envío del formulario, diferenciando entre login y registro:
   * - En login: llama a la función onLogin si está definida, pasando los datos del formulario.
   * - En registro: verifica que se hayan aceptado los términos antes de llamar a onRegister.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el recargo de la página
    const formData = { email, password, nombre, apellidos }; // Datos a enviar

    if (isLogin) {
      // Si es login, llama a onLogin (si está definida)
      if (typeof onLogin === "function") onLogin(formData);
    } else {
      // Si es registro, exige aceptar términos
      if (!termsAccepted) {
        alert("Debes aceptar los términos y condiciones.");
        return;
      }
      // Si todo correcto, llama a onRegister
      if (typeof onRegister === "function") onRegister(formData);
    }
  };

  /**
   * handleForgotPassword
   * 
   * Manejador para el link de recuperación de contraseña.
   * Actualmente muestra un alert, pero puede integrarse con navegación o modales.
   */
  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Funcionalidad de recuperación de contraseña no implementada aún.");
  };

  // Renderizado del formulario
  return (
    <form
      className={`form-content ${isLogin ? "light" : "dark"}`}
      onSubmit={handleSubmit}
    >
      <h2 className="header">{isLogin ? "LOGIN" : "REGISTRO"}</h2>

      {/* Campos de nombre y apellidos, solo visibles en el registro */}
      {!isLogin && (
        <>
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            autoComplete="given-name"
          />
          <label htmlFor="apellidos">Apellidos</label>
          <input
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
            autoComplete="family-name"
          />
        </>
      )}

      {/* Campo de email, siempre visible */}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required
        autoComplete="email"
      />

      {/* Campo de contraseña, siempre visible */}
      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        autoComplete={isLogin ? "current-password" : "new-password"}
      />

      {/* Checkbox de términos y condiciones, solo visible en registro */}
      {!isLogin && (
        <div className="checkbox-container" style={{ marginBottom: "1em" }}>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            aria-label="Acepto los términos y condiciones"
            id="terms-checkbox"
          />
          <span className="checkbox-text" style={{ marginLeft: 7 }}>
            Acepto los{" "}
            <a href="#" className="link" tabIndex={-1}>
              términos
            </a>{" "}
            y la{" "}
            <a href="#" className="link" tabIndex={-1}>
              política
            </a>
          </span>
        </div>
      )}

      {/* Botón principal: cambia el texto y color según modo */}
      <button
        type="submit"
        className={`btn ${isLogin ? "btn-login" : "btn-signup"}`}
        aria-label={isLogin ? "Iniciar sesión" : "Registrarme"}
        disabled={!isLogin && !termsAccepted} // Deshabilita si no acepta términos
      >
        {isLogin ? "Iniciar sesión" : "Registrarme"}
      </button>

      {/* Botón para alternar entre login y registro */}
      <button type="button" className="link-button" onClick={onToggle}>
        {isLogin
          ? "¿No tienes cuenta? Regístrate aquí"
          : "¿Ya tienes cuenta? Inicia sesión"}
      </button>

      {/* Enlace para recuperar contraseña, solo en login */}
      {isLogin && (
        <div style={{ marginTop: "1em", textAlign: "right" }}>
          <a
            href="#"
            onClick={handleForgotPassword}
            style={{
              color: "#247aff",
              textDecoration: "underline",
              fontSize: "0.98em",
            }}
          >
            ¿Has olvidado tu contraseña?
          </a>
        </div>
      )}
    </form>
  );
}