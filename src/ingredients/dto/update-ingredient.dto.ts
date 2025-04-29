import { PartialType } from "@nestjs/mapped-types";
import { CreateIngredientDto } from "./create-ingrtedient.dto";

export class UpdateIngredientDto extends PartialType(CreateIngredientDto){}
