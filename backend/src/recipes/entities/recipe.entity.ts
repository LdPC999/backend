import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  dificultad!: string;

  @Column()
  tiempoPreparacion!: number;

  @Column({ default: '' })
  imagen!: string;

  @Column({ nullable: true})
  almuerzoCena!: string;

  @ManyToMany(() => Ingredient, { eager: true })
  @JoinTable()
  ingredientes!: Ingredient[];
}
