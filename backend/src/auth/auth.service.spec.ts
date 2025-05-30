// auth.service.spec.ts

// Importamos utilidades de testeo de NestJS.
// Test: Permite crear módulos de testing.
// TestingModule: Representa un módulo de pruebas instanciado.
import { Test, TestingModule } from '@nestjs/testing';
// Importamos el servicio que queremos testear.
import { AuthService } from './auth.service';

/**
 * Test unitario para el servicio de autenticación (AuthService).
 * 
 * Este archivo verifica que el AuthService se instancia correctamente y está definido.
 */
describe('AuthService', () => {
  // Variable donde se almacenará la instancia del servicio durante las pruebas.
  let service: AuthService;

  // Hook que se ejecuta antes de cada test.
  beforeEach(async () => {
    // Creamos un módulo de testing e inyectamos el AuthService como proveedor.
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    // Obtenemos una instancia del AuthService desde el módulo de pruebas.
    service = module.get<AuthService>(AuthService);
  });

  /**
   * Test: Verifica que el servicio esté definido.
   * 
   * Este test simplemente comprueba que el AuthService ha sido correctamente instanciado
   * y está disponible para su uso.
   */
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
