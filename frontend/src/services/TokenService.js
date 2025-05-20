// src/services/tokenService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar token
export const saveToken = async (token) => {
  await AsyncStorage.setItem('token', token);
};

// Obtener token
export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// Eliminar token
export const removeToken = async () => {
  await AsyncStorage.removeItem('token');
};
