// Importamos módulos y utilidades principales de NestJS.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Importamos los módulos funcionales de la aplicación.
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
// Importamos el controlador y servicio principal.
import { AppController } from './app.controller';
import { AppService } from './app.service';
// Importamos el módulo de autenticación.
import { AuthModule } from './auth/auth.module';
// Importamos el controlador de alérgenos.
import { AlergenosController } from './alergenos/alergenos.controller';
// Importamos el controlador de imágenes
import { UploadController } from './upload/upload.controller';

/**
 * Módulo raíz de la aplicación.
 *
 * Aquí se centralizan y configuran todos los módulos, controladores y proveedores de la app.
 * Es el punto de entrada principal y el lugar donde se configura la base de datos, módulos, controladores, etc.
 */
@Module({
  imports: [
    // Carga las variables de entorno (.env) en toda la app.
    ConfigModule.forRoot({ isGlobal: true }),

    // Configura y conecta la base de datos PostgreSQL usando variables de entorno.
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST || process.env.DB_HOST_LOCAL,
            port: Number(process.env.DB_PORT) || Number(process.env.DB_PORT_LOCAL) ,
            username: process.env.DB_USERNAME || process.env.DB_USER_LOCAL,
            password: process.env.DB_PASSWORD || process.env.DB_PASS_LOCAL,
            database: process.env.DB_NAME || process.env.DB_NAME_LOCAL,
          }),
      autoLoadEntities: true, // Carga automática de entidades
      synchronize: true,
    }),

    // Importa los módulos de cada dominio de la app.
    IngredientsModule,
    RecipesModule,
    UsersModule,
    AuthModule,
  ],
  // Controladores principales del módulo raíz.
  controllers: [AppController, AlergenosController, UploadController],
  // Proveedores (servicios) principales.
  providers: [AppService],
})
export class AppModule {}
