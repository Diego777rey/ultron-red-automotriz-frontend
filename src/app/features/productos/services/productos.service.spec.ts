import { TestBed } from '@angular/core/testing';
import { ProductosService } from './productos.service';

describe('ProductosService', () => {
  let servicio: ProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(ProductosService);
  });

  it('filtra los diagramas por marca', () => {
    const toyota = servicio.porMarca('toyota');

    expect(toyota.length).toBeGreaterThan(0);
    expect(toyota.every((producto) => producto.marcaSlug === 'toyota')).toBe(true);
  });

  it('lista los modelos y años de una marca ordenados', () => {
    expect(servicio.modelosDe('toyota')).toEqual(['Corolla', 'Etios', 'Hilux']);

    const anios = servicio.aniosDe('toyota');
    expect(anios[0]).toBe(2015);
    expect(anios[anios.length - 1]).toBe(2024);
  });

  it('lo que carga el vendedor aparece en la página de la marca', () => {
    servicio.agregar({
      marcaSlug: 'fiat',
      modelo: 'Cronos',
      anioDesde: 2022,
      anioHasta: 2024,
      tipo: 'ECU',
      titulo: 'Diagrama ECU Fiat Cronos',
      precio: 160000,
    });

    expect(servicio.porMarca('fiat').map((producto) => producto.modelo)).toContain('Cronos');
    expect(servicio.modelosDe('fiat')).toContain('Cronos');
  });
});
