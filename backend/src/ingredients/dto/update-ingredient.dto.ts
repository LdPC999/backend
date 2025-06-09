// Importamos PartialType desde @nestjs/mapped-types para reutilizar el DTO de creación.
// PartialType transforma todos los campos en opcionales, ideal para actualizaciones parciales (PATCH).
import { PartialType } from '@nestjs/mapped-types';
// Importamos el DTO base de creación.
import { CreateIngredientDto } from './create-ingredient.dto';

/**
 * DTO para la actualización de ingredientes.
 * 
 * Hereda de CreateIngredientDto, pero con todos los campos opcionales gracias a PartialType.
 * Permite enviar solo los campos que se deseen modificar, facilitando actualizaciones parciales.
 */
export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
