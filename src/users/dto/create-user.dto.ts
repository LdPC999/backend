export class CreateUserDto {
  nombre!: string;
  apellidos!: string;
  email!: string;
  password?: string;
  role?: 'user' | 'admin'; 
  alergenos?: string[];
}
