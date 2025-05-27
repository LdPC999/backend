import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IngredientsModule } from './ingredients/ingredients.module';
import { RecipesModule } from './recipes/recipes.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AlergenosController } from './alergenos/alergenos.controller';

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
    AuthModule,
  ],
  controllers:[
    AppController,
    AlergenosController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
