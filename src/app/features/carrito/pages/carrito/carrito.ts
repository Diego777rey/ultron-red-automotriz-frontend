import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { formatearGs } from '../../../productos/services/productos.mapper';
import { claveLineaCarrito } from '../../models/linea-carrito.model';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, MatButton],
  template: `
    <div class="carrito">
      <h1>Mi carrito</h1>
      @if (carrito.vacio()) {
        <p>Tu carrito está vacío. Explorá el catálogo y agregá productos.</p>
        <a matButton="filled" routerLink="/productos">Ver productos</a>
      } @else {
        <ul class="carrito__lista">
          @for (linea of carrito.items(); track trackLinea(linea.productoId, linea.presentacionId)) {
            <li class="carrito__linea">
              <div class="carrito__producto">
                @if (linea.imagenUrl) {
                  <img
                    class="carrito__thumb"
                    [src]="linea.imagenUrl"
                    [alt]="''"
                    width="72"
                    height="72"
                    loading="lazy"
                  />
                }
                <div>
                  <strong>
                    <a [routerLink]="['/productos', linea.productoId]">{{ linea.nombre }}</a>
                  </strong>
                  @if (linea.presentacionDescripcion) {
                    <p>{{ linea.presentacionDescripcion }}</p>
                  }
                  <p>{{ formatear(linea.precio) }} c/u</p>
                </div>
              </div>
              <div class="carrito__acciones">
                <button
                  matButton
                  type="button"
                  (click)="
                    carrito.actualizarCantidad(
                      linea.productoId,
                      linea.presentacionId,
                      linea.cantidad - 1
                    )
                  "
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span aria-live="polite">{{ linea.cantidad }}</span>
                <button
                  matButton
                  type="button"
                  (click)="
                    carrito.actualizarCantidad(
                      linea.productoId,
                      linea.presentacionId,
                      linea.cantidad + 1
                    )
                  "
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
                <button
                  matButton
                  type="button"
                  (click)="carrito.quitar(linea.productoId, linea.presentacionId)"
                >
                  Quitar
                </button>
              </div>
            </li>
          }
        </ul>
        <p class="carrito__total">
          Total: <strong>{{ formatear(carrito.subtotal()) }}</strong>
        </p>
        <a matButton="filled" routerLink="/checkout">Ir a pagar</a>
      }
    </div>
  `,
  styleUrl: './carrito.scss',
})
export class CarritoComponent {
  protected readonly carrito = inject(CarritoService);

  protected formatear(monto: number): string {
    return formatearGs(monto);
  }

  protected trackLinea(productoId: number, presentacionId?: number | null): string {
    return claveLineaCarrito(productoId, presentacionId);
  }
}
