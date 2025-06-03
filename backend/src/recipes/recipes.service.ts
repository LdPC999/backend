// recipes.service.ts

// Importamos decoradores y excepciones de NestJS para el servicio.
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
// Importamos utilidades para inyectar repositorios y construir queries.
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
// Importamos las entidades y DTOs necesarios.
import { Recipe } from './entities/recipe.entity';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

/**
 * Servicio de recetas.
 *
 * Contiene toda la lógica de negocio relacionada con la gestión de recetas,
 * incluyendo creación, consulta, actualización, eliminación y filtrado avanzado.
 */
@Injectable()
export class RecipesService {
  /**
   * Inyección de los repositorios de receta e ingrediente.
   *
   * @param recipeRepository Repositorio de recetas.
   * @param ingredientRepository Repositorio de ingredientes.
   */
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  /**
   * Crea una nueva receta tras validar que no exista otra con el mismo nombre (ignorando mayúsculas/minúsculas).
   * Asocia los ingredientes usando sus IDs.
   *
   * @param createRecipeDto Datos para crear la receta.
   * @returns Promesa con la receta creada.
   * @throws ConflictException si el nombre ya existe.
   */
  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const nombre = createRecipeDto.nombre.toLowerCase().trim();

    // Validación de receta duplicada
    const existing = await this.recipeRepository
      .createQueryBuilder('recipe')
      .where('LOWER(recipe.nombre) = :nombre', { nombre })
      .getOne();

    if (existing) {
      throw new ConflictException(
        `La receta "${createRecipeDto.nombre}" ya existe.`,
      );
    }

    // Busca los ingredientes por sus IDs
    const ingredients = await this.ingredientRepository.findBy({
      id: In(createRecipeDto.ingredientes),
    });

    // Crea y guarda la receta
    const recipe = this.recipeRepository.create({
      ...createRecipeDto,
      ingredientes: ingredients,
    });

