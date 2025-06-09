# 📚 Trabajo de Fin de Grado (TFG): Backend — RECIPE PLANNER

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
   4.2 [Diseño de Datos](#42-diseño-de-datos)

5. **[Implementación](#-5-implementación)**  
   5.1 [Estructura del Proyecto](#51-estructura-del-proyecto)  
   5.2 [Backend (NestJS)](#52-backend-nestjs)

6. **[Pruebas](#6-pruebas)**  
   6.1 [Pruebas en el Backend](#61-pruebas-en-el-backend)

7. **[Conclusiones](#7-conclusiones)**

8. **[Líneas de Investigación Futuras](#8-líneas-de-investigación-futuras)**

9. **[Bibliografía](#10-bibliografía)**

---

## 📌 1.- Introducción

### 1.1.- Origen y motivación

El presente proyecto surge ante la necesidad de disponer de un sistema flexible y seguro para la gestión de recetas, ingredientes y perfiles de usuario con restricciones alimentarias (alérgenos) en entornos domésticos o profesionales.  
La creciente demanda de soluciones personalizadas en la alimentación, la preocupación por las alergias y la organización del menú semanal motivan el desarrollo de una herramienta digital moderna, ampliable y fácil de integrar con aplicaciones móviles y web.

### 1.2.- Instalación y puesta en marcha

A continuación, se detallan los pasos necesarios para clonar y ejecutar el proyecto en local.

#### 🔧 Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (instancia local o remota)
- [Git](https://git-scm.com/)

#### Instalación de dependencias

npm install

#### Configuración de la base de datos

Archivo .env con las variables de entorno para la conexión a PostgreSQL con la siguiente estructura
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
JWT_SECRET_KEY=

#### Ejecución del proyecto

npm run start:dev
El backend queda accesible por defecto en http://localhost:3000

### 1.3.- Metodología

El desarrollo de este proyecto sigue una metodología iterativa basada en buenas prácticas
1.- Análisis del problema: Identificación de requerimientos y análisis de soluciones ya existentes.
2.- Diseño modular: Separación en módulos independientes.
3.- Desarrollo incremental: Programación, pruebas y refactorización constante.
4.- Validación: Pruebas manuales y unitarias para asegurar que los requisitos se cumplen.
5.- Documentación: Comentado del código con detalle.

## 🧠 2.- Estado del Arte / Marco teórico

Cada vez llevamos un estilo de vida más desordenado, con jornadas de trabajo largas y se le dedica menor tiempo a la alimentación, o más concretamente, a la planificación de la alimentación.
Existen multitud de plataformas dedicadas a buscar recetas, crearnos una biblioteca con nuestros favoritos, como pueden ser "Cookpad", "Yummly" o "Nooddle" que ya ofrecen amplios catálogos pero he observado una falta de personalización en lo que respecta al tema de alérgenos o a poder generar menús o plannings pudiendo filtrar a la medida del usuario.

En cuanto a tecnologías, siguiendo la tendencia actual he optado por NestJS, al ser uno de los frameworks más utilizados para Node.js por su integración con sistemas ORM como TypeORM y bases de datos relacionales como PostgreSQL.

Para la autenticación, aunque la primera opción fue utilizar Firebase Auth de Google, debido a la mejor adaptación a las distintas versiones tanto de Node como de React, finalmente he utilizado JWT, con implementación de roles y validaciones automáticas mediante DTOs para la seguridad y calidad del software.

## 📋 3.- Requisitos

### 3.1.- Requisitos funcionales

- RF1: Permitir el registro y autenticación de usuarios.
- RF2: Gestión de roles de usuario ('user' y 'admin') para la autorización de acciones.
- RF3: CRUD de recetas: Incluyendo imagen, dificultad, tiempo de preparación y tipo (comida o cena).
- RF4: CRUD de ingredientes: Gestionando alérgenos asociados y filtro por tipo.
- RF5: Posibiliddad de marcar las recetas como favoritas por el usuario.
- RF6: Filtros avanzados en la búsqueda de recetas (ingrediente, tipo, alérgeno, etc).
- RF7: Edición de perfil: Modificación de datos básicos de usuario y preferencias o alérgenos.
- RF8: Gestión de alérgenos y tipos de ingredientes.
- RF9: Protección de rutas mediante autenticación JWT.

### 3.2.- Requisitos no funcionales

- RNF1: Persistencia en base de datos relacional (PostgreSQL).
- RNF2: Contraseñas cifradas para mayor seguridad (bcrypt).
- RNF3: API RESTfil estructurada, documentada y segura.
- RNF4: Modularidad y separación entre dominios.
- RNF5: Configuración de CORS y gestión de variables de entorno.
- RNF6: Facilidad de despliegue y migración.

## 🧱 4.- Diseño

### 4.1.- Arquitectura General

El backend está estructurado de forma modular, siguiendo el patrón del modelo vista-controlador.
Cada dominio principal dispone de su propio módulo (usuarios, recetas, ingredientes, autenticación, alérgenos), facilitando así la escalabilidad y el mantenimiento de la aplicación.

graph TD
Frontend[Frontend (React/Next.js)]
API[API REST (NestJS)]
DB[(PostgreSQL)]
Frontend --> |HTTP| API
API --> DB

### 4.2.- Diseño de datos

Las entidades principales son las siguiente:
Usuario : User -> id(PK), nombre, apellidos, email(único), password(hash), role('user'|'admin'), alérgenos(array), favoritos.

Recetas : Recipe -> id(PK), nombre, dificultad, tiempoPreparacion, imagen, almuerzoCena, ingredientes(array de objetos).

Ingredientes : Ingredient -> id(PK), nombre(único), tipo, alergenos(array).

Ejemplo de entidad Receta (TypeORM)
@Entity()
export class Recipe {
@PrimaryGeneratedColumn()
id!: number;

@Column()
nombre!: string;

@Column()
dificultad!: string;

@Column()
tiempoPreparacion!: number;

@Column({ default: '' })
imagen!: string;

@Column({ nullable: true })
almuerzoCena!: string;

@ManyToMany(() => Ingredient, { eager: true })
@JoinTable()
ingredientes!: Ingredient[];
}

## 💻 5.- Implementación

### 5.1.- Estructura del proyecto

src/
 ├── app.controller.ts
 ├── app.module.ts
 ├── main.ts
 ├── auth/
 ├── users/
 ├── recipes/
 ├── ingredients/
 └── alergenos/

 - auth/: Gestión de autenticación y autorización, JWT, registro y login.
 - users/: Gestión de usuarios, edición de perfil, favoritos y roles.
 - recipes/: Gestión y filtrado de recetas.
 - ingredients/: CRUD de ingredientes, tipos y alérgenos.
 - alergenos/: consulta de lista de alérgenos reconocidos.

 ### 5.2.- Backend (NestJS)

 - Desarrollado en TypeScript usando NestJS.
 - Integración con TypeORM para persistencia en PostgreSQL.
 - Uso de DTOs para validación de datos.
 - Contraseñas cifradas con bcrypt.
 - Protección de rutas sensibles mediante JWT y guards personalizados.
 - Configuración flexible mediante variables de entorno.

 ## 🧪 6.- Pruebas

 ### 6.1.- Pruebas en el backend.

 Durante el desarrollo se han realizado pruebas manuales y unitarias utilizando las siguientes herramientas:
 - Postman: Para validar todos los endpoints y verificar la protección de las rutas.
 - Pruebas de integración: Validación de relaciones entre entidades y persistencia.
 - Inspección directa de la base de datos mediante PGAdmin.

 ## 7.- Conclusiones

 El backend desarrollado para esta aplicación ofrece una buena base para la gestión y organización automática de menús semanales, además de ofrecer suficiente capacidad de personalización en cuanto a usuario o gestión de recetas.
 La utilización de NestJS y TypeORM con PostgreSQL permite que la integración con frontends sea más sencilla y asegura la mantenibilidad y escalabilidad.
 La arquitectura propuesta permite ampliaciones a futuro como la gestión mensual, integración en aplicaciones móviles o nuevos filtros para personalizar dietas.

 ## 8.- Líneas de investigación futuras

 - Integración con aplicaciones móviles.
 - Nuevos filtros para las recetas (aporte calórico, proteínas, hidratos de carbono, etc.).
 - Notificaciones por email.
 - Apartado de settings para adaptabilidad a modo claro/oscuro y multilenguaje.
 - Mejora del panel de administración -> Evolución a dashboard avanzado.


 ## 9.- Bibliografía

 - NestJS documentation
 - TypeORM documentation
 - MoureDev
 - MiduDev
 - OpenAI
 - OpenWebinars