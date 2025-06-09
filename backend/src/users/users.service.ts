// Importamos decoradores y utilidades de NestJS y TypeORM.
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Importamos entidades y DTOs necesarios.
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Recipe } from '../recipes/entities/recipe.entity';

/**
 * Servicio de usuarios.
 * 
 * Contiene la lógica de negocio para la gestión de usuarios:
 * CRUD, autenticación, favoritos y gestión de roles.
 */
@Injectable()
export class UsersService {
  /**
   * Inyección de los repositorios de usuario y receta.
   * 
   * @param userRepository Repositorio de usuarios.
   * @param recipeRepository Repositorio de recetas.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  /**
   * Obtiene todos los usuarios de la base de datos.
   * 
   * @returns Promesa con un array de usuarios.
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Busca un usuario por su ID.
   * 
   * @param id Identificador del usuario.
   * @returns Promesa con el usuario encontrado o null.
   */
  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * Crea un nuevo usuario de forma manual (por ejemplo, desde un script de seed).
   * 
   * @param dto Datos para crear el usuario.
   * @returns Promesa con el usuario creado.
   */
  async create(dto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(dto);
    return this.userRepository.save(newUser);
  }

  /**
   * Actualiza los datos de un usuario existente.
   * 
   * Si se actualiza la contraseña, la cifra antes de guardarla.
   * 
   * @param id ID del usuario a actualizar.
   * @param dto Datos de actualización.
   * @returns Promesa con el usuario actualizado.
   * @throws Error si el usuario no existe.
   */
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error('Usuario no encontrado');

    // Si hay una nueva contraseña, cifrarla antes de guardar.
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    // Actualizar campos básicos si se envían.
    if (dto.nombre !== undefined) user.nombre = dto.nombre;
    if (dto.apellidos !== undefined) user.apellidos = dto.apellidos;
    if (dto.alergenos !== undefined) user.alergenos = dto.alergenos;

    return this.userRepository.save(user);
  }

  /**
   * Elimina un usuario por su ID.
   * 
   * @param id Identificador del usuario a eliminar.
   * @returns Promesa que resuelve a void.
   */
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  /**
   * Registra un nuevo usuario desde el formulario, asegurando que no exista duplicidad por email.
   * 
   * @param dto Datos de registro.
   * @returns Promesa con el usuario registrado.
   * @throws Error si ya existe el usuario.
   */
  async register(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOneBy({ email: dto.email });
    if (existing) throw new Error('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  /**
   * Busca un usuario por su correo electrónico.
   * 
   * @param email Email del usuario.
   * @returns Promesa con el usuario encontrado o null.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /**
   * Realiza el login con email y contraseña.
   * 
   * @param credentials Objeto con email y contraseña.
   * @returns Objeto con mensaje y datos básicos del usuario.
   * @throws Error si el usuario no existe o la contraseña es incorrecta.
   */
  async loginWithCredentials(credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new Error('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Contraseña incorrecta');

    // Devuelve solo información básica del usuario
    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        apellidos: user.apellidos,
        role: user.role,
      },
    };
  }

  /**
   * Asigna el rol 'admin' a un usuario por email.
   * 
   * @param email Email del usuario.
   * @returns Promesa con el usuario actualizado.
   * @throws NotFoundException si no se encuentra el usuario.
   */
  async giveAdminRole(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    user.role = 'admin';
    return this.userRepository.save(user);
  }

  /**
   * Añade una receta a la lista de favoritos del usuario.
   * 
   * @param userId ID del usuario.
   * @param recipeId ID de la receta.
   * @returns Promesa con el usuario actualizado.
   * @throws NotFoundException si el usuario o receta no existen.
   */
  async addFavorito(userId: number, recipeId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoritos'],
    });
    const receta = await this.recipeRepository.findOneBy({ id: recipeId });
    if (!user || !receta) throw new NotFoundException();
    if (!user.favoritos.some((r) => r.id === receta.id))
      user.favoritos.push(receta);
    return this.userRepository.save(user);
  }

  /**
   * Elimina una receta de la lista de favoritos del usuario.
   * 
   * @param userId ID del usuario.
   * @param recipeId ID de la receta.
   * @returns Promesa con el usuario actualizado.
   * @throws NotFoundException si el usuario no existe.
   */
  async removeFavorito(userId: number, recipeId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoritos'],
    });
    if (!user) throw new NotFoundException();
    user.favoritos = user.favoritos.filter((r) => r.id !== recipeId);
    return this.userRepository.save(user);
  }

  /**
   * Obtiene la lista de recetas favoritas de un usuario.
   * 
   * @param userId ID del usuario.
   * @returns Promesa con un array de recetas favoritas.
   * @throws NotFoundException si el usuario no existe.
   */
  async getFavoritos(userId: number): Promise<Recipe[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoritos'],
    });
    if (!user) throw new NotFoundException();
    return user.favoritos;
  }
}
