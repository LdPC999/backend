/**
 * DTO para la creación de usuarios.
 * 
 * Define la estructura de los datos requeridos al crear un nuevo usuario.
 * Es recomendable añadir validaciones usando decoradores de class-validator para
 * asegurar la integridad de los datos recibidos.
 */
export class CreateUserDto {
  /**
   * Nombre del usuario.
   * Obligatorio.
   */
  nombre!: string;

  /**
   * Apellidos del usuario.
   * Obligatorio.
   */
  apellidos!: string;

  /**
   * Correo electrónico del usuario.
   * Obligatorio.
   */
  email!: string;

  /**
   * Contraseña del usuario.
   * Obligatorio.
   * Se recomienda almacenar siempre la contraseña cifrada y nunca en texto plano.
   */
  password!: string;

  /**
   * Rol del usuario ('user' por defecto o 'admin').
   * Opcional. Si no se especifica, se puede asignar 'user' por defecto en la lógica de negocio.
   */
  role?: 'user' | 'admin';

  /**
   * Lista de alérgenos asociados al usuario.
   * Opcional. Permite almacenar las intolerancias o alergias alimentarias del usuario.
   */
  alergenos?: string[];
}
