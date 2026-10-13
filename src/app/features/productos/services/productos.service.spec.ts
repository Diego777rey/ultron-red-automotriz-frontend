import { TestBed } from '@angular/core/testing';
import { ProductosService } from './productos.service';

describe('ProductosService', () => {
  let servicio: ProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ProductosService);
  });

  it('filtra los diagramas activos por marca', () => {
    const toyota = servicio.porMarca('toyota');

    expect(toyota.length).toBeGreaterThan(0);
    expect(toyota.every((producto) => producto.marcaSlug === 'toyota')).toBe(true);
  });

  it('permite CRUD de productos', () => {
    const creado = servicio.crear({
      marcaSlug: 'fiat',
      modelo: 'Cronos',
      anioDesde: 2022,
      anioHasta: 2024,
      tipo: 'ECU',
      titulo: 'Diagrama ECU Fiat Cronos',
      precio: 160000,
      activo: true,
    });
    expect(servicio.obtener(creado.id)?.modelo).toBe('Cronos');
    servicio.actualizar(creado.id, { precio: 170000 });
    expect(servicio.obtener(creado.id)?.precio).toBe(170000);
    expect(servicio.eliminar(creado.id)).toBe(true);
    expect(servicio.obtener(creado.id)).toBeUndefined();
  });
});
