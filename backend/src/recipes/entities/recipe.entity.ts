// Importamos los decoradores y utilidades de TypeORM para definir la entidad y sus relaciones.
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
// Importamos la entidad Ingredient para establecer la relación.
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

/**
 * Entidad Recipe.
 * 
 * Representa la tabla de recetas en la base de datos y define la estructura,
 * tipos y relaciones de los campos de una receta.
 */
@Entity() // Por defecto, el nombre de la tabla será 'recipe'
export class Recipe {
  /**
   * Identificador único, autogenerado, clave primaria de la receta.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Nombre de la receta.
   */
  @Column()
  nombre!: string;

  /**
   * Dificultad de la receta (por ejemplo: "fácil", "media", "difícil").
   */
  @Column()
  dificultad!: string;

  /**
   * Tiempo de preparación de la receta, en minutos.
   */
  @Column()
  tiempoPreparacion!: number;

  /**
   * URL o ruta de la imagen de la receta.
   * Si no se proporciona, se almacena como cadena vacía por defecto.
   */
  @Column({ default: '' })
  imagen!: string;

  /**
   * Indica si la receta es para almuerzo o cena.
   * Es un campo opcional (nullable).
   */
  @Column({ nullable: true })
  almuerzoCena!: string;

  /**
   * Relación muchos a muchos con ingredientes.
   * 
   * - Una receta puede tener varios ingredientes.
   * - Un ingrediente puede estar en varias recetas.
   * 
   * La opción { eager: true } hace que los ingredientes se carguen automáticamente al consultar recetas.
   * @JoinTable() indica que esta entidad gestiona la tabla intermedia de la relación.
   */
  @ManyToMany(() => Ingredient, { eager: true })
  @JoinTable()
  ingredientes!: Ingredient[];
}
