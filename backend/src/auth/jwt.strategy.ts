// jwt.strategy.ts

// Importamos los decoradores y clases necesarias.
import { Injectable } from '@nestjs/common';
// Importamos el adaptador de estrategia para Passport.
import { PassportStrategy } from '@nestjs/passport';
// Importamos las utilidades y la clase base para JWT.
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Estrategia JWT para autenticación con Passport.
 * 
 * Esta clase define cómo debe ser validado un token JWT dentro de la aplicación.
 * Hereda de PassportStrategy y se integra automáticamente en el sistema de autenticación de NestJS.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructor: configura la estrategia JWT.
   * 
   * Se define cómo se debe extraer el token de la petición (por cabecera Authorization: Bearer)
   * y se establece la clave secreta que debe usarse para validar la firma del token.
   */
  constructor() {
    super({
      // Extrae el JWT desde la cabecera Authorization como un Bearer token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // No ignora la expiración del token; si ha expirado, será inválido.
      ignoreExpiration: false,
      // Clave secreta para validar la firma del JWT.
      // En producción debe ser una variable de entorno segura.
      secretOrKey: 'JWT_SECRET_KEY',
    });
  }

  /**
   * Método de validación del token JWT.
   * 
   * Este método se llama automáticamente cuando un endpoint está protegido por la estrategia JWT.
   * Permite personalizar el objeto usuario que se añade a la request.
   * 
   * @param payload Carga útil extraída del JWT (lo que se firmó al crear el token).
   * @returns Objeto que representa al usuario autenticado (queda disponible en req.user).
   */
  async validate(payload: any) {
    // Puedes añadir lógica adicional para cargar más datos del usuario si es necesario.
    // Por defecto, devuelve algunos campos del payload del JWT.
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
