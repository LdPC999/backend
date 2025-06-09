import { Controller, Get } from '@nestjs/common';

/**
 * Controlador de alérgenos.
 *
 * Este controlador gestiona las rutas relacionadas con los alérgenos.
 * Actualmente, solo implementa la obtención de la lista completa de alérgenos disponibles en el sistema.
 */
@Controller('alergenos')
export class AlergenosController {
  /**
   * Método que devuelve la lista de alérgenos disponibles.
   *
   * Este método responde a las solicitudes GET a la ruta /alergenos.
   * Retorna un array estático de strings, donde cada string representa un alérgeno reconocido por el sistema.
   *
   * @returns {string[]}
   */
  @Get()
  findAll() {
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
