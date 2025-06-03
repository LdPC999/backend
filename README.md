# 📚 Proyecto - RECIPE PLANNER

## 🗂️ Índice General

1. **[Introducción](#-1-introducción)**
2. **[Arquitectura y tecnología](#-2-arquitectura-y-tecnología)**
3. **[Instalación y despliegue](#-3-instalación-y-despliegue)**
4. **[Acceso a la aplicación](#-4-acceso-a-la-aplicación)**
5. **[Estructura del repositorio](#-5-estructura-del-repositorio)**
6. **[Metodología y buenas prácticas](#-6-metodología-y-buenas-prácticas)**
7. **[Conclusiones y líneas futuras](#-7-conclusiones-y-líneas-futuras)**
8. **[Bibliografía](#-8-bibliografía)**

---

## 📌 1.- Introducción

Este proyecto de **Trabajo de Fin de Grado** consiste en el desarrollo de un sistema completo para la gestión de recetas, ingredientes, perfiles y planificación de menús semanales, con especial atención a la personalización por alérgenos y necesidades alimentarias.

El objetivo es ofrecer una solución moderna, segura y escalable, accesible tanto desde dispositivos de escritorio como desde móviles, y disponible en la nube para su uso desde cualquier lugar.

---

## 🏗️ 2.- Arquitectura y tecnología

El sistema está compuesto por dos grandes módulos:

- **Backend**: Desarrollado en NestJS (Node.js + TypeScript), responsable de la API REST, lógica de negocio, autenticación y gestión de base de datos.
  - **Despliegue**: Railway
  - **Base de datos**: PostgreSQL gestionada en Neon

- **Frontend**: Desarrollado en React (con Vite) para una experiencia de usuario moderna, rápida y responsiva.
  - **Despliegue**: Vercel

### Diagrama de arquitectura

```
Frontend (React/Vite) — Vercel
           |
           v
Backend (NestJS) — Railway
           |
           v
Base de datos (PostgreSQL) — Neon
```

Todos los módulos pueden ejecutarse en local para desarrollo, pero también están disponibles en producción a través de servicios cloud.

---

## 🚀 3.- Instalación y despliegue

Cada módulo cuenta con su propio README con instrucciones detalladas, pero aquí se resumen los pasos principales:

### Backend

1. Clona el repositorio y accede a la carpeta `/backend`.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno (`.env`) para la conexión a PostgreSQL (Neon o local).
4. Inicia el servidor:
   ```bash
   npm run start:dev
   ```
5. Accesible por defecto en: http://localhost:3000

### Frontend

1. Accede a la carpeta `/frontend-react`.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Configura el archivo `.env` con la URL de la API:
   ```
   VITE_API_URL=http://localhost:3000
   ```
   (O la URL pública del backend en Railway, si se desea probar el despliegue cloud)
4. Inicia el frontend:
   ```bash
   npm run dev
   ```
5. Accesible por defecto en: http://localhost:5173

---

## 🌍 4.- Acceso a la aplicación

Además del entorno local, la aplicación está disponible públicamente gracias a los despliegues en la nube:

- **Frontend (React, Vercel):**  
  👉 [https://tfg-recipe-planner.vercel.app](https://tfg-recipe-planner.vercel.app)

- **Backend (NestJS, Railway):**  
  Acceso restringido a través de la API (consultar variables de entorno y URL del servicio Railway en producción).

- **Base de datos (PostgreSQL, Neon):**  
  Gestionada en la nube; las aplicaciones se conectan mediante variables de entorno seguras.

Esto permite utilizar el sistema desde cualquier dispositivo con acceso a Internet, sin necesidad de instalar nada salvo que desees desarrollarlo o personalizarlo en local.

---

## 🗂️ 5.- Estructura del repositorio

```
/
├── backend/        # API REST y lógica de negocio (NestJS)
│   └── README.md   # Instrucciones específicas del backend
├── frontend-react/ # Interfaz de usuario (React + Vite)
│   └── README.md   # Instrucciones específicas del frontend
├── README.md       # (Este archivo) Visión global e integración de módulos
```

Consulta los README de cada módulo para detalles sobre su estructura interna, dependencias y scripts disponibles.

---

## 🛠️ 6.- Metodología y buenas prácticas

- **Desarrollo modular:** Separación clara entre frontend y backend.
- **Documentación exhaustiva:** Código comentado y README detallados.
- **Seguridad:** Autenticación JWT, cifrado de contraseñas, validación de datos.
- **Escalabilidad:** Arquitectura preparada para añadir nuevas funcionalidades (módulos, filtros, roles, etc).
- **Despliegue cloud:** Railway y Vercel para facilitar acceso, testing y mantenimiento continuo.
- **Pruebas:** Manuales y unitarias, integración con Postman y PGAdmin.

---

## 📝 7.- Conclusiones y líneas futuras

El sistema desarrollado permite la gestión eficiente de recetas y menús personalizados, con una arquitectura preparada para la escalabilidad y el despliegue en la nube.  
El uso de Railway, Neon y Vercel permite ofrecer un servicio disponible y fácilmente accesible desde cualquier parte.

**Líneas futuras sugeridas:**
- Aplicación móvil con React Native.
- Nuevos filtros nutricionales y análisis de menús.
- Notificaciones y recordatorios inteligentes.
- Integración con redes sociales o exportación de menús.

---

## 📚 8.- Bibliografía

- Documentación oficial de NestJS, React, Vite, Railway, Vercel y Neon.
- MoureDev, MiduDev, OpenAI, OpenWebinars.
- Referencias a proyectos similares y tendencias de desarrollo web moderno.

---
