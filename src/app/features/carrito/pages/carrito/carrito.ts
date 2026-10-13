import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink, MatButton],
  template: `
    <div class="carrito">
      <h1>Mi carrito</h1>
      @if (carrito.vacio()) {
        <p>Tu carrito está vacío. Elegí una marca y agregá diagramas.</p>
        <a matButton="filled" routerLink="/">Ver marcas</a>
      } @else {
        <ul class="carrito__lista">
          @for (linea of carrito.items(); track linea.productoId) {
            <li class="carrito__linea">
              <div>
                <strong>{{ linea.producto.titulo }}</strong>
                <p>{{ linea.producto.modelo }} · Gs. {{ linea.producto.precio.toLocaleString('es-PY') }}</p>
              </div>
              <div class="carrito__acciones">
                <button
                  matButton
                  type="button"
                  (click)="carrito.actualizarCantidad(linea.productoId, linea.cantidad - 1)"
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span aria-live="polite">{{ linea.cantidad }}</span>
                <button
                  matButton
                  type="button"
                  (click)="carrito.actualizarCantidad(linea.productoId, linea.cantidad + 1)"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
                <button matButton type="button" (click)="carrito.quitar(linea.productoId)">Quitar</button>
              </div>
            </li>
          }
        </ul>
        <p class="carrito__total">
          Total: <strong>Gs. {{ carrito.subtotal().toLocaleString('es-PY') }}</strong>
        </p>
        <a matButton="filled" routerLink="/checkout">Ir a pagar</a>
      }
    </div>
  `,
  styleUrl: './carrito.scss',
})
export class CarritoComponent {
  protected readonly carrito = inject(CarritoService);
}
