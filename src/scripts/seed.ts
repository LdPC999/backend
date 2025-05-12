import { DataSource } from 'typeorm';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { Recipe } from '../recipes/entities/recipe.entity';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config(); // Carga .env

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'LDpc17578',
  database: process.env.DB_NAME || 'tfgdb',
  synchronize: true,
  entities: [Ingredient, Recipe],
});

async function seed() {
  await AppDataSource.initialize();
  const ingredientRepo = AppDataSource.getRepository(Ingredient);
  const recipeRepo = AppDataSource.getRepository(Recipe);

  const ingredientesPath = path.join(__dirname, '../../ingredientes.json');
  const recetasPath = path.join(__dirname, '../../recetas.json');

  const ingredientsData = JSON.parse(fs.readFileSync(ingredientesPath, 'utf-8')).Ingredientes;
  const recipesData = JSON.parse(fs.readFileSync(recetasPath, 'utf-8')).Recetas;

  // INGREDIENTES
  for (const ing of ingredientsData) {
    const existing = await ingredientRepo.findOneBy({ nombre: ing.nombre });
    if (existing) {
      await ingredientRepo.update(existing.id, ing); // actualiza si existe
    } else {
      await ingredientRepo.save(ingredientRepo.create(ing)); // crea si no
    }
  }

  // RECETAS
  for (const rec of recipesData) {
    const ingredientNames = rec.ingredientes.map((i: any) => i.nombre);
    const ingredients = await ingredientRepo
      .createQueryBuilder('ingredient')
      .where('ingredient.nombre IN (:...names)', { names: ingredientNames })
      .getMany();

    const existingRecipe = await recipeRepo.findOneBy({ nombre: rec.nombre });

    if (existingRecipe) {
      await recipeRepo.update(existingRecipe.id, {
        dificultad: rec.dificultad,
        tiempoPreparacion: rec.tiempoPreparacion,
        imagen: rec.imagen || '',
        ingredientes: ingredients,
      });
    } else {
      const recetaEntity = recipeRepo.create({
        nombre: rec.nombre,
        dificultad: rec.dificultad,
        tiempoPreparacion: rec.tiempoPreparacion,
        imagen: rec.imagen || '',
        ingredientes: ingredients,
      });
      await recipeRepo.save(recetaEntity);
    }
  }

  console.log('Ingredientes y recetas insertados/actualizados correctamente.');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Error al insertar datos:', err);
  AppDataSource.destroy();
});

// npx ts-node src/scripts/seed.ts