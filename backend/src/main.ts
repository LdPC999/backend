// main.ts

// Importa el soporte para decoradores y metadatos, necesario para TypeORM y NestJS.
import 'reflect-metadata';
// Importa el factory de NestJS para crear la aplicación.
import { NestFactory } from '@nestjs/core';
// Importa el módulo raíz de la aplicación.
import { AppModule } from './app.module';

/**
 * Función principal de arranque de la aplicación.
 *
 * Crea la instancia de la app NestJS, habilita CORS para permitir peticiones desde el frontend,
 * y levanta el servidor en el puerto y dirección especificados.
 */
async function bootstrap() {
  // Crea la aplicación NestJS usando el módulo raíz.
  const app = await NestFactory.create(AppModule);

  // Configura CORS para permitir solicitudes del frontend en local o en red local.
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permite envío de cookies/autenticación entre frontend y backend
  });

  // Inicia el servidor en el puerto 3000 y en todas las interfaces de red disponibles.
  await app.listen(process.env.PORT || 3000);
}

// Ejecuta la función de arranque.
bootstrap();
