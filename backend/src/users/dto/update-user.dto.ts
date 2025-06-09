// Importamos PartialType para convertir los campos del DTO base en opcionales (útil para PATCH).
import { PartialType } from '@nestjs/mapped-types';
// Importamos el DTO base para reutilizar su estructura y validaciones.
import { CreateUserDto } from './create-user.dto';

/**
 * DTO para la actualización de usuarios.
 * 
 * Hereda de CreateUserDto y convierte todos los campos en opcionales gracias a PartialType.
 * Permite enviar solo los campos que se deseen modificar al actualizar un usuario.
 * 
 * Se añaden explícitamente los campos principales para facilitar la autocompletación
 * y la documentación, pero podrían omitirse si se prefiere delegar en PartialType.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  /**
   * Nombre del usuario (opcional).
   */
  nombre?: string;

  /**
   * Apellidos del usuario (opcional).
   */
  apellidos?: string;

  /**
   * Lista de alérgenos asociados al usuario (opcional).
   */
  alergenos?: string[];

  /**
   * Contraseña nueva del usuario (opcional).
   */
  password?: string;
}
