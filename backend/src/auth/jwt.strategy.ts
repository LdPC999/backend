import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET_KEY', // usa variables de entorno en producción
    });
  }

  async validate(payload: any) {
    // Aquí se puede añadir lógica extra
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
