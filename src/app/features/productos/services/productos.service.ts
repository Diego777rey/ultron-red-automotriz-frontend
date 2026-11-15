import { computed, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { GraphqlRequestError, GraphqlService } from '../../../core/graphql/graphql.service';
import {
  CATALOGO_WEB_CATEGORIAS_NAV_QUERY,
  CATALOGO_WEB_CATEGORIAS_QUERY,
  CATALOGO_WEB_PRODUCTOS_MAS_COMPRADOS_QUERY,
  CATALOGO_WEB_PRODUCTOS_QUERY,
  CATALOGO_WEB_PRODUCTO_POR_ID_QUERY,
  SUSCRIBIR_NEWSLETTER_MUTATION,
} from '../graphql/catalogo-web.graphql';
import { buscarCategoriaMenu } from '../data/menu-categorias.data';
import {
  CategoriaCatalogo,
  CategoriaCatalogoGql,
  ProductoCatalogo,
  ProductoCatalogoGql,
} from '../models/producto.model';
import { mapCategoriaCatalogo, mapProductoCatalogo } from './productos.mapper';

interface CatalogoProductosData {
  catalogoWebProductos: ProductoCatalogoGql[];
}

interface CatalogoMasCompradosData {
  catalogoWebProductosMasComprados: ProductoCatalogoGql[];
}

interface CatalogoProductoData {
  catalogoWebProductoPorId: ProductoCatalogoGql | null;
}

interface CatalogoCategoriasData {
  catalogoWebCategorias: CategoriaCatalogoGql[];
}

interface CatalogoCategoriasNavData {
  catalogoWebCategoriasNav: CategoriaCatalogoGql[];
}

export interface SuscripcionNewsletterResultado {
  mensaje: string;
  email: string;
  nombre?: string | null;
}

/**
 * Catálogo de la tienda: productos y categorías publicados por el backend.
 * Navegable sin cuenta; el filtro de categoría/texto se envía al API.
 */
@Service()
export class ProductosService {
  private readonly graphql = inject(GraphqlService);

  private readonly productos = signal<readonly ProductoCatalogo[]>([]);
  private readonly masCompradosLista = signal<readonly ProductoCatalogo[]>([]);
  private readonly cargandoMasComprados = signal(false);
  private readonly errorMasComprados = signal<string | null>(null);
  private readonly categorias = signal<readonly CategoriaCatalogo[]>([]);
  private readonly categoriasNav = signal<readonly CategoriaCatalogo[]>([]);
  private readonly categoriasNavListas = signal(false);
  private readonly errorNav = signal<string | null>(null);
  private readonly cargando = signal(false);
  private readonly error = signal<string | null>(null);
  private masCompradosCargado = false;
  private masCompradosEnCurso = false;
  private readonly filtroTexto = signal('');
  private readonly categoriaId = signal<number | null>(null);
  private cargado = false;
  private categoriasConsultadas = false;
  private navConsultada = false;
  private navEnCurso = false;
  private cargaSeq = 0;
  private pedidoFilter: string | null = null;
  private pedidoIdCategoria: number | null = null;
  private ultimoFilterApi: string | null = null;
  private ultimoIdCategoriaApi: number | null = null;

  readonly todos = this.productos.asReadonly();
  readonly masComprados = this.masCompradosLista.asReadonly();
  readonly estaCargandoMasComprados = this.cargandoMasComprados.asReadonly();
  readonly mensajeErrorMasComprados = this.errorMasComprados.asReadonly();
  readonly categoriasLista = this.categorias.asReadonly();
  readonly categoriasNavLista = this.categoriasNav.asReadonly();
  readonly categoriasNavCargadas = this.categoriasNavListas.asReadonly();
  readonly mensajeErrorCategorias = this.errorNav.asReadonly();
  readonly estaCargando = this.cargando.asReadonly();
  readonly mensajeError = this.error.asReadonly();
  readonly busqueda = this.filtroTexto.asReadonly();
  readonly categoriaSeleccionada = this.categoriaId.asReadonly();

  readonly categoriaActiva = computed(() => {
    const id = this.categoriaId();
    if (id == null) {
      return null;
    }
    return (
      buscarCategoriaMenu(id) ?? this.categorias().find((c) => c.id === id) ?? null
    );
  });

  readonly filtrados = computed(() => {
    // El API ya filtra por idCategoria + filter; mantenemos un pase local por si
    // la grilla reutiliza un caché completo (p. ej. inicio sin categoría).
    const termino = this.filtroTexto().trim().toLowerCase();
    const categoriaId = this.categoriaId();
    const menu = buscarCategoriaMenu(categoriaId);
    return this.productos().filter((producto) => {
      const coincideCategoria =
        categoriaId == null ||
        producto.categoria?.id === categoriaId ||
        producto.categoria?.padre?.id === categoriaId ||
        (menu != null &&
          (producto.categoria?.nombre?.toLowerCase() === menu.nombre.toLowerCase() ||
            producto.categoria?.padre?.nombre?.toLowerCase() === menu.nombre.toLowerCase()));
      if (!coincideCategoria) {
        return false;
      }
      if (!termino) {
        return true;
      }
      const haystack = [
        producto.nombre,
        producto.descripcion ?? '',
        producto.codigo,
        producto.categoria?.nombre ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(termino);
    });
  });

  readonly total = computed(() => this.filtrados().length);

  /** Carga el ranking de más comprados para la home. */
  cargarMasComprados(limite = 12, forzar = false): void {
    if ((this.masCompradosCargado || this.masCompradosEnCurso) && !forzar) {
      return;
    }
    this.masCompradosEnCurso = true;
    this.cargandoMasComprados.set(true);
    this.errorMasComprados.set(null);
    this.graphql
      .query<CatalogoMasCompradosData>(CATALOGO_WEB_PRODUCTOS_MAS_COMPRADOS_QUERY, { limite })
      .pipe(
        map((data) => (data.catalogoWebProductosMasComprados ?? []).map(mapProductoCatalogo)),
        catchError((err: unknown) => {
          this.errorMasComprados.set(mensajeError(err, 'No se pudieron cargar los más comprados'));
          return of([] as ProductoCatalogo[]);
        }),
      )
      .subscribe((lista) => {
        this.masCompradosLista.set(lista);
        this.cargandoMasComprados.set(false);
        this.masCompradosEnCurso = false;
        this.masCompradosCargado = true;
      });
  }

  /**
   * Carga el catálogo. Si cambian `filter` o `idCategoria`, vuelve a consultar el API.
   * `forzar` ignora el caché.
   */
  cargar(opciones?: { filter?: string; idCategoria?: number | null; forzar?: boolean }): void {
    const filter = opciones?.filter?.trim() || this.filtroTexto().trim() || null;
    const idCategoria =
      opciones && 'idCategoria' in opciones
        ? (opciones.idCategoria ?? null)
        : this.categoriaId();
    // El menú de la tienda es fijo: no enviar esos ids al API.
    const idCategoriaApi = buscarCategoriaMenu(idCategoria) ? null : idCategoria;

    const mismosParametros =
      this.ultimoFilterApi === filter && this.ultimoIdCategoriaApi === idCategoriaApi;
    const mismoPedido =
      this.pedidoFilter === filter && this.pedidoIdCategoria === idCategoriaApi;

    if ((this.cargado && !opciones?.forzar && mismosParametros) || (this.cargando() && mismoPedido)) {
      return;
    }

    const seq = ++this.cargaSeq;
    this.pedidoFilter = filter;
    this.pedidoIdCategoria = idCategoriaApi;
    this.cargando.set(true);
    this.error.set(null);

    this.graphql
      .query<CatalogoProductosData>(CATALOGO_WEB_PRODUCTOS_QUERY, {
        filter,
        idCategoria: idCategoriaApi != null ? String(idCategoriaApi) : null,
      })
      .pipe(
        map((data) => (data.catalogoWebProductos ?? []).map(mapProductoCatalogo)),
        catchError((err: unknown) => {
          this.error.set(mensajeError(err, 'No se pudo cargar el catálogo'));
          return of([] as ProductoCatalogo[]);
        }),
      )
      .subscribe((lista) => {
        if (seq !== this.cargaSeq) {
          return;
        }
        this.productos.set(lista);
        this.cargando.set(false);
        this.cargado = true;
        this.ultimoFilterApi = filter;
        this.ultimoIdCategoriaApi = idCategoriaApi;
      });

    this.cargarCategorias();
  }

  cargarCategorias(forzar = false): void {
    if ((this.categoriasConsultadas || this.categorias().length > 0) && !forzar) {
      return;
    }
    this.graphql
      .query<CatalogoCategoriasData>(CATALOGO_WEB_CATEGORIAS_QUERY)
      .pipe(
        map((data) => (data.catalogoWebCategorias ?? []).map(mapCategoriaCatalogo)),
        catchError(() => of([] as CategoriaCatalogo[])),
      )
      .subscribe((lista) => {
        this.categorias.set(lista);
        this.categoriasConsultadas = true;
      });
  }

  /** Familias y subcategorías activas, las mismas que carga el escritorio. */
  cargarCategoriasNav(forzar = false): void {
    if ((this.navConsultada || this.navEnCurso) && !forzar) {
      return;
    }
    this.navEnCurso = true;
    this.errorNav.set(null);
    this.graphql
      .query<CatalogoCategoriasNavData>(CATALOGO_WEB_CATEGORIAS_NAV_QUERY)
      .pipe(
        map((data) => (data.catalogoWebCategoriasNav ?? []).map(mapCategoriaCatalogo)),
        catchError((err: unknown) => {
          this.errorNav.set(mensajeError(err, 'No se pudieron cargar las categorías'));
          return of([] as CategoriaCatalogo[]);
        }),
      )
      .subscribe((lista) => {
        this.categoriasNav.set(lista);
        this.navEnCurso = false;
        this.navConsultada = true;
        this.categoriasNavListas.set(true);
      });
  }

  porId(id: number | string): Observable<ProductoCatalogo | null> {
    const numerico = typeof id === 'number' ? id : Number(id);
    const enCache = this.productos().find((p) => p.id === numerico);
    if (enCache) {
      return of(enCache);
    }
    return this.graphql
      .query<CatalogoProductoData>(CATALOGO_WEB_PRODUCTO_POR_ID_QUERY, { id: String(id) })
      .pipe(
        map((data) =>
          data.catalogoWebProductoPorId ? mapProductoCatalogo(data.catalogoWebProductoPorId) : null,
        ),
        tap((producto) => {
          if (producto) {
            this.productos.update((actuales) => {
              if (actuales.some((p) => p.id === producto.id)) {
                return actuales;
              }
              return [...actuales, producto];
            });
          }
        }),
        catchError((err: unknown) => {
          this.error.set(mensajeError(err, 'No se pudo cargar el producto'));
          return of(null);
        }),
      );
  }

  setBusqueda(termino: string): void {
    this.filtroTexto.set(termino);
  }

  setCategoria(id: number | null): void {
    this.categoriaId.set(id);
  }

  /** Aplica búsqueda + categoría y recarga desde el API. */
  aplicarFiltros(opciones: { filter?: string; idCategoria?: number | null }): void {
    if ('filter' in opciones) {
      this.filtroTexto.set(opciones.filter?.trim() ?? '');
    }
    if ('idCategoria' in opciones) {
      this.categoriaId.set(opciones.idCategoria ?? null);
    }
    const filter = this.filtroTexto().trim() || null;
    const idCategoria = this.categoriaId();
    const yaCargado =
      this.cargado && this.ultimoFilterApi === filter && this.ultimoIdCategoriaApi === idCategoria;
    this.cargar({
      filter: this.filtroTexto(),
      idCategoria,
      forzar: !yaCargado,
    });
  }

  suscribirNewsletter(email: string, nombre?: string): Observable<SuscripcionNewsletterResultado> {
    return this.graphql
      .mutate<{
        suscribirNewsletter: SuscripcionNewsletterResultado & {
          id_suscripcion?: number;
          activo?: boolean;
        };
      }>(SUSCRIBIR_NEWSLETTER_MUTATION, {
        input: { email: email.trim(), nombre: nombre?.trim() || null },
      })
      .pipe(
        map((data) => ({
          mensaje: data.suscribirNewsletter.mensaje,
          email: data.suscribirNewsletter.email,
          nombre: data.suscribirNewsletter.nombre,
        })),
      );
  }
}

function mensajeError(err: unknown, fallback: string): string {
  if (err instanceof GraphqlRequestError) {
    return err.message;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}
