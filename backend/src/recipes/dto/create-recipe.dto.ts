// Importamos los decoradores de validación de class-validator.
// Estos decoradores permiten validar automáticamente los datos recibidos en la petición.
import { IsString, IsNumber, IsOptional, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

/**
 * DTO para la creación de recetas.
 * 
 * Define la estructura y reglas de validación para los datos necesarios al crear una nueva receta.
 * Utiliza decoradores para garantizar la integridad y el formato correcto de los datos recibidos.
 */
export class CreateRecipeDto {
  /**
   * Nombre de la receta.
   * Obligatorio y debe ser una cadena de texto.
   */
  @IsString()
  nombre!: string;

  /**
   * Dificultad de la receta (por ejemplo: "fácil", "media", "difícil").
   * Obligatorio y debe ser una cadena de texto.
   */
  @IsString()
  dificultad!: string;

  /**
   * Tiempo de preparación en minutos.
   * Obligatorio y debe ser un número.
   */
  @IsNumber()
  tiempoPreparacion!: number;

  /**
   * URL o ruta de la imagen de la receta.
   * Opcional y debe ser una cadena de texto si se proporciona.
   */
  @IsOptional()
  @IsString()
  imagen?: string;

  /**
   * Indica si la receta es para almuerzo o cena.
   * Opcional y debe ser una cadena de texto si se proporciona.
   */
  @IsOptional()
  @IsString()
  almuerzoCena!: string;

  /**
   * Lista de identificadores (IDs) de ingredientes asociados a la receta.
   * Obligatorio, debe ser un array no vacío y cada elemento debe ser un número entero.
   * 
   * @IsArray()         Verifica que sea un array.
   * @ArrayNotEmpty()   El array no puede estar vacío.
   * @IsInt({each:true}) Cada elemento debe ser entero (ID de ingrediente).
   */
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // asegura que cada elemento del array sea un número entero
  ingredientes!: number[]; // IDs de ingredientes
}
