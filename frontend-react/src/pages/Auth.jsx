import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import LogoAnimado from "../components/LogoAnimado"; 
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Componente de autenticación que gestiona el login y el registro.
 * - En escritorio: muestra paneles animados con logo.
 * - En móvil: muestra un solo panel para login o registro.
 * - Controla la transición entre paneles y la lógica de autenticación.
 */
export default function Auth() {
  // Estado que determina si se muestra login o registro
  const [isLogin, setIsLogin] = useState(true);
  // Estado para detectar si es móvil (ancho <= 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // Mensaje para mostrar errores o éxito
  const [message, setMessage] = useState("");
  // Refs para los elementos animados en escritorio
  const slideBoxRef = useRef(null);
  const topLayerRef = useRef(null);
  const navigate = useNavigate();

  /**
   * Efecto para controlar el modo móvil/escritorio y ajustar la animación.
   * - Se ejecuta al cargar y al cambiar el tamaño de la ventana.
   */
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Ajusta los márgenes para la animación en escritorio
      if (slideBoxRef.current && topLayerRef.current) {
        if (mobile) {
          slideBoxRef.current.style.marginLeft = "0";
          topLayerRef.current.style.marginLeft = "0";
        } else {
          slideBoxRef.current.style.marginLeft = "50%";
          topLayerRef.current.style.marginLeft = "0";
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Inicializa los valores
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Cambia a la vista de registro (animación a la derecha en escritorio).
   */
  const goRight = () => {
    if (!isMobile && slideBoxRef.current && topLayerRef.current) {
      slideBoxRef.current.style.marginLeft = "0";
      topLayerRef.current.style.marginLeft = "100%";
    }
    setIsLogin(false);
    setMessage("");
  };

  /**
   * Cambia a la vista de login (animación a la izquierda en escritorio).
   */
  const goLeft = () => {
    if (!isMobile && slideBoxRef.current && topLayerRef.current) {
      slideBoxRef.current.style.marginLeft = "50%";
      topLayerRef.current.style.marginLeft = "0";
    }
    setIsLogin(true);
    setMessage("");
  };

  /**
   * Lógica para manejar el login.
   * - Envía email y contraseña al endpoint /auth/login.
   * - Si es correcto, guarda el token y redirige a /home.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("Login correcto");
        navigate("/home");
      } else {
        setMessage(data.message || "Error en login");
      }
    } catch (err) {
      setMessage("Error de red o servidor");
    }
  };

  /**
   * Lógica para manejar el registro.
   * - Envía los datos del usuario al endpoint /auth/register.
   * - Si es correcto, guarda el token.
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    const form = e.target;
    const nombre = form.nombre.value;
    const apellidos = form.apellidos.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidos, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("Registro correcto");
        // navigate("/home"); // Lo puedes descomentar si quieres ir directamente a home
      } else {
        setMessage(data.message || "Error en registro");
      }
    } catch (err) {
      setMessage("Error de red o servidor");
    }
  };

  return (
    <>
      {/* Fondo y decoración animada */}
      <div id="back">
        <canvas id="canvas" className="canvas-back"></canvas>
        <div className="backRight"></div>
        <div className="backLeft"></div>
      </div>

      {/* Logo animado solo en escritorio */}
      {!isMobile && (
        <LogoAnimado
          position={isLogin ? "left" : "right"}
          mode={isLogin ? "login" : "registro"}
        />
      )}

      {/* Paneles de login y registro en escritorio */}
      {!isMobile && (
        <div id="slideBox" ref={slideBoxRef}>
          <div className="topLayer" ref={topLayerRef}>
            {/* Panel de registro */}
            <div className="left">
              <div className="content">
                <h2 style={{ color: "#CDB380" }}>Registro</h2>
                <form onSubmit={handleRegister}>
                  <div className="form-element form-stack">
                    <label>Nombre</label>
                    <input type="text" name="nombre" required />
                  </div>
                  <div className="form-element form-stack">
                    <label>Apellidos</label>
                    <input type="text" name="apellidos" required />
                  </div>
                  <div className="form-element form-stack">
                    <label>Email</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="form-element form-stack">
                    <label>Contraseña</label>
                    <input type="password" name="password" required />
                  </div>
                  <div className="form-element form-stack">
                    <div className="toggle-switch">
                      <input
                        type="checkbox"
                        name="terms"
                        id="terms-desktop"
                        required
                      />
                      <span className="slider"></span>
                      <label
                        className="toggle-label"
                        htmlFor="terms-desktop"
                      >
                        Acepto los términos y condiciones
                      </label>
                    </div>
                  </div>
                  <div className="form-element form-submit">
                    <button className="signup" type="submit">
                      Registro
                    </button>
                    <button
                      type="button"
                      className="signup off"
                      onClick={goLeft}
                      style={{ color: "var(--color-primary)" }}
                    >
                      Login
                    </button>
                  </div>
                  {message && !isLogin && (
                    <div style={{ color: "red", marginTop: "1em" }}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Panel de login */}
            <div className="right">
              <div className="content">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                  <div className="form-element form-stack">
                    <label>Email</label>
                    <input type="email" name="email" required />
                  </div>
                  <div className="form-element form-stack">
                    <label>Contraseña</label>
                    <input type="password" name="password" required />
                  </div>
                  <div className="form-element form-submit">
                    <button className="login" type="submit">
                      Log In
                    </button>
                    <button
                      type="button"
                      className="login off"
                      onClick={goRight}
                      style={{ color: "var(--color-secondary)" }}
                    >
                      Registro
                    </button>
                  </div>
                  {message && isLogin && (
                    <div style={{ color: "red", marginTop: "1em" }}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista móvil: solo un panel visible */}
      {isMobile && (
        <div className="mobile-auth">
          <div className="content">
            <h2>{isLogin ? "Login" : "Registro"}</h2>
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
              {/* Campos adicionales solo en registro */}
              {!isLogin && (
                <>
                  <div className="form-element form-stack">
                    <label>Nombre</label>
                    <input type="text" name="nombre" required />
                  </div>
                  <div className="form-element form-stack">
                    <label>Apellidos</label>
                    <input type="text" name="apellidos" required />
                  </div>
                </>
              )}
              <div className="form-element form-stack">
                <label>Email</label>
                <input type="email" name="email" required />
              </div>
              <div className="form-element form-stack">
                <label>Contraseña</label>
                <input type="password" name="password" required />
              </div>
              {/* Checkbox solo en registro */}
              {!isLogin && (
                <div className="form-element form-stack">
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      name="terms"
                      id="terms-mobile"
                      required
                    />
                    <span className="slider"></span>
                    <label
                      className="toggle-label"
                      htmlFor="terms-mobile"
                    >
                      Acepto los términos y condiciones
                    </label>
                  </div>
                </div>
              )}
              <div className="form-element form-submit">
                <button
                  className={isLogin ? "login" : "signup"}
                  type="submit"
                >
                  {isLogin ? "Log In" : "Registro"}
                </button>
                <button
                  type="button"
                  className={isLogin ? "login off" : "signup off"}
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage("");
                  }}
                >
                  {isLogin ? "Registro" : "Login"}
                </button>
              </div>
              {message && (
                <div style={{ color: "red", marginTop: "1em" }}>{message}</div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}