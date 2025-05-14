import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { admin } from '../firebase/firebase-admin'; 
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta token de autenticación');
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const email = decodedToken.email;

      if (!email){
        throw new UnauthorizedException('Token sin email asociado');
      }

      // Buscamos el usuario por email en la bbdd y su rol
      const user = await this.usersService.findByEmail(email);
      
      if (!user){
        throw new UnauthorizedException('Usuario no encontrado')
      }

      // Agrtegamos el usuario al request para que lo use el RolesGuard
      
      request.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: user.role,
      };

      return true;
    } catch (error){
      console.error('Error de autenticación de Firebase', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
