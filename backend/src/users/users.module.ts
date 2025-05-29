import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/users.entity';
import { Recipe } from '../recipes/entities/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Recipe])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Para usarlo en otros módulos
})
export class UsersModule {}