// Importamos PartialType desde @nestjs/mapped-types para reutilizar el DTO de creación.
// PartialType convierte todos los campos del DTO base en opcionales, ideal para actualizaciones parciales.
import { PartialType } from '@nestjs/mapped-types';
// Importamos el DTO base de creación de recetas.
import { CreateRecipeDto } from './create-recipe.dto';

/**
 * DTO para la actualización de recetas.
 * 
 * Este DTO hereda de CreateRecipeDto, pero con todos los campos marcados como opcionales gracias a PartialType.
 * Permite enviar solo los campos que se desean modificar al actualizar una receta,
 * lo que es ideal para operaciones PATCH.
 */
export class UpdateRecipeDto extends PartialType(CreateRecipeDto) {}
