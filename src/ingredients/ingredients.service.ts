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

  findAll(): Promise<Ingredient[]> {
    return this.ingredientRepo.find();
  }

  findOne(id: number): Promise<Ingredient | null> {
    return this.ingredientRepo.findOneBy({ id });
  }

  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    const newIngredient = this.ingredientRepo.create(createIngredientDto);
    return this.ingredientRepo.save(newIngredient);
  }

  async remove(id: number): Promise<void> {
    await this.ingredientRepo.delete(id);
  }
}
