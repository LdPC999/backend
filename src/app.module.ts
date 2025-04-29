import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { Ingredient } from './ingredients/schemas/ingredients.schema';

@Module({
  imports: [
    ConfigModule.forRoot(), // Con esto leemos .env para la conexión con Atlas
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    UsersModule,
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
