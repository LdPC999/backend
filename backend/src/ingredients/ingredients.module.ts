// ingredients.module.ts

// Importamos los decoradores y módulos necesarios.
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Importamos la entidad, el servicio y el controlador relacionados con ingredientes.
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';

/**
 * Módulo de ingredientes.
 * 
 * Este módulo agrupa todos los componentes necesarios para la gestión de ingredientes,
 * incluyendo la entidad de base de datos, el servicio de negocio y el controlador de rutas.
 * 
 * Usar módulos en NestJS mejora la organización y escalabilidad del proyecto,
 * permitiendo una clara separación de responsabilidades.
 */
@Module({
  // Importa el módulo de TypeORM con la entidad Ingredient,
  // permitiendo que el servicio acceda a la base de datos para esta entidad.
  imports: [TypeOrmModule.forFeature([Ingredient])],
  // Define el controlador principal para este módulo.
  controllers: [IngredientsController],
  // Define el servicio de negocio inyectable para este módulo.
  providers: [IngredientsService],
})
export class IngredientsModule {}
