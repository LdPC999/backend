import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Ingredient, IngredientDocument } from "./schemas/ingredients.schema";
import { CreateIngredientDto } from "./dto/create-ingrtedient.dto";
import { UpdateIngredientDto } from "./dto/update-ingredient.dto";

@Injectable()
export class IngredientsService {
    constructor(@InjectModel(Ingredient.name) private ingredientModel: Model<IngredientDocument>){}

    async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
        const newIngredient = new this.ingredientModel(createIngredientDto);
        return newIngredient.save();
    }

    async findAll(): Promise<Ingredient[]> {
        return this.ingredientModel.find().exec();
    }

    async findOne(id: string): Promise<Ingredient | null> {
        return this.ingredientModel.findById(id).exec();
    }

    async update(id: string, updateIngredientDto: UpdateIngredientDto): Promise<Ingredient | null> {
        return this.ingredientModel.findByIdAndUpdate(id, updateIngredientDto, { new: true }).exec();
    }

    async remove(id: string): Promise<Ingredient | null>{
        return this.ingredientModel.findByIdAndDelete(id).exec();
    }
}