import { Component, computed, effect, signal, viewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { PRODUCTOS_MOCK } from '../../data/productos.data';
import { MARCAS } from '../../data/marcas.data';
import { Producto } from '../../models/producto.model';
import { ProductoCardComponent } from '../../components/producto-card/producto-card';
import { FiltrosProductoComponent, FiltrosProducto } from '../../components/filtros-producto/filtros-producto';

@Component({
  selector: 'app-productos-marca',
  imports: [RouterLink, MatIcon, MatButton, ProductoCardComponent, FiltrosProductoComponent],
  template: `
    <div class="productos-marca">
      @if (marca(); as marca) {
        <div class="productos-marca__header">
          <a routerLink="/" mat-icon-button aria-label="Volver al inicio">
            <mat-icon>arrow_back</mat-icon>
          </a>
          <h1>{{ marca.nombre }}</h1>
        </div>

        <p class="productos-marca__descripcion">
          Diagramas eléctricos disponibles para {{ marca.nombre }}
        </p>

        <app-filtros-producto
          (filtrosChange)="aplicarFiltros($event)"
        />

        @if (productosFiltrados().length > 0) {
          <div class="productos-marca__grid">
            @for (producto of productosFiltrados(); track producto.id) {
              <app-producto-card [producto]="producto" />
            }
          </div>
        } @else {
          <div class="productos-marca__vacio">
            <mat-icon>search_off</mat-icon>
            <p>No se encontraron productos con los filtros seleccionados</p>
            <button mat-stroked-button (click)="limpiarFiltros()">
              Limpiar filtros
            </button>
          </div>
        }
      } @else {
        <div class="productos-marca__error">
          <mat-icon>error_outline</mat-icon>
          <p>Marca no encontrada</p>
          <a routerLink="/" mat-flat-button color="primary">
            Volver al inicio
          </a>
        </div>
      }
    </div>
  `,
  styleUrl: './productos-marca.scss',
})
export class ProductosMarcaComponent {
  private readonly route = signal(ActivatedRoute);
  private readonly filtrosComponent = viewChild(FiltrosProductoComponent);

  protected readonly slug = signal<string | null>(null);
  protected readonly filtros = signal<FiltrosProducto>({});

  protected readonly marca = computed(() => {
    const slugActual = this.slug();
    return slugActual ? MARCAS.find((m) => m.slug === slugActual) : undefined;
  });

  protected readonly todosLosProductos = computed(() => {
    const slugActual = this.slug();
    return slugActual ? PRODUCTOS_MOCK.filter((p) => p.marca === slugActual) : [];
  });

  protected readonly productosFiltrados = computed(() => {
    const productos = this.todosLosProductos();
    const filtrosActuales = this.filtros();

    return productos.filter((producto) => {
      if (filtrosActuales.modelo && producto.modelo !== filtrosActuales.modelo) {
        return false;
      }
      if (filtrosActuales.anio && producto.anio !== filtrosActuales.anio) {
        return false;
      }
      if (filtrosActuales.tipo && producto.tipo !== filtrosActuales.tipo) {
        return false;
      }
      return true;
    });
  });

  constructor(route: ActivatedRoute) {
    effect(() => {
      const params = route.snapshot.paramMap;
      this.slug.set(params.get('slug'));
    });

    effect(() => {
      const productos = this.todosLosProductos();
      const modelos = [...new Set(productos.map((p) => p.modelo))];
      const anios = [...new Set(productos.map((p) => p.anio))];

      const componente = this.filtrosComponent();
      if (componente) {
        componente.setModelos(modelos);
        componente.setAnios(anios);
      }
    });
  }

  protected aplicarFiltros(filtros: FiltrosProducto): void {
    this.filtros.set(filtros);
  }

  protected limpiarFiltros(): void {
    this.filtros.set({});
    const componente = this.filtrosComponent();
    if (componente) {
      componente.limpiarFiltros();
    }
  }
}
