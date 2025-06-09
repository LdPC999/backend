// Importamos decoradores y módulos de NestJS y TypeORM.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Importamos el servicio, el controlador y las entidades necesarias.
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { Recipe } from '../recipes/entities/recipe.entity';

/**
 * Módulo de usuarios.
 * 
 * Este módulo agrupa todos los componentes relacionados con la gestión de usuarios,
 * incluyendo la entidad de usuario, el servicio, el controlador y la entidad de recetas
 * (para gestionar la relación de favoritos).
 */
@Module({
  // Importa el módulo de TypeORM con las entidades User y Recipe,
  // permitiendo la inyección de sus repositorios en el servicio.
  imports: [TypeOrmModule.forFeature([User, Recipe])],
  // Define el controlador principal para este módulo.
  controllers: [UsersController],
  // Define el servicio de negocio inyectable para este módulo.
  providers: [UsersService],
  // Exporta el servicio para que pueda ser utilizado en otros módulos si es necesario.
  exports: [UsersService],
})
export class UsersModule {}
