import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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

  // Crear ingrediente con validación de duplicado
  async create(createIngredientDto: CreateIngredientDto): Promise<Ingredient> {
    // Manejamos mayúsculas y minúsculas
    const nombre = createIngredientDto.nombre.toLowerCase().trim();

    const existing = await this.ingredientRepo
      .createQueryBuilder('ingredient')
      .where('LOWER(ingredient.nombre) = :nombre', { nombre })
      .getOne();

    if (existing) {
      throw new ConflictException(
        `El ingrediente "${createIngredientDto.nombre}" ya existe.`,
      );
    }

    const newIngredient = this.ingredientRepo.create(createIngredientDto);
    return this.ingredientRepo.save(newIngredient);
  }

  // Eliminar ingrediente por ID
  async remove(id: number): Promise<void> {
    await this.ingredientRepo.delete(id);
  }

  // Actualización de ingrediente con validación de duplicado
  async update(
    id: number,
    updateDto: Partial<CreateIngredientDto>,
  ): Promise<Ingredient> {
    const ingrediente = await this.ingredientRepo.findOneBy({ id });
    if (!ingrediente) throw new NotFoundException('Ingrediente no encontrado');

    // Validar nombre duplicado si se quiere actualizar
    if (updateDto.nombre && updateDto.nombre !== ingrediente.nombre) {
      const duplicate = await this.ingredientRepo.findOneBy({
        nombre: updateDto.nombre,
      });

      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(
          `Ya existe otro ingrediente con el nombre "${updateDto.nombre}".`,
        );
      }
    }

    Object.assign(ingrediente, updateDto);
    return this.ingredientRepo.save(ingrediente);
  }
}
