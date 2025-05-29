import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Recipe } from '../recipes/entities/recipe.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) {}

  // 📋 Obtener todos los usuarios
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // 🔍 Buscar un usuario por su ID
  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  // ➕ Crear un nuevo usuario manualmente (por ejemplo desde un seed)
  async create(dto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(dto);
    return this.userRepository.save(newUser);
  }

  // ✏️ Actualizar los datos de un usuario existente
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new Error('Usuario no encontrado');

    // Si viene password, hashearla antes de guardar
    if (dto.password) {
      user.password = await bcrypt.hash(dto.password, 10);
    }

    // Actualizar el resto de campos (excepto password)
    if (dto.nombre !== undefined) user.nombre = dto.nombre;
    if (dto.apellidos !== undefined) user.apellidos = dto.apellidos;
    if (dto.alergenos !== undefined) user.alergenos = dto.alergenos;

    return this.userRepository.save(user);
  }

  // ❌ Eliminar un usuario por su ID
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  // 📝 Registrar un nuevo usuario desde el formulario
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

  // 🔎 Buscar usuario por su correo electrónico
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // 🔐 Iniciar sesión con email y contraseña
  async loginWithCredentials(credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new Error('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Contraseña incorrecta');

    // Se retorna solo la información básica del usuario
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

  async giveAdminRole(email: string): Promise<User> {
    // Busca el usuario por email
    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    // Cambia el rol
    user.role = 'admin'; // O como definas el campo en tu base de datos
    return this.userRepository.save(user);
  }
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

  // Quitar receta de favoritos
  async removeFavorito(userId: number, recipeId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoritos'],
    });
    if (!user) throw new NotFoundException();
    user.favoritos = user.favoritos.filter((r) => r.id !== recipeId);
    return this.userRepository.save(user);
  }

  // Obtener favoritos de un usuario
  async getFavoritos(userId: number): Promise<Recipe[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoritos'],
    });
    if (!user) throw new NotFoundException();
    return user.favoritos;
  }
}
