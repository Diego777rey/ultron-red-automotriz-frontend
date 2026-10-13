import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MARCAS } from '../../data/marcas.data';
import { ProductoCardComponent } from '../../../productos/components/producto-card/producto-card';
import { ProductosFiltrosComponent } from '../../../productos/components/productos-filtros/productos-filtros';
import { ProductoDiagrama } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';

/**
 * Página de la marca (`/marcas/<slug>`): lo que el comprador ve al tocar
 * una marca. Muestra las tarjetas de diagramas con su precio y filtra
 * por modelo y año para encontrar el artículo exacto.
 */
@Component({
  selector: 'app-marca-detalle',
  imports: [RouterLink, ProductoCardComponent, ProductosFiltrosComponent],
  template: `
    <div class="marca-detalle">
      @if (marca(); as marca) {
        <nav class="marca-detalle__migas" aria-label="Migas de pan">
          <a routerLink="/">Todas las marcas</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ marca.nombre }}</span>
        </nav>
        <h1>Diagramas eléctricos para {{ marca.nombre }}</h1>
        <p class="marca-detalle__descripcion">
          Diagramas de ECU, tableros, inmovilizadores, airbag y pinouts. Filtrá por modelo y año
          para encontrar el artículo exacto de tu vehículo.
        </p>
        <app-productos-filtros
          [modelos]="modelos()"
          [anios]="anios()"
          [(modelo)]="modelo"
          [(anio)]="anio"
        />
        <p class="marca-detalle__conteo" role="status">
          @if (filtrados().length === 0) {
            No se encontraron diagramas con esos filtros.
          } @else if (filtrados().length === 1) {
            1 diagrama disponible.
          } @else {
            {{ filtrados().length }} diagramas disponibles.
          }
        </p>
        @if (filtrados().length > 0) {
          <ul class="marca-detalle__grilla">
            @for (producto of filtrados(); track producto.id) {
              <li>
                <app-producto-card [producto]="producto" (agregar)="alAgregar($event)" />
              </li>
            }
          </ul>
        } @else if (tieneFiltros()) {
          <p class="marca-detalle__vacio">
            Probá con otro modelo u otro año, o
            <button class="marca-detalle__enlace" type="button" (click)="limpiarFiltros()">
              limpiá los filtros
            </button>
            para ver todo el catálogo de {{ marca.nombre }}.
          </p>
        } @else {
          <p class="marca-detalle__vacio">
            Todavía no hay diagramas cargados para {{ marca.nombre }}. Volvé pronto o pedilos en
            Atención al Cliente.
          </p>
        }
        @if (confirmacion(); as confirmacion) {
          <p class="marca-detalle__confirmacion" role="status">{{ confirmacion }}</p>
        }
        <p class="marca-detalle__vendedor">
          ¿Vendés diagramas?
          <a routerLink="/vendedor">Cargalos en el panel del vendedor</a> y aparecen acá enseguida.
        </p>
      } @else {
        <h1>Marca no encontrada</h1>
        <p class="marca-detalle__vacio">
          Esa marca no está en el catálogo. <a routerLink="/">Volvé a todas las marcas</a>.
        </p>
      }
    </div>
  `,
  styleUrl: './marca-detalle.scss',
})
export class MarcaDetalleComponent {
  readonly slug = input.required<string>();

  private readonly productosService = inject(ProductosService);

  protected readonly marca = computed(() => MARCAS.find((marca) => marca.slug === this.slug()));

  protected readonly modelo = signal('');
  protected readonly anio = signal<number | null>(null);
  protected readonly confirmacion = signal<string | null>(null);

  private readonly deLaMarca = computed(() =>
    this.productosService.todos().filter((producto) => producto.marcaSlug === this.slug()),
  );

  protected readonly modelos = computed(() =>
    [...new Set(this.deLaMarca().map((producto) => producto.modelo))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    ),
  );

  protected readonly anios = computed(() => {
    const anios = this.deLaMarca().flatMap((producto) =>
      Array.from(
        { length: producto.anioHasta - producto.anioDesde + 1 },
        (_, i) => producto.anioDesde + i,
      ),
    );
    return [...new Set(anios)].sort((a, b) => a - b);
  });

  protected readonly filtrados = computed(() => {
    const modelo = this.modelo();
    const anio = this.anio();
    return this.deLaMarca().filter(
      (producto) =>
        (modelo === '' || producto.modelo === modelo) &&
        (anio === null || (producto.anioDesde <= anio && anio <= producto.anioHasta)),
    );
  });

  protected tieneFiltros(): boolean {
    return this.modelo() !== '' || this.anio() !== null;
  }

  protected limpiarFiltros(): void {
    this.modelo.set('');
    this.anio.set(null);
  }

  protected alAgregar(producto: ProductoDiagrama): void {
    this.confirmacion.set(
      `Prototipo: “${producto.titulo}” se agregaría al carrito (todavía no hay carrito).`,
    );
  }
}
