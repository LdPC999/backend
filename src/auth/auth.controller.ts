import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { admin } from '../firebase/firebase-admin';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const { email, password, nombre, apellidos } = dto;

    if (!email || !password || !nombre || !apellidos) {
      throw new BadRequestException('Faltan campos obligatorios');
    }

    try {
      // 1. Crear en Firebase
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: `${nombre} ${apellidos}`,
      });

      // 2. Guardar en PostgreSQL con rol por defecto
      const newUser = await this.usersService.create({
        email,
        nombre,
        apellidos,
        role: 'user',
        password: '', // Ya está en Firebase
      });

      return {
        message: 'Usuario registrado correctamente en Firebase y PostgreSQL',
        user: newUser,
        firebaseUid: userRecord.uid,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Error al registrar el usuario: ${error.message}`);
      }
      throw new BadRequestException('Error desconocido al registrar el usuario');
    }
  }
}
