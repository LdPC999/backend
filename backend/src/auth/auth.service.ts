// auth.service.ts

// Importamos decoradores y excepciones de NestJS.
import { Injectable, UnauthorizedException } from '@nestjs/common';
// Importamos el servicio JWT para generar y firmar tokens.
import { JwtService } from '@nestjs/jwt';
// Importamos bcrypt para comparar y encriptar contraseñas.
import * as bcrypt from 'bcrypt';
// Importamos el servicio de usuarios, que gestiona la lógica relacionada con usuarios.
import { UsersService } from '../users/users.service';

/**
 * Servicio de autenticación.
 * 
 * Este servicio gestiona la lógica principal relacionada con la autenticación de usuarios,
 * incluyendo validación de credenciales, generación de tokens y registro de nuevos usuarios.
 */
@Injectable()
export class AuthService {
  /**
   * Constructor que inyecta los servicios necesarios.
   * 
   * @param usersService Servicio para interactuar con los usuarios.
   * @param jwtService Servicio para generar y verificar tokens JWT.
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida el usuario a partir de su email y contraseña.
   * 
   * Busca el usuario por email, y si existe, compara la contraseña proporcionada (en texto plano)
   * con el hash almacenado en la base de datos usando bcrypt.
   * 
   * @param email Correo electrónico del usuario.
   * @param pass Contraseña proporcionada por el usuario (texto plano).
   * @returns El usuario sin la contraseña si es válido, o null si la autenticación falla.
   */
  async validateUser(email: string, pass: string): Promise<any> {
    // Busca el usuario por email.
    const user = await this.usersService.findByEmail(email);

    // Si no existe el usuario, devuelve null.
    if (!user) {
      console.warn('❌ Usuario no encontrado:', email);
      return null;
    }

    // Imprime la contraseña recibida y el hash almacenado (para depuración).
    console.log('🔐 Contraseña recibida:', pass);
    console.log('🔐 Hash almacenado:', user.password);

    // Compara la contraseña ingresada con el hash usando bcrypt.
    const passwordMatch = await bcrypt.compare(pass, user.password);

    // Si la contraseña no coincide, devuelve null.
    if (!passwordMatch) {
      console.warn('❌ Contraseña incorrecta para:', email);
      return null;
    }

    // Si la autenticación es exitosa, elimina la contraseña del objeto usuario antes de devolverlo.
    console.log('✅ Login exitoso para:', email);
    const { password, ...result } = user;
    return result;
  }

  /**
   * Genera un token JWT para un usuario autenticado.
   * 
   * El token incluye información relevante del usuario, como el email, el id y el rol.
   * 
   * @param user Objeto de usuario autenticado (sin contraseña).
   * @returns Un objeto con el access_token JWT.
   */
  async login(user: any) {
    // El payload contiene información que se incluirá en el token.
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registra un nuevo usuario.
   * 
   * Verifica si el usuario ya existe por email. Si no existe, cifra la contraseña con bcrypt
   * y crea el usuario usando el servicio de usuarios. Finalmente, retorna un token JWT para el nuevo usuario.
   * 
   * @param data Objeto con los datos del usuario a registrar (incluye la contraseña en texto plano).
   * @returns Objeto con el token de acceso JWT para el nuevo usuario.
   * @throws UnauthorizedException si el usuario ya existe.
   */
  async register(data: any) {
    // Verifica si el usuario ya existe por email.
    const userExists = await this.usersService.findByEmail(data.email);
    if (userExists) throw new UnauthorizedException('El usuario ya existe');

    // Cifra la contraseña usando bcrypt (salt rounds: 10).
    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Crea el nuevo usuario con la contraseña cifrada.
    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });
    // Retorna el resultado del login para el usuario recién registrado.
    return this.login(newUser);
  }
}
