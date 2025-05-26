# NombreApp

¡Bienvenido a NombreApp! Esta aplicación te permite descubrir, planificar y gestionar tus recetas favoritas de forma sencilla y visual.

## 🚀 Tecnologías utilizadas

- **React**: Librería principal para construir la interfaz de usuario.
- **React Router**: Para la navegación entre páginas.
- **Swiper.js**: Carrusel de imágenes en la pantalla de inicio.
- **CSS variables**: Sistema de temas y paleta de colores unificada.
- **Vite**: Herramienta rápida para el desarrollo frontend (opcional, si lo usas).

## 📁 Estructura de carpetas

```
src/
├── components/           # Componentes reutilizables (AuthForm, Layout)
├── pages/                # Páginas principales de la aplicación
├── styles/               # Estilos CSS
│   ├── themes.css        # Variables globales de color (paleta)
│   ├── index.css         # Estilos globales generales
│   ├── Auth.css          # Estilos específicos para login/registro
│   ├── Home.css          # Estilos de la página de inicio
│   ├── Perfil.css        # Estilos de la página de perfil
│   ├── Planificador.css  # Estilos del planificador
│   ├── Recetas.css       # Estilos de recetas
│   └── Layout.css        # Estilos del layout general
├── App.jsx               # Define las rutas principales y estructura
├── main.jsx              # Punto de entrada principal
└── ...
```

## 🎨 Paleta de colores

La aplicación utiliza un sistema de **variables CSS** centralizadas en `themes.css` para mantener la coherencia visual:

```css
:root {
  --color-primary: #512DA8;
  --color-secondary: #03A9F4;
  --color-bg: #f9f9f9;
  --color-bg-alt: #fff;
  --color-text: #222;
  --color-link: #512DA8;
  --color-link-hover: #03A9F4;
  --color-border: #e0e0e0;
}
```

## 📝 Funcionalidades principales

✅ Registro y login de usuarios  
✅ Página de inicio con carrusel de imágenes y descripción  
✅ Perfil de usuario con avatar e información  
✅ Planificador semanal para organizar recetas  
✅ Listado de recetas  
✅ Menú lateral y footer fijo para navegación fácil  

## ⚙️ Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/nombreapp.git
   cd nombreapp
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el proyecto:
   ```bash
   npm run dev
   ```

## 🌙 Modo oscuro (opcional)

Si quieres activar el modo oscuro, añade la clase `dark` al `body`:
```html
<body class="dark">
```

## 🧩 Personalización

- Puedes modificar los colores en `themes.css` para adaptarlos a tu marca.
- Los componentes están comentados para facilitar futuras modificaciones.