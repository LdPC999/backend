// alergenos.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('alergenos')
export class AlergenosController {
  @Get()
  findAll() {
    return [
      'Frutos secos',
      'Apio',
      'Pescado',
      'Moluscos', 
      'Lácteos',
      'Carne roja',
      'Sulfitos', 
      'Gluten',
      'Marisco',
      'Huevo',
      'Mostaza',
      'Soja', 
      'Sésamo'
    ];
  }
}
