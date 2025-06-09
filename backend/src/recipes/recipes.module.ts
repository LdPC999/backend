// Importamos los módulos y decoradores necesarios de NestJS y TypeORM.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Importamos la entidad Recipe y la entidad Ingredient (para relaciones).
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
// Importamos el servicio y el controlador de recetas.
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';

/**
 * Módulo de recetas.
 * 
 * Este módulo agrupa todos los componentes necesarios para la gestión de recetas:
 * entidad de base de datos, servicio de negocio y controlador de rutas.
 * También importa la entidad Ingredient, permitiendo relaciones entre recetas e ingredientes.
 */
@Module({
  // Importa el módulo de TypeORM con las entidades Recipe e Ingredient.
  // Esto habilita el uso de los repositorios de ambas entidades en este módulo.
  imports: [TypeOrmModule.forFeature([Recipe, Ingredient])],
  // Define el controlador principal para este módulo.
  controllers: [RecipesController],
  // Define el servicio de negocio inyectable para este módulo.
  providers: [RecipesService],
})
export class RecipesModule {}
