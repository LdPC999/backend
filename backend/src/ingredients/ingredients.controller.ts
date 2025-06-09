// Importamos decoradores de NestJS para crear controladores y manejar rutas y parámetros.
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
// Importamos el servicio que maneja la lógica de ingredientes.
import { IngredientsService } from './ingredients.service';
// Importamos la entidad de ingrediente y los DTOs de creación y actualización.
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

/**
 * Controlador de ingredientes.
 * 
 * Expone rutas RESTful para gestionar ingredientes en la aplicación.
 * Permite obtener, crear, actualizar y eliminar ingredientes a través de la API.
 */
@Controller('ingredients') 
export class IngredientsController {
  /**
   * Inyecta el servicio de ingredientes.
   * 
   * @param ingredientsService Servicio que contiene la lógica de negocio de ingredientes.
   */
  constructor(private readonly ingredientsService: IngredientsService) {}

  /**
   * Obtiene la lista completa de ingredientes.
   * 
   * Ruta: GET /ingredients
   * @returns Una promesa que resuelve a un array de ingredientes.
   */
  @Get()
  findAll(): Promise<Ingredient[]> {
    return this.ingredientsService.findAll();
  }

  /**
   * Obtiene un ingrediente específico por su id.
   * 
   * Ruta: GET /ingredients/:id
   * Utiliza ParseIntPipe para convertir el parámetro id a número.
   * 
   * @param id Identificador numérico del ingrediente.
   * @returns Una promesa que resuelve al ingrediente encontrado o null si no existe.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Ingredient | null> {
    return this.ingredientsService.findOne(id);
  }

  /**
   * Crea un nuevo ingrediente.
   * 
   * Ruta: POST /ingredients
   * Recibe los datos validados a través del DTO de creación.
   * 
   * @param createIngredientDto Datos para crear el ingrediente.
   * @returns Una promesa que resuelve al ingrediente creado.
   */
  @Post()
  create(
    @Body() createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientsService.create(createIngredientDto);
  }

  /**
   * Elimina un ingrediente existente por su id.
   * 
   * Ruta: DELETE /ingredients/:id
   * Utiliza ParseIntPipe para asegurar que el id es numérico.
   * 
   * @param id Identificador numérico del ingrediente a eliminar.
   * @returns Una promesa que resuelve a void (sin contenido).
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ingredientsService.remove(id);
  }

  /**
   * Actualiza parcialmente un ingrediente existente.
   * 
   * Ruta: PATCH /ingredients/:id
   * Utiliza ParseIntPipe para el id y el DTO de actualización para los nuevos datos.
   * 
   * @param id Identificador numérico del ingrediente a actualizar.
   * @param updateDto Datos a actualizar (parciales).
   * @returns Una promesa que resuelve al ingrediente actualizado.
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, updateDto);
  }
}
