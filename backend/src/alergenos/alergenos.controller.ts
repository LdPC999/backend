// alergenos.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('alergenos')
export class AlergenosController {
  @Get()
  findAll() {
    // Lista fija. Puedes moverla a un servicio si prefieres.
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