    return this.recipeRepository.save(recipe);
  }

  /**
   * Obtiene todas las recetas, incluyendo sus ingredientes.
   *
   * @returns Promesa con el array de recetas.
   */
  findAll(): Promise<Recipe[]> {
    return this.recipeRepository.find({ relations: ['ingredientes'] });
  }

  /**
   * Busca una receta por su ID, incluyendo sus ingredientes.
   *
   * @param id Identificador de la receta.
   * @returns Promesa con la receta encontrada o null si no existe.
   */
  findOne(id: number): Promise<Recipe | null> {
    return this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredientes'],
    });
  }

  /**
   * Elimina una receta por su ID.
   *
   * @param id Identificador de la receta a eliminar.
   * @returns Promesa que resuelve a void.
   */
  async remove(id: number): Promise<void> {
    await this.recipeRepository.delete(id);
  }

  /**
   * Actualiza una receta.
   *
   * Permite actualizar campos simples y la relación con ingredientes,
   * validando que no haya duplicidad de nombre.
   *
   * @param id Identificador de la receta a actualizar.
   * @param updateRecipeDto Datos de actualización.
   * @returns Promesa con la receta actualizada.
   * @throws NotFoundException si la receta no existe.
   * @throws ConflictException si el nombre actualizado ya existe en otra receta.
   */
  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    // 1. Buscar la receta incluyendo sus relaciones
    const receta = await this.recipeRepository.findOne({
      where: { id },
      relations: ['ingredientes'],
    });
    if (!receta) throw new NotFoundException('Receta no encontrada');

    // 2. Validar nombre duplicado si corresponde
    if (
      updateRecipeDto.nombre &&
      updateRecipeDto.nombre.toLowerCase().trim() !==
        receta.nombre.toLowerCase()
    ) {
      const nombre = updateRecipeDto.nombre.toLowerCase().trim();
      const duplicate = await this.recipeRepository
        .createQueryBuilder('recipe')
        .where('LOWER(recipe.nombre) = :nombre', { nombre })
        .andWhere('recipe.id != :id', { id })
        .getOne();

      if (duplicate) {
        throw new ConflictException(
          `Ya existe otra receta con el nombre "${updateRecipeDto.nombre}".`,
        );
      }
    }

    // 3. Actualizar campos simples (strings y números)
    receta.nombre = updateRecipeDto.nombre ?? receta.nombre;
    receta.dificultad = updateRecipeDto.dificultad ?? receta.dificultad;
    receta.tiempoPreparacion =
      updateRecipeDto.tiempoPreparacion ?? receta.tiempoPreparacion;
    receta.imagen = updateRecipeDto.imagen ?? receta.imagen;
    receta.almuerzoCena = updateRecipeDto.almuerzoCena ?? receta.almuerzoCena;

    // 4. Actualizar ingredientes (relación many-to-many)
    if (updateRecipeDto.ingredientes) {
      // Si la lista viene vacía, elimina todos los ingredientes asociados
      if (updateRecipeDto.ingredientes.length === 0) {
        receta.ingredientes = [];
      } else {
        // Busca los ingredientes por ID y actualiza el array
        const ingredientes = await this.ingredientRepository.findBy({
          id: In(updateRecipeDto.ingredientes),
        });
        receta.ingredientes = ingredientes;
      }
    }
    // 5. Guarda la receta actualizada (incluye actualización de relaciones)
    return this.recipeRepository.save(receta);
  }

  /**
   * Devuelve recetas aplicando diferentes filtros avanzados según los parámetros recibidos.
   * Permite filtrar por nombre o id de ingrediente, tipo, alérgeno, y otros criterios.
   *
   * @param ingredienteNombre Nombre parcial del ingrediente que debe incluir la receta.
   * @param ingredienteId ID de ingrediente que debe incluir la receta.
   * @param sinIngrediente Nombre de ingrediente que NO debe estar presente.
   * @param tipo Tipo de ingrediente requerido.
   * @param sinTipo Tipo de ingrediente que NO debe estar presente.
   * @param sinAlergeno Alérgeno que NO debe estar presente.
   * @param almuerzoCena Valor de almuerzo/cena.
   * @returns Promesa con el array de recetas que cumplen los filtros.
   */
  async findAllWithFilters(
    ingredienteNombre?: string,
    ingredienteId?: number,
    sinIngrediente?: string,
    tipo?: string,
    sinTipo?: string,
    sinAlergeno?: string[],
    almuerzoCena?: string,
  ): Promise<Recipe[]> {
    const query = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredientes', 'ingredient');

    // Filtra recetas que contengan un ingrediente específico por ID
    if (ingredienteId) {
      query.andWhere('ingredient.id = :ingredienteId', { ingredienteId });
    }

    // Filtra recetas que contengan ingredientes cuyo nombre incluya una cadena (insensible a mayúsculas/minúsculas)
    if (ingredienteNombre) {
      query.andWhere('LOWER(ingredient.nombre) LIKE :ingredienteNombre', {
        ingredienteNombre: `%${ingredienteNombre.toLowerCase()}%`,
      });
    }

    // Excluye recetas que tengan un ingrediente concreto (por nombre)
    if (sinIngrediente) {
      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('ri.recipeId')
            .from('recipe_ingredientes_ingredients', 'ri')
            .innerJoin('ingredients', 'i', 'ri."ingredientsId" = i.id')
            .where('LOWER(i.nombre) = :sinIngrediente')
            .getQuery();
          return `recipe.id NOT IN ${subQuery}`;
        },
        { sinIngrediente: sinIngrediente.toLowerCase() },
      );
    }

    // Filtra recetas que tengan ingredientes de un tipo específico
    if (tipo) {
      query.andWhere('LOWER(ingredient.tipo) = :tipo', {
        tipo: tipo.toLowerCase(),
      });
    }

    // Excluye recetas con ingredientes de cierto tipo
    if (sinTipo) {
      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('ri.recipeId')
            .from('recipe_ingredientes_ingredients', 'ri')
            .innerJoin('ingredients', 'i', 'ri."ingredientsId" = i.id')
            .where('LOWER(i.tipo) = :sinTipo')
            .getQuery();
          return `recipe.id NOT IN ${subQuery}`;
        },
        { sinTipo: sinTipo.toLowerCase() },
      );
    }

    // Excluye recetas que tengan ingredientes con un alérgeno concreto
    if (sinAlergeno && sinAlergeno.length > 0) {
      const alergenos = sinAlergeno.map((a) => a.toLowerCase());

      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('ri.recipeId')
            .from('recipe_ingredientes_ingredients', 'ri')
            .innerJoin('ingredients', 'i', 'ri."ingredientsId" = i.id')
            .where(
              `
          EXISTS (
            SELECT 1 FROM unnest(i.alergeno) AS alg
            WHERE LOWER(alg) = ANY(:sinAlergenos)
          )
        `,
            )
            .getQuery();

          return `recipe.id NOT IN ${subQuery}`;
        },
        { sinAlergenos: alergenos },
      );
    }

    // Filtra por valor de almuerzo o cena
    if (almuerzoCena) {
      query.andWhere('recipe.almuerzoCena = :almuerzoCena', { almuerzoCena });
    }

    // Ejecuta la consulta y devuelve las recetas que cumplen los filtros
    return query.getMany();
  }
}
