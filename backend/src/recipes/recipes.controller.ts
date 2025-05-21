import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll(
    @Query('ingrediente') ingredienteNombre?: string,
    @Query('ingredienteId') ingredienteId?: number,
    @Query('sinIngrediente') sinIngrediente?: string,
    @Query('tipo') tipo?: string,
    @Query('sinTipo') sinTipo?: string,
    @Query('sinAlergeno') sinAlergeno?: string,
  ) {
    return this.recipesService.findAllWithFilters(
      ingredienteNombre,
      ingredienteId,
      sinIngrediente,
      tipo,
      sinTipo,
      sinAlergeno,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.remove(id);
  }
}
