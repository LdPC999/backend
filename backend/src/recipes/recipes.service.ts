import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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

  // Crear receta con validación de duplicado
  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const nombre = createRecipeDto.nombre.toLowerCase().trim();

    const existing = await this.recipeRepository
      .createQueryBuilder('recipe')
      .where('LOWER(recipe.nombre) = :nombre', { nombre })
      .getOne();

    if (existing) {
      throw new ConflictException(
        `La receta "${createRecipeDto.nombre}" ya existe.`,
      );
    }

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

  // Eliminar receta
  async remove(id: number): Promise<void> {
    await this.recipeRepository.delete(id);
  }

  // Actualización con validación de duplicado
  async update(id: number, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    const receta = await this.recipeRepository.findOneBy({ id });
    if (!receta) throw new NotFoundException('Receta no encontrada');

    // Validar nombre duplicado si se modifica
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

    // Si actualiza ingredientes
    if (updateRecipeDto.ingredientes) {
      const ingredientes = await this.ingredientRepository.findBy({
        id: In(updateRecipeDto.ingredientes),
      });
      receta.ingredientes = ingredientes;
    }

    Object.assign(receta, updateRecipeDto);
    return this.recipeRepository.save(receta);
  }

  async findAllWithFilters(
    ingredienteNombre?: string,
    ingredienteId?: number,
    sinIngrediente?: string,
    tipo?: string,
    sinTipo?: string,
    sinAlergeno?: string,
    almuerzoCena?: string,
  ): Promise<Recipe[]> {
    const query = this.recipeRepository
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.ingredientes', 'ingredient');

    // Incluir recetas que contengan el ingrediente (por nombre o ID)
    if (ingredienteId) {
      query.andWhere('ingredient.id = :ingredienteId', { ingredienteId });
    }

    if (ingredienteNombre) {
      query.andWhere('LOWER(ingredient.nombre) LIKE :ingredienteNombre', {
        ingredienteNombre: `%${ingredienteNombre.toLowerCase()}%`,
      });
    }

    // Excluir recetas que contengan un ingrediente concreto
    if (sinIngrediente) {
      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('ri.recipeId')
            .from('recipe_ingredients_ingredient', 'ri')
            .innerJoin('ingredients', 'i', 'ri.ingredientId = i.id')
            .where('LOWER(i.nombre) = :sinIngrediente')
            .getQuery();
          return `recipe.id NOT IN ${subQuery}`;
        },
        { sinIngrediente: sinIngrediente.toLowerCase() },
      );
    }

    // Incluir recetas que tengan al menos un ingrediente de ese tipo
    if (tipo) {
      query.andWhere('LOWER(ingredient.tipo) = :tipo', {
        tipo: tipo.toLowerCase(),
      });
    }

    // Excluir recetas con ingredientes de cierto tipo
    if (sinTipo) {
      query.andWhere(
        (qb) => {
          const subQuery = qb
            .subQuery()
            .select('ri.recipeId')
            .from('recipe_ingredients_ingredient', 'ri')
            .innerJoin('ingredients', 'i', 'ri.ingredientId = i.id')
            .where('LOWER(i.tipo) = :sinTipo')
            .getQuery();
          return `recipe.id NOT IN ${subQuery}`;
        },
        { sinTipo: sinTipo.toLowerCase() },
      );
    }

    // Excluir recetas con alérgenos
    if (sinAlergeno) {
      query.andWhere(
        '(ingredient.alergeno IS NULL OR LOWER(ingredient.alergeno) != :sinAlergeno)',
        { sinAlergeno: sinAlergeno.toLowerCase() },
      );
    }

    // Filtrar por almuerzo o cena
    if (almuerzoCena) {
      query.andWhere('recipe.almuerzoCena = :almuerzoCena', { almuerzoCena });
    }

    return query.getMany();
  }
}
