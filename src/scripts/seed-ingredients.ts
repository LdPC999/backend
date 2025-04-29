import * as mongoose from 'mongoose';
import { Ingredient, IngredientSchema } from '../ingredients/schemas/ingredients.schema';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

config(); // Carga variables de entorno .env

async function seedIngredients() {
  // Conectar a MongoDB
  await mongoose.connect(process.env.MONGO_URI as string);

  // Definir el modelo temporal 
  const IngredientModel = mongoose.model<Ingredient>('Ingredient', IngredientSchema);

  // Leer el archivo JSON
  const dataPath = path.join(__dirname, '..', '..', 'ingredientes.json'); // Cambia el nombre si el archivo tiene otro nombre
  const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Insertar los ingredientes
  try {
    await IngredientModel.deleteMany(); // Opcional: limpia antes
    await IngredientModel.insertMany(jsonData.Ingredientes);
    console.log('Ingredientes importados correctamente.');
  } catch (error) {
    console.error('Error importando ingredientes:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

seedIngredients();
