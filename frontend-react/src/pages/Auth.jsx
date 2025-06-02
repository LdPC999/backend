// src/pages/Auth.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import LogoAnimado from "../components/LogoAnimado"; // Importamos el logo
import AuthForm from "../components/AuthForm";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [message, setMessage] = useState("");
  const slideBoxRef = useRef(null);
  const topLayerRef = useRef(null);
  const navigate = useNavigate();

  // Controla si estamos en login o registro para pasar el estado al logo
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
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

  // Funciones para animar el cambio de panel
  const goRight = () => {
    if (!isMobile && slideBoxRef.current && topLayerRef.current) {
      slideBoxRef.current.style.marginLeft = "0";
      topLayerRef.current.style.marginLeft = "100%";
    }
    setIsLogin(false);
    setMessage("");
  };
  const goLeft = () => {
    if (!isMobile && slideBoxRef.current && topLayerRef.current) {
      slideBoxRef.current.style.marginLeft = "50%";
      topLayerRef.current.style.marginLeft = "0";
    }
    setIsLogin(true);
    setMessage("");
  };

  // Login y registro
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
        // navigate("/home");
      } else {
        setMessage(data.message || "Error en registro");
      }
    } catch (err) {
      setMessage("Error de red o servidor");
    }
  };

  return (
    <>
      {/* Fondos y animación */}
      <div id="back">
        <canvas id="canvas" className="canvas-back"></canvas>
        <div className="backRight"></div>
        <div className="backLeft"></div>
      </div>

      {/* Logo animado centrado en la mitad correspondiente */}
      {!isMobile && (
        <LogoAnimado
          position={isLogin ? "left" : "right"}
          mode={isLogin ? "login" : "registro"}
        />
      )}

      {/* Paneles desktop */}
      {!isMobile && (
        <div id="slideBox" ref={slideBoxRef}>
          <div className="topLayer" ref={topLayerRef}>
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
                      <label className="toggle-label" htmlFor="terms-desktop">
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

      {/* Móvil: solo un panel visible, sin logo */}
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
                    <label className="toggle-label" htmlFor="terms-mobile">
                      Acepto los términos y condiciones
                    </label>
                  </div>
                </div>
              )}
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
