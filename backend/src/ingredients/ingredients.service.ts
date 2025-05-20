import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
  ) {}

  // Obtener todos los ingredientes
  findAll(): Promise<Ingredient[]> {
    return this.ingredientRepo.find();
  }

  // Obtener un solo ingrediente por ID
  findOne(id: number): Promise<Ingredient | null> {
    return this.ingredientRepo.findOneBy({ id });
  }

  // Crear un nuevo ingrediente desde el DTO
  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const newIngredient = this.ingredientRepo.create(createIngredientDto);
    return this.ingredientRepo.save(newIngredient);
  }

  // Eliminar ingrediente por ID
  async remove(id: number): Promise<void> {
    await this.ingredientRepo.delete(id);
  }
}
