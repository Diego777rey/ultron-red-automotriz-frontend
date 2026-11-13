import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { ProductoCatalogo } from '../../models/producto.model';
import { formatearGs, precioUnitario } from '../../services/productos.mapper';
import { ProductosService } from '../../services/productos.service';

type EstadoProducto =
  | { cargando: true; producto: null }
  | { cargando: false; producto: ProductoCatalogo | null };

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, MatButton, MatFormField, MatLabel, MatSelect, MatOption],
  template: `
    <div class="detalle">
      @if (estado().cargando) {
        <p role="status">Cargando producto…</p>
      } @else if (estado().producto; as producto) {
        <nav class="detalle__migas" aria-label="Migas de pan">
          <a routerLink="/">Inicio</a>
          <span aria-hidden="true">/</span>
          <a routerLink="/productos">Productos</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ producto.nombre }}</span>
        </nav>

        <div class="detalle__layout">
          <div class="detalle__media">
            @if (producto.imagenUrl) {
              <img
                [src]="producto.imagenUrl"
                [alt]="producto.nombre"
                width="640"
                height="480"
                decoding="async"
              />
            } @else {
              <div class="detalle__sin-imagen">Sin imagen</div>
            }
          </div>

          <div class="detalle__info">
            @if (producto.categoria; as categoria) {
              <p class="detalle__categoria">{{ categoria.nombre }}</p>
            }
            <h1>{{ producto.nombre }}</h1>
            <p class="detalle__codigo">Código: {{ producto.codigo }}</p>
            <p class="detalle__precio">{{ precioFormateado() }}</p>
            @if (producto.descripcion) {
              <p class="detalle__descripcion">{{ producto.descripcion }}</p>
            }

            @if (producto.presentaciones.length > 0) {
              <mat-form-field class="detalle__presentacion" subscriptSizing="dynamic">
                <mat-label>Presentación</mat-label>
                <mat-select
                  [value]="presentacionId()"
                  (valueChange)="presentacionId.set($event)"
                  aria-label="Elegir presentación"
                >
                  <mat-option [value]="null">Precio de lista</mat-option>
                  @for (presentacion of producto.presentaciones; track presentacion.id) {
                    <mat-option [value]="presentacion.id">
                      {{ presentacion.descripcion }}
                      @if (presentacion.precio) {
                        — {{ formatear(presentacion.precio) }}
                      }
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>
            }

            <div class="detalle__acciones">
              <button matButton="filled" type="button" (click)="agregar(producto)">
                Agregar al carrito
              </button>
              <a matButton routerLink="/carrito">Ir al carrito</a>
            </div>

            @if (confirmacion(); as texto) {
              <p class="detalle__confirmacion" role="status">{{ texto }}</p>
            }
          </div>
        </div>
      } @else {
        <h1>Producto no encontrado</h1>
        <p>Ese producto no está publicado en la tienda.</p>
        <a matButton="filled" routerLink="/productos">Ver productos</a>
      }
    </div>
  `,
  styleUrl: './producto-detalle.scss',
})
export class ProductoDetalleComponent {
  /** Route param `/productos/:id`. */
  readonly id = input.required<string>();

  private readonly productosService = inject(ProductosService);
  private readonly carrito = inject(CarritoService);

  protected readonly estado = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.productosService.porId(id).pipe(
          map(
            (producto): EstadoProducto => ({
              cargando: false,
              producto,
            }),
          ),
          startWith({ cargando: true, producto: null } satisfies EstadoProducto),
        ),
      ),
    ),
    { initialValue: { cargando: true, producto: null } satisfies EstadoProducto },
  );

  protected readonly presentacionId = signal<number | null>(null);
  protected readonly confirmacion = signal<string | null>(null);

  protected readonly precioFormateado = computed(() => {
    const producto = this.estado().producto;
    if (!producto) {
      return '';
    }
    return formatearGs(precioUnitario(producto, this.presentacionId()));
  });

  protected formatear(monto: number): string {
    return formatearGs(monto);
  }

  protected agregar(producto: ProductoCatalogo): void {
    const presentacionId = this.presentacionId();
    const presentacion =
      presentacionId == null
        ? null
        : (producto.presentaciones.find((p) => p.id === presentacionId) ?? null);
    this.carrito.agregar(producto, { presentacion });
    this.confirmacion.set(`“${producto.nombre}” se agregó al carrito.`);
  }
}
