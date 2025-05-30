// user.entity.ts

// Importamos decoradores de TypeORM para definir la entidad y sus relaciones.
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
// Importamos la entidad Recipe para establecer la relación de favoritos.
import { Recipe } from '../../recipes/entities/recipe.entity'; // Ajusta la ruta si es necesario

/**
 * Entidad User.
 * 
 * Representa la tabla de usuarios en la base de datos y define la estructura,
 * restricciones y relaciones de los campos de un usuario.
 */
@Entity() // Por defecto, el nombre de la tabla será 'user'
export class User {
  /**
   * Identificador único, autogenerado, clave primaria del usuario.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Nombre del usuario.
   */
  @Column()
  nombre!: string;

  /**
   * Apellidos del usuario.
   */
  @Column()
  apellidos!: string;

  /**
   * Correo electrónico del usuario.
   * Debe ser único en la base de datos.
   */
  @Column({ unique: true })
  email!: string;

  /**
   * Contraseña del usuario (debe almacenarse cifrada).
   */
  @Column()
  password!: string;

  /**
   * Rol del usuario.
   * Puede ser 'user' o 'admin'. Por defecto, 'user'.
   */
  @Column({ default: 'user' })
  role!: 'user' | 'admin';

  /**
   * Lista de alérgenos asociados al usuario.
   * Puede ser nula si el usuario no ha indicado alérgenos.
   * Se almacena como un array de texto.
   */
  @Column('text', { array: true, nullable: true})
  alergenos?: string[];

  /**
   * Relación muchos a muchos con recetas para marcar favoritos.
   * 
   * - Un usuario puede tener varias recetas favoritas.
   * - Una receta puede ser favorita de varios usuarios.
   * 
   * @ManyToMany establece la relación.
   * @JoinTable indica que la tabla intermedia es gestionada por esta entidad.
   * 
   * { eager: true } hace que se carguen automáticamente los favoritos al consultar el usuario.
   */
  @ManyToMany(() => Recipe, { eager: true })
  @JoinTable()
  favoritos!: Recipe[];
}
