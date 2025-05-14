import { IsString, IsOptional } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  nombre!: string;

  @IsString()
  tipo!: string;

  @IsOptional()
  @IsString()
  alergeno?: string;
}
