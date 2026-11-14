import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { CategoriaChipsComponent } from '../../components/categoria-chips/categoria-chips';
import { ProductoCardComponent } from '../../components/producto-card/producto-card';
import { ProductoCatalogo } from '../../models/producto.model';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos-lista',
  imports: [RouterLink, ProductoCardComponent, CategoriaChipsComponent],
  template: `
    <div class="productos-lista">
      <nav class="productos-lista__migas" aria-label="Migas de pan">
        <a routerLink="/">Inicio</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{{ titulo() }}</span>
      </nav>
      <h1>{{ titulo() }}</h1>
      @if (productos.busqueda(); as q) {
        <p class="productos-lista__busqueda">Resultados para “{{ q }}”</p>
      }

      @if (productos.categoriasLista().length > 0) {
        <app-categoria-chips
          [categorias]="productos.categoriasLista()"
          [categoriaId]="productos.categoriaSeleccionada()"
          (categoriaIdChange)="cambiarCategoria($event)"
        />
      }

      @if (productos.estaCargando()) {
        <p role="status">Cargando productos…</p>
      } @else if (productos.filtrados().length === 0) {
        <p>No hay productos que coincidan con tu búsqueda.</p>
        <a routerLink="/">Volver al inicio</a>
      } @else {
        <p class="productos-lista__conteo" role="status">
          {{ productos.total() }}
          {{ productos.total() === 1 ? 'producto' : 'productos' }}
        </p>
        <ul class="productos-lista__grilla">
          @for (producto of productos.filtrados(); track producto.id) {
            <li>
              <app-producto-card [producto]="producto" (agregar)="alAgregar($event)" />
            </li>
          }
        </ul>
      }
    </div>
  `,
  styleUrl: './productos-lista.scss',
})
export class ProductosListaComponent {
  protected readonly productos = inject(ProductosService);
  private readonly carrito = inject(CarritoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly query = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => ({
        q: params.get('q')?.trim() ?? '',
        categoria: parseCategoria(params.get('categoria')),
      })),
    ),
    { initialValue: { q: '', categoria: null as number | null } },
  );

  protected readonly titulo = computed(() => {
    const categoria = this.productos.categoriaActiva();
    return categoria ? categoria.nombre : 'Productos';
  });

  constructor() {
    effect(() => {
      const { q, categoria } = this.query();
      this.productos.aplicarFiltros({ filter: q, idCategoria: categoria });
    });
  }

  protected cambiarCategoria(id: number | null): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.query().q || null,
        categoria: id,
      },
      queryParamsHandling: 'merge',
    });
  }

  protected alAgregar(producto: ProductoCatalogo): void {
    this.carrito.agregar(producto);
  }
}

function parseCategoria(raw: string | null): number | null {
  if (!raw) {
    return null;
  }
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}
