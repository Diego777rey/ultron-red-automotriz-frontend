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

  function responderCarga(productos: unknown[], categorias: unknown[] = []): void {
    const requests = http.match(API_CONFIG.graphqlEndpoint);
    expect(requests.length).toBe(2);
    const productosReq = requests.find((req) =>
      String(req.request.body.query).includes('catalogoWebProductos'),
    );
    const categoriasReq = requests.find((req) =>
      String(req.request.body.query).includes('catalogoWebCategorias'),
    );
    expect(productosReq).toBeTruthy();
    expect(categoriasReq).toBeTruthy();
    productosReq!.flush({ data: { catalogoWebProductos: productos } });
    categoriasReq!.flush({ data: { catalogoWebCategorias: categorias } });
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
    expect(requests.length).toBe(2);
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
      } else {
        req.flush({ data: { catalogoWebCategorias: [] } });
      }
    }
    expect(servicio.categoriaSeleccionada()).toBe(7);
  });

  it('no envía al API los ids del menú fijo de la tienda', () => {
    servicio.aplicarFiltros({ filter: '', idCategoria: 102 });

    const requests = http.match(API_CONFIG.graphqlEndpoint);
    const productosReq = requests.find((req) =>
      String(req.request.body.query).includes('catalogoWebProductos'),
    );
    expect(productosReq!.request.body.variables).toEqual({
      filter: null,
      idCategoria: null,
    });

    for (const req of requests) {
      const query = String(req.request.body.query);
      if (query.includes('catalogoWebProductos')) {
        req.flush({ data: { catalogoWebProductos: [] } });
      } else {
        req.flush({ data: { catalogoWebCategorias: [] } });
      }
    }
    expect(servicio.categoriaActiva()?.nombre).toBe('FILTROS');
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

  it('resuelve la categoría activa desde el menú fijo', () => {
    servicio.setCategoria(102);
    expect(servicio.categoriaActiva()?.nombre).toBe('FILTROS');
    expect(servicio.categoriaActiva()?.padre?.nombre).toBe('VEHICULOS LIVIANOS / AUTOMOVILES');
  });

  it('carga más comprados desde GraphQL', () => {
    servicio.cargarMasComprados(8);

    const req = http.expectOne(API_CONFIG.graphqlEndpoint);
    expect(String(req.request.body.query)).toContain('catalogoWebProductosMasComprados');
    expect(req.request.body.variables).toEqual({ limite: 8 });
    req.flush({
      data: {
        catalogoWebProductosMasComprados: [
          {
            id_producto: 9,
            codigo: 'TOP',
            nombre: 'Más vendido',
            descripcion: '',
            precioVenta: 1000,
            imagen: 'top.jpg',
            tipoIva: '10',
            categoriaProducto: null,
            presentaciones: [],
          },
        ],
      },
    });

    expect(servicio.masComprados()).toHaveLength(1);
    expect(servicio.masComprados()[0].nombre).toBe('Más vendido');
  });

  it('no repite la consulta del catálogo cuando el filtro no cambió', () => {
    servicio.aplicarFiltros({ filter: '', idCategoria: null });
    responderCarga([]);

    servicio.aplicarFiltros({ filter: '', idCategoria: null });
    http.expectNone(API_CONFIG.graphqlEndpoint);
    expect(servicio.estaCargando()).toBe(false);
    expect(servicio.todos()).toEqual([]);
  });
});
