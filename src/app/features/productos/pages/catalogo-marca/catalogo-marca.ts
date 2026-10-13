import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MARCAS } from '../../../marcas/data/marcas.data';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-catalogo-marca',
  imports: [CurrencyPipe, RouterLink, MatAnchor, MatButton, MatCard, MatIcon],
  template: `
    @if (marca(); as marcaActual) {
      <section class="catalogo" [attr.aria-labelledby]="'titulo-catalogo'">
        <nav class="catalogo__migas" aria-label="Migas de pan">
          <a routerLink="/">Marcas</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ marcaActual.nombre }}</span>
        </nav>

        <div class="catalogo__encabezado">
          <div>
            <p class="catalogo__eyebrow">Diagramas disponibles</p>
            <h1 id="titulo-catalogo">{{ marcaActual.nombre }}</h1>
            <p>Filtrá por modelo y año para encontrar el diagrama exacto de tu vehículo.</p>
          </div>
          <a mat-stroked-button routerLink="/vendedor/productos/nuevo">
            <mat-icon>add</mat-icon>
            Publicar producto
          </a>
        </div>

        <form class="catalogo__filtros" aria-label="Filtros del catálogo">
          <label>
            <span>Modelo</span>
            <select [value]="modeloSeleccionado()" (change)="cambiarModelo($event)">
              <option value="">Todos los modelos</option>
              @for (modelo of modelos(); track modelo) {
                <option [value]="modelo">{{ modelo }}</option>
              }
            </select>
          </label>

          <label>
            <span>Año</span>
            <select [value]="anioSeleccionado()" (change)="cambiarAnio($event)">
              <option value="">Todos los años</option>
              @for (anio of anios(); track anio) {
                <option [value]="anio">{{ anio }}</option>
              }
            </select>
          </label>

          <button mat-button type="button" (click)="limpiarFiltros()">Limpiar filtros</button>
        </form>

        <div class="catalogo__resumen" aria-live="polite">
          <strong>{{ productosFiltrados().length }}</strong>
          {{ productosFiltrados().length === 1 ? 'resultado' : 'resultados' }}
        </div>

        @if (productosFiltrados().length) {
          <ul class="catalogo__grid">
            @for (producto of productosFiltrados(); track producto.id) {
              <li>
                <mat-card class="producto">
                  <div class="producto__icono" aria-hidden="true">
                    <mat-icon fontSet="material-icons-outlined">description</mat-icon>
                  </div>
                  <div class="producto__contenido">
                    <div class="producto__meta">
                      <span>{{ producto.categoria }}</span>
                      @if (producto.publicadoPorVendedor) {
                        <span>Nuevo</span>
                      }
                    </div>
                    <h2>{{ producto.nombre }}</h2>
                    <p class="producto__compatibilidad">
                      {{ producto.modelo }} · {{ producto.anio }}
                    </p>
                    <p>{{ producto.descripcion }}</p>
                    <div class="producto__compra">
                      <strong>{{ producto.precio | currency: 'ARS' : 'symbol-narrow' : '1.0-0' }}</strong>
                      <button mat-flat-button type="button" (click)="agregarAlCarrito(producto.nombre)">
                        Comprar
                      </button>
                    </div>
                  </div>
                </mat-card>
              </li>
            }
          </ul>
        } @else {
          <div class="catalogo__vacio">
            <mat-icon fontSet="material-icons-outlined" aria-hidden="true">search_off</mat-icon>
            <h2>No encontramos coincidencias</h2>
            <p>Probá otra combinación de modelo y año.</p>
            <button mat-stroked-button type="button" (click)="limpiarFiltros()">
              Ver todos los productos
            </button>
          </div>
        }

        <p class="catalogo__estado" role="status">{{ mensajeCarrito() }}</p>
      </section>
    } @else {
      <section class="catalogo__vacio">
        <h1>Marca no encontrada</h1>
        <p>La marca solicitada no forma parte del catálogo.</p>
        <a mat-flat-button routerLink="/">Volver a las marcas</a>
      </section>
    }
  `,
  styleUrl: './catalogo-marca.scss',
})
export class CatalogoMarcaComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productosService = inject(ProductosService);
  private readonly parametros = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  protected readonly marca = computed(() => {
    const slug = this.parametros().get('slug');
    return MARCAS.find((marca) => marca.slug === slug);
  });
  protected readonly modeloSeleccionado = signal('');
  protected readonly anioSeleccionado = signal('');
  protected readonly mensajeCarrito = signal('');
  private readonly productosMarca = computed(() => {
    const slug = this.marca()?.slug;
    return this.productosService.productos().filter((producto) => producto.marcaSlug === slug);
  });
  protected readonly modelos = computed(() =>
    [...new Set(this.productosMarca().map((producto) => producto.modelo))].sort(),
  );
  protected readonly anios = computed(() =>
    [...new Set(this.productosMarca().map((producto) => producto.anio))].sort((a, b) => b - a),
  );
  protected readonly productosFiltrados = computed(() => {
    const modelo = this.modeloSeleccionado();
    const anio = Number(this.anioSeleccionado());
    return this.productosMarca().filter(
      (producto) =>
        (!modelo || producto.modelo === modelo) && (!anio || producto.anio === anio),
    );
  });

  protected cambiarModelo(evento: Event): void {
    this.modeloSeleccionado.set((evento.target as HTMLSelectElement).value);
  }

  protected cambiarAnio(evento: Event): void {
    this.anioSeleccionado.set((evento.target as HTMLSelectElement).value);
  }

  protected limpiarFiltros(): void {
    this.modeloSeleccionado.set('');
    this.anioSeleccionado.set('');
  }

  protected agregarAlCarrito(nombre: string): void {
    this.mensajeCarrito.set(`${nombre} se agregó al carrito de demostración.`);
  }
}
