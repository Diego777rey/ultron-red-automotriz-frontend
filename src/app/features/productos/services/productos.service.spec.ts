import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_CONFIG } from '../../../config/api.config';
import { ProductosService } from './productos.service';

describe('ProductosService', () => {
  let servicio: ProductosService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(ProductosService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('carga el catálogo web desde GraphQL', () => {
    servicio.cargar({ forzar: true });

    const req = http.expectOne(API_CONFIG.graphqlEndpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.query).toContain('catalogoWebProductos');

    req.flush({
      data: {
        catalogoWebProductos: [
          {
            id_producto: 1,
            codigo: 'P-1',
            nombre: 'Filtro de aceite',
            descripcion: 'Uso general',
            precioVenta: 45000,
            imagen: 'productos/filtro.jpg',
            tipoIva: '10',
            categoriaProducto: {
              id_categoria_producto: 2,
              nombre: 'Filtros',
              categoriaPadre: null,
            },
            presentaciones: [],
          },
        ],
      },
    });

    const categorias = http.expectOne(API_CONFIG.graphqlEndpoint);
    categorias.flush({ data: { catalogoWebCategorias: [] } });

    expect(servicio.todos().length).toBe(1);
    expect(servicio.todos()[0].nombre).toBe('Filtro de aceite');
    expect(servicio.todos()[0].imagenUrl).toContain('/uploads/productos/filtro.jpg');
  });

  it('filtra por texto de búsqueda', () => {
    servicio.cargar({ forzar: true });
    const req = http.expectOne(API_CONFIG.graphqlEndpoint);
    req.flush({
      data: {
        catalogoWebProductos: [
          {
            id_producto: 1,
            codigo: 'A',
            nombre: 'Bujía',
            descripcion: '',
            precioVenta: 10000,
            imagen: 'a.jpg',
            tipoIva: null,
            categoriaProducto: null,
            presentaciones: [],
          },
          {
            id_producto: 2,
            codigo: 'B',
            nombre: 'Aceite',
            descripcion: '',
            precioVenta: 20000,
            imagen: 'b.jpg',
            tipoIva: null,
            categoriaProducto: null,
            presentaciones: [],
          },
        ],
      },
    });
    http.expectOne(API_CONFIG.graphqlEndpoint).flush({ data: { catalogoWebCategorias: [] } });

    servicio.setBusqueda('aceite');
    expect(servicio.filtrados().map((p) => p.nombre)).toEqual(['Aceite']);
  });
});
