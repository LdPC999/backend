import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { RecipesModule } from './recipes/recipes.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { Recipe } from './recipes/entities/recipe.entity';
import { Ingredient } from './ingredients/entities/ingredient.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), // para poder leer .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',      
      password: 'LDpc17578',
      database: 'tfgdb',
      entities: [Recipe, Ingredient],
      synchronize: true, // solo en desarrollo
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([Recipe, Ingredient]),

    RecipesModule,
    IngredientsModule,
  ],
})
export class AppModule {}
