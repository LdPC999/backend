import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // 🔍 Verifica usuario y compara contraseña cifrada
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      console.warn('❌ Usuario no encontrado:', email);
      return null;
    }

    console.log('🔐 Contraseña recibida:', pass);
    console.log('🔐 Hash almacenado:', user.password);

    const passwordMatch = await bcrypt.compare(pass, user.password);

    if (!passwordMatch) {
      console.warn('❌ Contraseña incorrecta para:', email);
      return null;
    }

    console.log('✅ Login exitoso para:', email);
    const { password, ...result } = user;
    return result;
  }

  // 🔑 Genera token JWT
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // 📝 Registro con cifrado
  async register(data: any) {
    const userExists = await this.usersService.findByEmail(data.email);
    if (userExists) throw new UnauthorizedException('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });
    return this.login(newUser);
  }
}
