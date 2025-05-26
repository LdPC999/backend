// pages/Auth.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

// URL base del backend
const API_URL = "http://192.168.1.134:3000/auth";

export default function Auth() {
  // Estado para saber si estamos en login o registro
  const [isLogin, setIsLogin] = useState(true);
  // Estado para saber si es móvil
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  // Estado para mostrar mensajes de error o éxito
  const [message, setMessage] = useState("");
  // Refs para animaciones en escritorio
  const slideBoxRef = useRef(null);
  const topLayerRef = useRef(null);
  const navigate = useNavigate();

  // Actualiza el estado de móvil/escritorio al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Animación solo en escritorio
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
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animación para pasar a registro
  const goRight = () => {
    if (!isMobile && slideBoxRef.current && topLayerRef.current) {
      slideBoxRef.current.style.marginLeft = "0";
      topLayerRef.current.style.marginLeft = "100%";
    }
    setIsLogin(false);
    setMessage("");
  };

  // Animación para pasar a login
  const goLeft = () => {
    if (!isMobile && slideBoxRef.current && topLayerRef.current) {
      slideBoxRef.current.style.marginLeft = "50%";
      topLayerRef.current.style.marginLeft = "0";
    }
    setIsLogin(true);
    setMessage("");
  };

  // Función para hacer login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        // Guarda el token y redirige o actualiza el estado global
        localStorage.setItem("token", data.access_token);
        setMessage("Login correcto");
        navigate("/home"); // Redirige a Home
      } else {
        setMessage(data.message || "Error en login");
      }
    } catch (err) {
      setMessage("Error de red o servidor");
    }
  };

  // Función para hacer registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    const form = e.target;
    const nombre = form.nombre.value;
    const apellidos = form.apellidos.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellidos, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("Registro correcto");
        // Puedes redirigir o cambiar a login automáticamente
      } else {
        setMessage(data.message || "Error en registro");
      }
    } catch (err) {
      setMessage("Error de red o servidor");
    }
  };

  return (
    <>
      {/* Fondos y animación solo en escritorio */}
      <div id="back">
        {/* Si quieres el fondo animado, añade el canvas */}
        <canvas id="canvas" className="canvas-back"></canvas>
        <div className="backRight"></div>
        <div className="backLeft"></div>
      </div>

      {/* Vista escritorio: animación entre login y registro */}
      {!isMobile && (
        <div id="slideBox" ref={slideBoxRef}>
          <div className="topLayer" ref={topLayerRef}>
            {/* Panel de registro */}
            <div className="left">
              <div className="content">
                <h2>Registro</h2>
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
                  <div className="form-element form-submit">
                    <button className="signup" type="submit">
                      Registro
                    </button>
                    <button
                      type="button"
                      className="signup off"
                      onClick={goLeft}
                    >
                      Login
                    </button>
                  </div>
                  {message && !isLogin && (
                    <div style={{ color: "red", marginTop: "1em" }}>{message}</div>
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
                    >
                      Registro
                    </button>
                  </div>
                  {message && isLogin && (
                    <div style={{ color: "red", marginTop: "1em" }}>{message}</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vista móvil: solo un formulario visible */}
      {isMobile && (
        <div className="mobile-auth">
          <div className="content">
            <h2>{isLogin ? "Login" : "Registro"}</h2>
            <form onSubmit={isLogin ? handleLogin : handleRegister}>
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
              <div className="form-element form-submit">
                <button className={isLogin ? "login" : "signup"} type="submit">
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
