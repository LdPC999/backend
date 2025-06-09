// Importamos decoradores de NestJS para definir el controlador y los endpoints.
import { Controller, Get } from '@nestjs/common';
// Importamos el servicio principal de la aplicación.
import { AppService } from './app.service';

/**
 * Controlador principal de la aplicación.
 * 
 * Expone el endpoint raíz (GET /) y delega la lógica al servicio principal (AppService).
 */
@Controller() // Define el controlador sin prefijo, actúa sobre la ruta raíz "/"
export class AppController {
  /**
   * Inyecta el servicio principal.
   * 
   * @param appService Servicio con la lógica del endpoint raíz.
   */
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint GET /
   * 
   * Devuelve un saludo simple llamando al método getHello() del servicio.
   * 
   * @returns {string} Mensaje de saludo ("Hello World!").
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
