// app.controller.spec.ts

// Importamos utilidades de testing de NestJS.
import { Test, TestingModule } from '@nestjs/testing';
// Importamos el controlador y el servicio principal de la app.
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Test unitario para AppController.
 * 
 * Este archivo comprueba que el controlador principal de la aplicación
 * responde correctamente con el mensaje "Hello World!".
 */
describe('AppController', () => {
  // Variable donde se almacenará la instancia del controlador bajo prueba.
  let appController: AppController;

  // Hook que se ejecuta antes de cada test para preparar el entorno.
  beforeEach(async () => {
    // Creamos un módulo de pruebas con el controlador y su dependencia.
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    // Obtenemos una instancia del controlador desde el módulo de pruebas.
    appController = app.get<AppController>(AppController);
  });

  /**
   * Test para el endpoint raíz del controlador.
   * 
   * Verifica que el método getHello() retorna exactamente "Hello World!".
   */
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
