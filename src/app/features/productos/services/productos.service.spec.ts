import { TestBed } from '@angular/core/testing';
import { PRODUCTOS_INICIALES } from '../data/productos.data';
import { ProductosService } from './productos.service';

describe('ProductosService', () => {
  let servicio: ProductosService;

  beforeEach(() => {
    servicio = TestBed.inject(ProductosService);
    servicio.reiniciar();
  });

  it('arranca con el catálogo prototipo', () => {
    expect(servicio.cantidad()).toBe(PRODUCTOS_INICIALES.length);
    expect(servicio.catalogo()[0].id).toBe(PRODUCTOS_INICIALES[0].id);
  });

  it('agrega un diagrama al principio del catálogo', () => {
    const creado = servicio.agregar({
      marcaSlug: 'bmw',
      modelo: 'X5',
      anioDesde: 2018,
      anioHasta: 2022,
      tipo: 'ecu',
      titulo: 'Diagrama ECU BMW X5',
      precio: 200000,
    });

    expect(creado.id).toMatch(/^nuevo-/);
    expect(servicio.catalogo()[0]).toEqual(creado);
    expect(servicio.cantidad()).toBe(PRODUCTOS_INICIALES.length + 1);
  });
});
