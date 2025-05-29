// users.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Recipe } from '../../recipes/entities/recipe.entity'; // Ajusta la ruta si es necesario

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nombre!: string;

  @Column()
  apellidos!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: 'user' | 'admin';

  @Column('text', { array: true, nullable: true})
  alergenos?: string[];

  // Relación ManyToMany con Recipe para favoritos
  @ManyToMany(() => Recipe, { eager: true })
  @JoinTable()
  favoritos!: Recipe[];
}
