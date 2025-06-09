// Importamos los decoradores de validación de la librería class-validator.
// Estos decoradores nos permiten asegurar que los datos recibidos cumplen con el formato esperado.
import { IsString, IsOptional, IsArray } from 'class-validator';

/**
 * DTO para la creación de ingredientes.
 * 
 * Esta clase define la estructura y las reglas de validación para los datos necesarios
 * al crear un nuevo ingrediente a través de la API.
 * Utiliza decoradores para garantizar que los datos recibidos cumplen los requisitos.
 */
export class CreateIngredientDto {
  /**
   * Nombre del ingrediente.
   * Debe ser una cadena de texto (string).
   */
  @IsString()
  nombre!: string;

  /**
   * Tipo del ingrediente (por ejemplo: "verdura", "carne", "fruta", etc.).
   * Debe ser una cadena de texto (string).
   */
  @IsString()
  tipo!: string;

  /**
   * Lista opcional de alérgenos asociados al ingrediente.
   * Si se proporciona, debe ser un array de strings.
   * 
   * @IsOptional() Permite que este campo no se envíe en la petición.
   * @IsArray()    Obliga a que, si se envía, sea un array.
   * @IsString({ each: true }) Verifica que cada elemento del array sea un string.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alergeno?: string[];
}
