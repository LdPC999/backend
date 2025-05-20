// src/services/AuthService.js
import { saveToken } from "./TokenService";

const API_URL = "http://192.168.1.134:3000/auth";

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      password: password,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.warn("LOGIN ERROR:", text);
    throw new Error('Credenciales inválidas');
  }

  const data = await response.json();
  await saveToken(data.access_token);
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      nombre: userData.nombre,
      apellidos: userData.apellidos,
    }),
  });

  if (!response.ok) throw new Error('Error al registrar');
  const data = await response.json();
  await saveToken(data.access_token);
  return data;
};
