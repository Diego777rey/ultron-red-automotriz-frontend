import { TestBed } from '@angular/core/testing';
import { ProductoCatalogo } from '../../productos/models/producto.model';
import { CarritoService } from './carrito.service';

const PRODUCTO: ProductoCatalogo = {
  id: 7,
  codigo: 'X',
  nombre: 'Pastillas de freno',
  descripcion: null,
  precioVenta: 120000,
  imagen: 'productos/x.jpg',
  imagenUrl: 'http://localhost:8081/uploads/productos/x.jpg',
  tipoIva: null,
  categoria: null,
  presentaciones: [],
};

describe('CarritoService', () => {
  let servicio: CarritoService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(CarritoService);
  });

  it('agrega y acumula cantidades', () => {
    servicio.agregar(PRODUCTO);
    servicio.agregar(PRODUCTO, { cantidad: 2 });
    expect(servicio.cantidadTotal()).toBe(3);
    expect(servicio.subtotal()).toBe(360000);
  });

  it('quita una línea', () => {
    servicio.agregar(PRODUCTO);
    servicio.quitar(PRODUCTO.id);
    expect(servicio.vacio()).toBe(true);
  });
});
