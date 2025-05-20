import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    Object.assign(user, dto);
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
}
