// auth.controller.ts

// Importamos los decoradores y excepciones necesarias desde NestJS.
// Controller: Permite declarar la clase como un controlador de rutas.
// Post: Define que un método responde a una petición HTTP POST.
// Body: Permite extraer el body de la petición.
// UnauthorizedException: Excepción que devuelve un error 401 (no autorizado).
import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
// Importamos el servicio de autenticación, que contiene la lógica de negocio.
import { AuthService } from './auth.service';

/**
 * Controlador de autenticación.
 * 
 * Este controlador gestiona las rutas relacionadas con la autenticación de usuarios,
 * como el inicio de sesión (login) y el registro (register).
 */
@Controller('auth') // Ruta base: /auth
export class AuthController {
  /**
   * Constructor de la clase.
   * 
   * Inyecta el servicio de autenticación, permitiendo acceder a su lógica.
   * @param authService Servicio de autenticación (AuthService)
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint para el inicio de sesión de usuarios.
   * 
   * Recibe una petición POST en /auth/login con las credenciales del usuario.
   * Llama al servicio de autenticación para validar las credenciales.
   * Si las credenciales son incorrectas, lanza una excepción 401 (no autorizado).
   * Si las credenciales son válidas, devuelve la información del usuario autenticado y el token correspondiente.
   * 
   * @param body Objeto con las credenciales del usuario: email y password.
   * @returns Objeto con los datos de autenticación (habitualmente, usuario y token JWT).
   */
  @Post('login')
  async login(@Body() body: any) {
    // Valida las credenciales usando el servicio de autenticación.
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      // Si la validación falla, devuelve una excepción 401 con un mensaje personalizado.
      throw new UnauthorizedException('Credenciales inválidas');
    }
    // Si la validación es correcta, genera y retorna el token (y/o info adicional).
    return this.authService.login(user);
  }

  /**
   * Endpoint para el registro de nuevos usuarios.
   * 
   * Recibe una petición POST en /auth/register con los datos del nuevo usuario.
   * Llama al servicio de autenticación para crear el usuario y devolver los datos necesarios.
   * 
   * @param body Objeto con los datos del usuario a registrar (nombre, email, password, etc.).
   * @returns Objeto con los datos del usuario registrado (puede incluir un token, id, etc.).
   */
  @Post('register')
  async register(@Body() body: any) {
    // Registra el nuevo usuario utilizando el servicio de autenticación.
    return this.authService.register(body);
  }
}
