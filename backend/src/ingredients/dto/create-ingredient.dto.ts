import { IsString, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  nombre!: string;

  @IsString()
  tipo!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alergeno?: string[];
}
