import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
import { Recipe } from '../recipes/entities/recipe.entity';

config(); // Carga las variables del .env

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
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión con PostgreSQL realizada correctamente.');
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
