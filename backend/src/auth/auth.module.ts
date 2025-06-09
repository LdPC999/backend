import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

/**
 * Módulo de autenticación.
 *
 * Este módulo centraliza todos los componentes necesarios para gestionar la autenticación
 * y autorización de usuarios en la aplicación, incluyendo el uso de JWT y Passport.
 */
@Module({
  // imports: Otros módulos necesarios para que funcione el módulo de autenticación.
  imports: [
    UsersModule,     // Módulo de usuarios, necesario para validar y registrar usuarios.
    PassportModule,  // Módulo de Passport, facilita la integración de estrategias de autenticación.
    JwtModule.register({
      // Configuración básica para la firma de tokens JWT.
      secret: 'JWT_SECRET_KEY', // Clave secreta para firmar los JWT (La declaramos como variable de entorno).
      signOptions: { expiresIn: '1h' }, // El token expira en 1 hora.
    }),
  ],
  // providers: Servicios y estrategias que se inyectarán en el módulo.
  providers: [AuthService, JwtStrategy],
  // controllers: Controladores asociados a este módulo.
  controllers: [AuthController],
})
export class AuthModule {}
