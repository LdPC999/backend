import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const ingredients = await this.ingredientRepository.findBy({
      id: In(createRecipeDto.ingredientes),
    });

    const recipe = this.recipeRepository.create({
      ...createRecipeDto,
      ingredientes: ingredients,
    });

    return this.recipeRepository.save(recipe);
  }

  findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({ relations: ['ingredientes'] });
  }

  findOne(id: number): Promise<Recipe | null> {
    return this.recipeRepository.findOne({ where: { id }, relations: ['ingredientes'] });
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const recipe = await this.recipeRepository.findOne({ where: { id }, relations: ['ingredientes'] });

    if (!recipe) {
      throw new NotFoundException(`Receta con ID ${id} no encontrada`);
    }

    if (updateRecipeDto.ingredientes) {
      const ingredients = await this.ingredientRepository.findBy({
        id: In(updateRecipeDto.ingredientes),
      });
      recipe.ingredientes = ingredients;
    }

    Object.assign(recipe, updateRecipeDto);

    return this.recipeRepository.save(recipe);
  }

  async remove(id: number): Promise<void> {
    await this.recipeRepository.delete(id);
  }
}
