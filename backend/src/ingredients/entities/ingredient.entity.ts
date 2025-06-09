// Importamos los decoradores necesarios de TypeORM para definir una entidad.
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entidad Ingredient.
 * 
 * Representa la tabla 'ingredients' en la base de datos.
 * Define la estructura y las restricciones de los campos de un ingrediente.
 */
@Entity('ingredients') // Define el nombre de la tabla en la base de datos.
export class Ingredient {
  /**
   * Identificador único y autogenerado para cada ingrediente.
   * Es la clave primaria de la tabla.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Nombre del ingrediente.
   * Debe ser único en la tabla.
   */
  @Column({ unique: true })
  nombre!: string;

  /**
   * Tipo del ingrediente (por ejemplo: "fruta", "carne", "verdura", etc.).
   */
  @Column()
  tipo!: string;

  /**
   * Array de alérgenos asociados al ingrediente.
   * Puede ser nulo (nullable: true). Se almacena como un array de tipo texto en la base de datos.
   */
  @Column('text', { array: true, nullable: true })
  alergeno!: string[];
}
