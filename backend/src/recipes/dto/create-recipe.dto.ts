import { IsString, IsNumber, IsOptional, IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  nombre!: string;

  @IsString()
  dificultad!: string;

  @IsNumber()
  tiempoPreparacion!: number;

  @IsOptional()
  @IsString()
  imagen?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true }) // asegura que cada elemento del array sea un número entero
  ingredientes!: number[]; // IDs de ingredientes
}
