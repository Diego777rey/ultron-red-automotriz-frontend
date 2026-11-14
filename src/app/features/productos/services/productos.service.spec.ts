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

  function responderCarga(
    productos: unknown[],
    categorias: unknown[] = [],
    categoriasNav: unknown[] = [],
  ): void {
    const requests = http.match(API_CONFIG.graphqlEndpoint);
    expect(requests.length).toBe(3);
    const productosReq = requests.find((req) =>
      String(req.request.body.query).includes('catalogoWebProductos'),
    );
    const categoriasReq = requests.find(
      (req) =>
        String(req.request.body.query).includes('catalogoWebCategorias') &&
        !String(req.request.body.query).includes('catalogoWebCategoriasNav'),
    );
    const navReq = requests.find((req) =>
      String(req.request.body.query).includes('catalogoWebCategoriasNav'),
    );
    expect(productosReq).toBeTruthy();
    expect(categoriasReq).toBeTruthy();
    expect(navReq).toBeTruthy();
    productosReq!.flush({ data: { catalogoWebProductos: productos } });
    categoriasReq!.flush({ data: { catalogoWebCategorias: categorias } });
    navReq!.flush({ data: { catalogoWebCategoriasNav: categoriasNav } });
  }

  it('carga el catálogo web desde GraphQL', () => {
    servicio.cargar({ forzar: true });

    responderCarga([
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
    ]);

    expect(servicio.todos().length).toBe(1);
    expect(servicio.todos()[0].nombre).toBe('Filtro de aceite');
    expect(servicio.todos()[0].imagenUrl).toContain('/uploads/productos/filtro.jpg');
  });

  it('envía idCategoria y filter al API', () => {
    servicio.aplicarFiltros({ filter: 'aceite', idCategoria: 7 });

    const requests = http.match(API_CONFIG.graphqlEndpoint);
    expect(requests.length).toBe(3);
    const productosReq = requests.find((req) =>
      String(req.request.body.query).includes('catalogoWebProductos'),
    );
    expect(productosReq).toBeTruthy();
    expect(productosReq!.request.body.variables).toEqual({
      filter: 'aceite',
      idCategoria: '7',
    });

    for (const req of requests) {
      const query = String(req.request.body.query);
      if (query.includes('catalogoWebProductos')) {
        req.flush({ data: { catalogoWebProductos: [] } });
      } else if (query.includes('catalogoWebCategoriasNav')) {
        req.flush({
          data: {
            catalogoWebCategoriasNav: [
              { id_categoria_producto: 7, nombre: 'Taller', categoriaPadre: null },
            ],
          },
        });
      } else {
        req.flush({ data: { catalogoWebCategorias: [] } });
      }
    }
    expect(servicio.categoriaSeleccionada()).toBe(7);
  });

  it('filtra por texto de búsqueda', () => {
    servicio.cargar({ forzar: true });
    responderCarga([
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
    ]);

    servicio.setBusqueda('aceite');
    expect(servicio.filtrados().map((p) => p.nombre)).toEqual(['Aceite']);
  });
});
