// src/utils/auth.js

/**
 * Devuelve el token JWT guardado en localStorage
 */
export function getToken() {
  return localStorage.getItem("token");
}

/**
 * Decodifica el JWT y devuelve el rol del usuario actual ("admin" o "user").
 * El JWT debe estar guardado en localStorage como 'token'.
 */
export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || payload.rol || null; // Ajusta si tu backend usa otro nombre
  } catch {
    return null;
  }
}
