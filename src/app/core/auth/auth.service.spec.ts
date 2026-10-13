import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let servicio: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(AuthService);
    servicio.cerrarSesion();
  });

  it('registra e inicia sesión de un cliente', async () => {
    const registro = await servicio.registrarCliente({
      email: 'cliente@test.com',
      nombre: 'Cliente Test',
      contrasena: 'clave12345',
    });
    expect(registro.ok).toBe(true);
    servicio.cerrarSesion();
    const login = await servicio.iniciarSesion('cliente@test.com', 'clave12345');
    expect(login.ok).toBe(true);
    expect(login.ok && login.usuario.rol).toBe('cliente');
  });
});
