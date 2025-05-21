import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  findAll(): Promise<Ingredient[]> {
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Ingredient | null> {
    return this.ingredientsService.findOne(id);
  }

  @Post()
  create(
    @Body() createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ingredientsService.remove(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, updateDto);
  }
}
