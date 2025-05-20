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

  // Crear receta con ingredientes relacionados (por ID)
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

  // Obtener todas las recetas con ingredientes
  findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({ relations: ['ingredientes'] });
  }

  // Obtener una receta por ID
  findOne(id: number): Promise<Recipe | null> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredientes'],
    });
  }

  // Actualizar receta por ID
  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const receta = await this.recipeRepository.findOneBy({ id });
    if (!receta) throw new NotFoundException('Receta no encontrada');

    if (updateRecipeDto.ingredientes) {
      const ingredientes = await this.ingredientRepository.findBy({
        id: In(updateRecipeDto.ingredientes),
      });
      receta.ingredientes = ingredientes;
    }

    Object.assign(receta, updateRecipeDto);
    return this.recipeRepository.save(receta);
  }

  // Eliminar receta
  async remove(id: number): Promise<void> {
    await this.recipeRepository.delete(id);
  }
}
