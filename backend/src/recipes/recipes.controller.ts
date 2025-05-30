// recipes.controller.ts

// Importamos decoradores y utilidades de NestJS para crear el controlador y manejar rutas y parámetros.
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
// Importamos el servicio que contiene la lógica de negocio de recetas.
import { RecipesService } from './recipes.service';
// Importamos los DTOs de creación y actualización de recetas.
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

/**
 * Controlador de recetas.
 * 
 * Expone rutas RESTful para gestionar recetas en la aplicación.
 * Permite crear, consultar, actualizar y eliminar recetas,
 * así como aplicar filtros avanzados al listar recetas.
 */
@Controller('recipes') // Ruta base: /recipes
export class RecipesController {
  /**
   * Inyecta el servicio de recetas.
   * 
   * @param recipesService Servicio que contiene la lógica de negocio de recetas.
   */
  constructor(private readonly recipesService: RecipesService) {}

  /**
   * Crea una nueva receta.
   * 
   * Ruta: POST /recipes
   * Recibe los datos validados a través del DTO de creación.
   * 
   * @param createRecipeDto Datos para crear la receta.
   * @returns Promesa con la receta creada.
   */
  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(createRecipeDto);
  }

  /**
   * Obtiene la lista de recetas, con posibilidad de aplicar filtros por query params.
   * 
   * Ruta: GET /recipes
   * Se pueden aplicar filtros por nombre de ingrediente, id de ingrediente, tipo, alérgeno, etc.
   * 
   * @param ingredienteNombre Nombre de ingrediente (filtro).
   * @param ingredienteId ID de ingrediente (filtro).
   * @param sinIngrediente Ingrediente que NO debe contener la receta.
   * @param tipo Tipo de receta (filtro).
   * @param sinTipo Tipo de receta que NO debe ser.
   * @param sinAlergeno Alérgeno que NO debe contener la receta.
   * @param almuerzoCena Filtra por si la receta es de almuerzo o cena.
   * @returns Promesa con el array de recetas que cumplen los filtros.
   */
  @Get()
  findAll(
    @Query('ingrediente') ingredienteNombre?: string,
    @Query('ingredienteId') ingredienteId?: number,
    @Query('sinIngrediente') sinIngrediente?: string,
    @Query('tipo') tipo?: string,
    @Query('sinTipo') sinTipo?: string,
    @Query('sinAlergeno') sinAlergeno?: string,
    @Query('almuerzoCena') almuerzoCena?: string,
  ) {
    return this.recipesService.findAllWithFilters(
      ingredienteNombre,
      ingredienteId,
      sinIngrediente,
      tipo,
      sinTipo,
      sinAlergeno,
      almuerzoCena,
    );
  }

  /**
   * Obtiene una receta específica por su id.
   * 
   * Ruta: GET /recipes/:id
   * 
   * @param id Identificador numérico de la receta.
   * @returns Promesa con la receta encontrada o null si no existe.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.findOne(id);
  }

  /**
   * Actualiza parcialmente una receta existente.
   * 
   * Ruta: PATCH /recipes/:id
   * Recibe los datos validados a través del DTO de actualización.
   * 
   * @param id Identificador numérico de la receta.
   * @param updateRecipeDto Datos a actualizar (parciales).
   * @returns Promesa con la receta actualizada.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(id, updateRecipeDto);
  }

  /**
   * Elimina una receta por su id.
   * 
   * Ruta: DELETE /recipes/:id
   * 
   * @param id Identificador numérico de la receta.
   * @returns Promesa que resuelve a void.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recipesService.remove(id);
  }
}
