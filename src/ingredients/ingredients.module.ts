import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IngredientsService } from "./ingredients.service";
import { IngredientsController } from "./ingredients.controller";
import { Ingredient, IngredientSchema } from './schemas/ingredients.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Ingredient.name, schema: IngredientSchema}])],
    controllers: [IngredientsController],
    providers: [IngredientsService]
})

export class IngredientsModule {}