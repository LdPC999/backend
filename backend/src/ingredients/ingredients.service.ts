// Importamos decoradores y excepciones de NestJS.
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
// Importamos utilidades para inyectar el repositorio de TypeORM.
import { InjectRepository } from '@nestjs/typeorm';
// Importamos el repositorio de TypeORM para manipular la entidad.
import { Repository } from 'typeorm';
// Importamos la entidad y el DTO de creación.
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

/**
 * Servicio de ingredientes.
 * 
 * Este servicio contiene toda la lógica de negocio relacionada con la gestión de ingredientes:
 * consultar, crear, eliminar y actualizar ingredientes, así como la validación de duplicados.
 */
@Injectable()
export class IngredientsService {
  /**
   * Constructor que inyecta el repositorio de ingredientes.
   * 
   * @param ingredientRepo Repositorio de TypeORM para la entidad Ingredient.
   */
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
  ) {}

  /**
   * Obtiene todos los ingredientes.
   * 
   * @returns Una promesa que resuelve a un array de ingredientes.
   */
  findAll(): Promise<Ingredient[]> {
    return this.ingredientRepo.find();
  }

  /**
   * Busca un ingrediente por su ID.
   * 
   * @param id Identificador del ingrediente.
   * @returns Una promesa que resuelve al ingrediente encontrado o null si no existe.
   */
  findOne(id: number): Promise<Ingredient | null> {
    return this.ingredientRepo.findOneBy({ id });
  }

  /**
   * Crea un nuevo ingrediente después de comprobar que no exista uno duplicado.
   * 
   * @param createIngredientDto Datos para crear el ingrediente.
   * @returns Una promesa que resuelve al ingrediente creado.
   * @throws ConflictException si ya existe un ingrediente con el mismo nombre.
   */
  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    // Normaliza el nombre para hacer la comprobación de duplicados sin importar mayúsculas/minúsculas y espacios.
    const nombre = createIngredientDto.nombre.toLowerCase().trim();

    // Busca si ya existe un ingrediente con ese nombre.
    const existing = await this.ingredientRepo
      .createQueryBuilder('ingredient')
      .where('LOWER(ingredient.nombre) = :nombre', { nombre })
      .getOne();

    // Si existe, lanza una excepción de conflicto.
    if (existing) {
      throw new ConflictException(
        `El ingrediente "${createIngredientDto.nombre}" ya existe.`,
      );
    }

    // Si no existe, crea y guarda el nuevo ingrediente.
    const newIngredient = this.ingredientRepo.create(createIngredientDto);
    return this.ingredientRepo.save(newIngredient);
  }

  /**
   * Elimina un ingrediente por su ID.
   * 
   * @param id Identificador del ingrediente a eliminar.
   * @returns Una promesa que resuelve a void.
   */
  async remove(id: number): Promise<void> {
    await this.ingredientRepo.delete(id);
  }

  /**
   * Actualiza parcialmente un ingrediente.
   * 
   * Si se actualiza el nombre, comprueba que no exista ya otro ingrediente con el mismo nombre.
   * 
   * @param id Identificador del ingrediente a actualizar.
   * @param updateDto Datos parciales para actualizar.
   * @returns Una promesa que resuelve al ingrediente actualizado.
   * @throws NotFoundException si el ingrediente no existe.
   * @throws ConflictException si se intenta duplicar el nombre.
   */
  async update(
    id: number,
    updateDto: Partial<CreateIngredientDto>,
  ): Promise<Ingredient> {
    // Busca el ingrediente por su id.
    const ingrediente = await this.ingredientRepo.findOneBy({ id });
    if (!ingrediente) throw new NotFoundException('Ingrediente no encontrado');

    // Si se va a actualizar el nombre, comprueba que no exista duplicado.
    if (updateDto.nombre && updateDto.nombre !== ingrediente.nombre) {
      const duplicate = await this.ingredientRepo.findOneBy({
        nombre: updateDto.nombre,
      });

      // Si hay otro ingrediente con ese nombre y no es el mismo, lanza conflicto.
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(
          `Ya existe otro ingrediente con el nombre "${updateDto.nombre}".`,
        );
      }
    }

    // Actualiza los campos del ingrediente.
    Object.assign(ingrediente, updateDto);
    return this.ingredientRepo.save(ingrediente);
  }
}
