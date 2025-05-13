import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';
import { FirebaseAuthGuard } from './auth/firebase-auth.guard'; 
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Para usar variables de entorno
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'LDpc17578',
      database: process.env.DB_NAME || 'tfgdb',
      autoLoadEntities: true,
      synchronize: true,
    }),
    IngredientsModule,
    RecipesModule,
    UsersModule,
  ],
  controllers:[
    AppController,
    AuthController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
