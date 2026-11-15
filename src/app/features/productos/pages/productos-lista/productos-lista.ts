import { Component, computed, effect, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { ProductoCardComponent } from '../../components/producto-card/producto-card';
import { ProductoCatalogo } from '../../models/producto.model';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos-lista',
  imports: [RouterLink, ProductoCardComponent],
  template: `
    <div class="productos-lista">
      <div class="productos-lista__catalogo">
        <nav class="productos-lista__migas" aria-label="Migas de pan">
          <a routerLink="/">Inicio</a>
          <span aria-hidden="true">/</span>
          @if (productos.categoriaActiva()?.padre; as padre) {
            <a routerLink="/productos" [queryParams]="{ categoria: padre.id }">{{ padre.nombre }}</a>
            <span aria-hidden="true">/</span>
          }
          <span aria-current="page">{{ titulo() }}</span>
        </nav>
        <h1>{{ titulo() }}</h1>
        @if (productos.busqueda(); as q) {
          <p class="productos-lista__busqueda">Resultados para “{{ q }}”</p>
        }

        @if (productos.estaCargando()) {
          <p role="status">Cargando productos…</p>
        } @else if (productos.mensajeError(); as error) {
          <p role="alert">{{ error }}</p>
        } @else if (productos.filtrados().length === 0) {
          <p>{{ mensajeVacio() }}</p>
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
    </div>
  `,
  styleUrl: './productos-lista.scss',
})
export class ProductosListaComponent {
  protected readonly productos = inject(ProductosService);
  private readonly carrito = inject(CarritoService);
  private readonly route = inject(ActivatedRoute);

  private readonly query = toSignal(
    this.route.queryParamMap.pipe(map((params) => leerConsulta(params))),
    { initialValue: leerConsulta(this.route.snapshot.queryParamMap) },
  );

  protected readonly titulo = computed(() => {
    const categoria = this.productos.categoriaActiva();
    return categoria ? categoria.nombre : 'Productos';
  });

  protected readonly mensajeVacio = computed(() =>
    this.productos.busqueda()
      ? 'No hay productos que coincidan con tu búsqueda.'
      : 'Todavía no hay productos publicados en la tienda.',
  );

  constructor() {
    effect(() => {
      const { q, categoria } = this.query();
      untracked(() => this.productos.aplicarFiltros({ filter: q, idCategoria: categoria }));
    });
  }

  protected alAgregar(producto: ProductoCatalogo): void {
    this.carrito.agregar(producto);
  }
}

function leerConsulta(params: { get(name: string): string | null }): {
  q: string;
  categoria: number | null;
} {
  return {
    q: params.get('q')?.trim() ?? '',
    categoria: parseCategoria(params.get('categoria')),
  };
}

function parseCategoria(raw: string | null): number | null {
  if (!raw) {
    return null;
  }
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}
