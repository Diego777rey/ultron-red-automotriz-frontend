import { computed, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { GraphqlRequestError, GraphqlService } from '../../../core/graphql/graphql.service';
import {
  CATALOGO_WEB_CATEGORIAS_NAV_QUERY,
  CATALOGO_WEB_CATEGORIAS_QUERY,
  CATALOGO_WEB_PRODUCTOS_QUERY,
  CATALOGO_WEB_PRODUCTO_POR_ID_QUERY,
  SUSCRIBIR_NEWSLETTER_MUTATION,
} from '../graphql/catalogo-web.graphql';
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
  private readonly categorias = signal<readonly CategoriaCatalogo[]>([]);
  private readonly categoriasNav = signal<readonly CategoriaCatalogo[]>([]);
  private readonly cargando = signal(false);
  private readonly error = signal<string | null>(null);
  private readonly filtroTexto = signal('');
  private readonly categoriaId = signal<number | null>(null);
  private cargado = false;
  private ultimoFilterApi: string | null = null;
  private ultimoIdCategoriaApi: number | null = null;

  readonly todos = this.productos.asReadonly();
  readonly categoriasLista = this.categorias.asReadonly();
  readonly categoriasNavLista = this.categoriasNav.asReadonly();
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
      this.categoriasNav().find((c) => c.id === id) ??
      this.categorias().find((c) => c.id === id) ??
      null
    );
  });

  readonly filtrados = computed(() => {
    // El API ya filtra por idCategoria + filter; mantenemos un pase local por si
    // la grilla reutiliza un caché completo (p. ej. inicio sin categoría).
    const termino = this.filtroTexto().trim().toLowerCase();
    const categoriaId = this.categoriaId();
    return this.productos().filter((producto) => {
      const coincideCategoria =
        categoriaId == null ||
        producto.categoria?.id === categoriaId ||
        producto.categoria?.padre?.id === categoriaId;
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

  readonly destacados = computed(() => this.filtrados().slice(0, 8));

  readonly total = computed(() => this.filtrados().length);

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

    const mismosParametros =
      this.cargado &&
      !opciones?.forzar &&
      this.ultimoFilterApi === filter &&
      this.ultimoIdCategoriaApi === idCategoria;

    if (mismosParametros) {
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.graphql
      .query<CatalogoProductosData>(CATALOGO_WEB_PRODUCTOS_QUERY, {
        filter,
        idCategoria: idCategoria != null ? String(idCategoria) : null,
      })
      .pipe(
        map((data) => (data.catalogoWebProductos ?? []).map(mapProductoCatalogo)),
        catchError((err: unknown) => {
          this.error.set(mensajeError(err, 'No se pudo cargar el catálogo'));
          return of([] as ProductoCatalogo[]);
        }),
      )
      .subscribe((lista) => {
        this.productos.set(lista);
        this.cargando.set(false);
        this.cargado = true;
        this.ultimoFilterApi = filter;
        this.ultimoIdCategoriaApi = idCategoria;
      });

    this.cargarCategorias();
    this.cargarCategoriasNav();
  }

  cargarCategorias(forzar = false): void {
    if (this.categorias().length > 0 && !forzar) {
      return;
    }
    this.graphql
      .query<CatalogoCategoriasData>(CATALOGO_WEB_CATEGORIAS_QUERY)
      .pipe(
        map((data) => (data.catalogoWebCategorias ?? []).map(mapCategoriaCatalogo)),
        catchError(() => of([] as CategoriaCatalogo[])),
      )
      .subscribe((lista) => this.categorias.set(lista));
  }

  /** Departamentos raíz para la barra de categorías (siempre públicos). */
  cargarCategoriasNav(forzar = false): void {
    if (this.categoriasNav().length > 0 && !forzar) {
      return;
    }
    this.graphql
      .query<CatalogoCategoriasNavData>(CATALOGO_WEB_CATEGORIAS_NAV_QUERY)
      .pipe(
        map((data) => (data.catalogoWebCategoriasNav ?? []).map(mapCategoriaCatalogo)),
        catchError(() => of([] as CategoriaCatalogo[])),
      )
      .subscribe((lista) => this.categoriasNav.set(lista));
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
    this.cargar({
      filter: this.filtroTexto(),
      idCategoria: this.categoriaId(),
      forzar: true,
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
