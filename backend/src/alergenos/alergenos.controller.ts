// alergenos.controller.ts

// Importamos los decoradores necesarios desde el core de NestJS.
// 'Controller' sirve para definir la clase como un controlador y asignar una ruta base.
// 'Get' indica que el método responde a solicitudes HTTP GET.
import { Controller, Get } from '@nestjs/common';

/**
 * Controlador de alérgenos.
 * 
 * Este controlador gestiona las rutas relacionadas con los alérgenos.
 * Actualmente, solo implementa la obtención de la lista completa de alérgenos disponibles en el sistema.
 */
@Controller('alergenos') // Ruta base: /alergenos
export class AlergenosController {

  /**
   * Método que devuelve la lista de alérgenos disponibles.
   * 
   * Este método responde a las solicitudes GET a la ruta /alergenos.
   * Retorna un array estático de strings, donde cada string representa un alérgeno reconocido por el sistema.
   * 
   * @returns {string[]} Lista de alérgenos
   */
  @Get() // Indica que este método maneja peticiones GET en /alergenos
  findAll() {
    // Array con los nombres de los alérgenos más comunes
    return [
      'Cacahuetes',
      'Apio',
      'Pescado',
      'Moluscos', 
      'Lácteos',
      'Sulfitos', 
      'Gluten',
      'Crustáceos',
      'Huevo',
      'Mostaza',
      'Soja', 
      'Sésamo',
      'Frutos de cáscara',
      'Altramuces',

    ];
  }
}
