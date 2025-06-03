# 📚 Trabajo de Fin de Grado (TFG): Frontend — Sistema de Gestión de Recetas

## 🗂️ Índice General

1. **[Introducción](#-1-introducción)**  
   1.1 [Origen y motivación](#11-origen-y-motivación)  
   1.2 [Instalación y puesta en marcha](#12-instalación-y-puesta-en-marcha)  
   1.3 [Metodología](#13-metodología)

2. **[Estado del Arte / Marco Teórico](#-2-estado-del-arte--marco-teórico)**

3. **[Requisitos](#-3-requisitos)**  
   3.1 [Requisitos funcionales](#31-requisitos-funcionales)  
   3.2 [Requisitos no funcionales](#32-requisitos-no-funcionales)

4. **[Diseño](#-4-diseño)**  
   4.1 [Arquitectura General](#41-arquitectura-general)  
   4.2 [Diseño de Interfaz](#42-diseño-de-interfaz)

5. **[Implementación](#-5-implementación)**  
   5.1 [Estructura del Proyecto](#51-estructura-del-proyecto)  
   5.2 [Frontend (React)](#52-frontend-react)

6. **[Pruebas](#6-pruebas)**  
   6.1 [Pruebas en el Frontend](#61-pruebas-en-el-frontend)

7. **[Conclusiones](#7-conclusiones)**

8. **[Líneas de Investigación Futuras](#8-líneas-de-investigación-futuras)**

9. **[Anexos](#9-anexos)**

   - Capturas de pantalla
   - Guía de uso

10. **[Bibliografía](#10-bibliografía)**

---

## 📌 1.- Introducción

### 1.1.- Origen y motivación

Este frontend complementa el backend del Sistema de Gestión de Recetas, proporcionando una interfaz de usuario intuitiva y atractiva. El objetivo es crear una experiencia de usuario fluida que permita gestionar recetas, ingredientes y alérgenos para planificar las comidas y cenas semanales de forma sencilla y visual.

La interfaz está diseñada para ser responsiva, accesible desde cualquier dispositivo, y ofrecer una experiencia de usuario moderna que facilite la planificación de menús y la gestión de recetas adaptadas a las necesidades específicas de cada usuario.

### 1.2.- Instalación y puesta en marcha

A continuación, se detallan los pasos necesarios para clonar y ejecutar el proyecto en local.

#### 🔧 Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) 
- [Git](https://git-scm.com/)
- Backend del proyecto en funcionamiento

#### Instalación de dependencias

```bash
npm install
```

#### Configuración del entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
VITE_API_URL=http://localhost:3000
```

#### Ejecución del proyecto

```bash
npm run dev
```

El frontend queda accesible por defecto en http://localhost:5173

### 1.3.- Metodología

El desarrollo de este frontend sigue una metodología centrada en el usuario:

1. **Diseño centrado en el usuario**: Interfaces intuitivas y accesibles.
2. **Desarrollo por componentes**: Creación de componentes reutilizables.
3. **Prototipado iterativo**: Mejora continua de la interfaz basada en feedback.
4. **Responsive design**: Adaptación a diferentes dispositivos y tamaños de pantalla.
5. **Integración continua**: Pruebas constantes de integración con el backend.

## 🧠 2.- Estado del Arte / Marco teórico

En el panorama actual de desarrollo web, React se ha consolidado como una de las bibliotecas más populares para la creación de interfaces de usuario. Su enfoque basado en componentes permite crear aplicaciones modulares y mantenibles, mientras que su virtual DOM optimiza el rendimiento.

Para este proyecto se ha optado por utilizar React con Vite como herramienta de construcción, aprovechando su velocidad de desarrollo y su eficiente sistema de módulos ES. Además, se han incorporado bibliotecas como:

- **React Router**: Para la navegación entre páginas.
- **GSAP**: Para animaciones fluidas y profesionales.
- **Swiper**: Para implementar carruseles y sliders interactivos.
- **React Icons**: Para una amplia variedad de iconos.
- **React Select**: Para mejorar la experiencia de usuario en formularios complejos.

Esta combinación de tecnologías permite crear una interfaz moderna, rápida y con una excelente experiencia de usuario, siguiendo las tendencias actuales en desarrollo frontend.

## 📋 3.- Requisitos

### 3.1.- Requisitos funcionales

- RF1: Implementar sistema de registro y autenticación de usuarios.
- RF2: Mostrar y permitir la gestión del perfil de usuario.
- RF3: Visualizar listado de recetas con filtros por tipo, ingredientes y alérgenos.
- RF4: Permitir marcar recetas como favoritas.
- RF5: Implementar sistema de planificación de menús semanales.
- RF6: Proporcionar interfaz para la gestión de recetas (crear, editar, eliminar).
- RF7: Visualizar detalles completos de cada receta.
- RF8: Adaptar la interfaz según el rol del usuario (usuario normal o administrador).
- RF9: Implementar sistema de navegación intuitivo entre secciones.

### 3.2.- Requisitos no funcionales

- RNF1: Diseño responsivo adaptable a dispositivos móviles y de escritorio.
- RNF2: Tiempos de carga optimizados para mejorar la experiencia de usuario.
- RNF3: Interfaz intuitiva y accesible.
- RNF4: Consistencia visual en toda la aplicación.
- RNF5: Gestión segura de tokens de autenticación.
- RNF6: Feedback visual para todas las acciones del usuario.
- RNF7: Compatibilidad con los navegadores web modernos.

## 🧱 4.- Diseño

### 4.1.- Arquitectura General

El frontend está estructurado siguiendo un patrón de componentes, con una clara separación entre:

- **Componentes**: Elementos reutilizables de la interfaz.
- **Páginas**: Vistas completas que utilizan múltiples componentes.
- **Utilidades**: Funciones auxiliares para autenticación y comunicación con la API.
- **Estilos**: CSS modular para cada componente y página.

La comunicación con el backend se realiza mediante llamadas a la API REST, utilizando tokens JWT para la autenticación.

```
Frontend (React/Vite) <---> API REST (NestJS) <---> Base de Datos (PostgreSQL)
```

### 4.2.- Diseño de Interfaz

La interfaz de usuario sigue principios de diseño moderno:

- **Paleta de colores**: Combinación de tonos neutros con acentos para destacar elementos importantes.
- **Tipografía**: Fuentes legibles y escalables para mejorar la accesibilidad.
- **Componentes**: Diseño consistente de botones, formularios y elementos de navegación.
- **Layouts**: Estructura flexible que se adapta a diferentes tamaños de pantalla.
- **Feedback visual**: Animaciones sutiles y mensajes informativos para guiar al usuario.

El diseño prioriza la usabilidad y la experiencia de usuario, con especial atención a la accesibilidad y la navegación intuitiva.

## 💻 5.- Implementación

### 5.1.- Estructura del proyecto

```
src/
 ├── assets/           # Recursos estáticos (imágenes, iconos)
 ├── components/       # Componentes reutilizables
 │   ├── AuthForm.jsx  # Formulario de autenticación
 │   ├── Footer.jsx    # Pie de página
 │   ├── HeroSlider.jsx # Slider de la página principal
 │   ├── Layout.jsx    # Estructura común de las páginas
 │   ├── LogoAnimado.jsx # Logo con animación
 │   ├── Navbar.jsx    # Barra de navegación
 │   └── PrivateRoute.jsx # Protección de rutas privadas
 ├── pages/            # Páginas principales
 │   ├── Auth.jsx      # Página de autenticación
 │   ├── EditarPerfil.jsx # Edición de perfil de usuario
 │   ├── GestionRecetas.jsx # Gestión de recetas (admin)
 │   ├── Home.jsx      # Página principal
 │   ├── Perfil.jsx    # Perfil de usuario
 │   ├── Planificador.jsx # Planificador de menús
 │   ├── PlanificadorResultados.jsx # Resultados del planificador
 │   └── Recetas.jsx   # Listado y búsqueda de recetas
 ├── styles/           # Estilos CSS
 ├── utils/            # Utilidades y funciones auxiliares
 │   └── auth.js       # Funciones de autenticación
 ├── App.jsx           # Componente principal y rutas
 └── main.jsx          # Punto de entrada de la aplicación
```

### 5.2.- Frontend (React)

- Desarrollado con React 19 y Vite 6 para un rendimiento óptimo.
- Enrutamiento con React Router v7 para navegación entre páginas.
- Gestión de estado mediante React Hooks.
- Animaciones con GSAP para transiciones fluidas.
- Componentes interactivos con Swiper para carruseles.
- Formularios mejorados con React Select para selección múltiple.
- Diseño responsive con CSS puro, adaptable a cualquier dispositivo.
- Autenticación mediante JWT con almacenamiento seguro en localStorage.

## 🧪 6.- Pruebas

### 6.1.- Pruebas en el frontend

Durante el desarrollo se han realizado pruebas manuales para verificar:

- **Compatibilidad**: Pruebas en diferentes navegadores (Chrome, Firefox, Safari, Edge).
- **Responsividad**: Verificación en múltiples dispositivos y tamaños de pantalla.
- **Usabilidad**: Pruebas con usuarios para evaluar la experiencia de navegación.
- **Integración**: Verificación de la correcta comunicación con el backend.
- **Rendimiento**: Análisis de tiempos de carga y optimización de recursos.

## 7.- Conclusiones

El frontend desarrollado proporciona una interfaz moderna e intuitiva que complementa perfectamente las funcionalidades del backend. La combinación de React con Vite ha permitido crear una aplicación rápida y eficiente, con una experiencia de usuario fluida.

La arquitectura basada en componentes facilita el mantenimiento y la escalabilidad del proyecto, permitiendo añadir nuevas funcionalidades de forma sencilla. El diseño responsive garantiza que la aplicación sea accesible desde cualquier dispositivo, adaptándose a las necesidades del usuario.

## 8.- Líneas de investigación futuras

- Implementación de modo oscuro/claro con cambio automático según preferencias del sistema.
- Desarrollo de una versión como aplicación móvil nativa con React Native.
- Integración de funcionalidades de inteligencia artificial para recomendaciones personalizadas.
- Implementación de gráficos nutricionales para análisis de dietas.
- Funcionalidad de compartir recetas en redes sociales.
- Sistema de notificaciones para recordatorios de planificación.

## 9.- Anexos

### Capturas de pantalla

[Incluir capturas de las principales pantallas de la aplicación]

### Guía de uso

[Incluir breve guía de uso para usuarios finales]

## 10.- Bibliografía

- Documentación de React
- Documentación de Vite
- React Router
- GSAP Animation Platform
- MoureDev
- MiduDev
- OpenAI
- OpenWebinars
