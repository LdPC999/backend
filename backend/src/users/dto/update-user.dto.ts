import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  nombre?: string;
  apellidos?: string;
  alergenos?: string[];
  password?: string;
}