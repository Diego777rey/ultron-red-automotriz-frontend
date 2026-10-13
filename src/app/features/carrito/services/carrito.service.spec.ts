import { TestBed } from '@angular/core/testing';
import { ProductoDiagrama } from '../../productos/models/producto.model';
import { CarritoService } from './carrito.service';

const PRODUCTO: ProductoDiagrama = {
  id: 'p1',
  marcaSlug: 'toyota',
  modelo: 'Hilux',
  anioDesde: 2020,
  anioHasta: 2022,
  tipo: 'ECU',
  titulo: 'Test',
  precio: 100000,
};

describe('CarritoService', () => {
  let servicio: CarritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(CarritoService);
    servicio.vaciar();
  });

  it('agrega productos y calcula el total', () => {
    servicio.agregar(PRODUCTO);
    servicio.agregar(PRODUCTO);
    expect(servicio.cantidadTotal()).toBe(2);
    expect(servicio.subtotal()).toBe(200000);
  });
});
