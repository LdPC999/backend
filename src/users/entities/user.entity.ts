import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() // ID autoincremental
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
}