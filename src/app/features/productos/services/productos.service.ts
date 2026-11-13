import { computed, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { GraphqlRequestError, GraphqlService } from '../../../core/graphql/graphql.service';
import {
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

export interface SuscripcionNewsletterResultado {
  mensaje: string;
  email: string;
  nombre?: string | null;
}

/**
 * Catálogo de la tienda: productos y categorías publicados por el backend.
 */
@Service()
export class ProductosService {
  private readonly graphql = inject(GraphqlService);

  private readonly productos = signal<readonly ProductoCatalogo[]>([]);
  private readonly categorias = signal<readonly CategoriaCatalogo[]>([]);
  private readonly cargando = signal(false);
  private readonly error = signal<string | null>(null);
  private readonly filtroTexto = signal('');
  private readonly categoriaId = signal<number | null>(null);
  private cargado = false;

  readonly todos = this.productos.asReadonly();
  readonly categoriasLista = this.categorias.asReadonly();
  readonly estaCargando = this.cargando.asReadonly();
  readonly mensajeError = this.error.asReadonly();
  readonly busqueda = this.filtroTexto.asReadonly();
  readonly categoriaSeleccionada = this.categoriaId.asReadonly();

  readonly filtrados = computed(() => {
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

  readonly total = computed(() => this.filtrados().length);

  /** Carga el catálogo (idempotente). `forzar` vuelve a pedir al API. */
  cargar(opciones?: { filter?: string; forzar?: boolean }): void {
    if (this.cargado && !opciones?.forzar && !opciones?.filter) {
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    const filter = opciones?.filter?.trim() || null;

    this.graphql
      .query<CatalogoProductosData>(CATALOGO_WEB_PRODUCTOS_QUERY, { filter })
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
        if (!filter) {
          this.cargado = true;
        }
      });

    this.cargarCategorias();
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
