import { Component, inject } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { formatearGs } from '../../../productos/services/productos.mapper';
import { claveLineaCarrito } from '../../models/linea-carrito.model';
import { CarritoService } from '../../services/carrito.service';

/** Panel lateral del carrito (estilo tienda / Wix Stores). */
@Component({
  selector: 'app-carrito-drawer',
  imports: [RouterLink, MatButton, MatIconButton, MatIcon],
  template: `
    @if (carrito.panelAbierto()) {
      <div class="drawer-backdrop" (click)="carrito.cerrarPanel()" aria-hidden="true"></div>
      <aside
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrito-drawer-titulo"
        (keydown.escape)="carrito.cerrarPanel()"
      >
        <header class="drawer__cabecera">
          <h2 id="carrito-drawer-titulo">Mi carrito</h2>
          <button
            mat-icon-button
            type="button"
            aria-label="Cerrar carrito"
            (click)="carrito.cerrarPanel()"
          >
            <mat-icon fontSet="material-icons-outlined">close</mat-icon>
          </button>
        </header>

        @if (carrito.vacio()) {
          <p class="drawer__vacio">Todavía no agregaste productos.</p>
          <a
            matButton="filled"
            routerLink="/productos"
            (click)="carrito.cerrarPanel()"
          >
            Ver catálogo
          </a>
        } @else {
          <ul class="drawer__lista">
            @for (linea of carrito.items(); track track(linea.productoId, linea.presentacionId)) {
              <li class="drawer__linea">
                @if (linea.imagenUrl) {
                  <img
                    class="drawer__thumb"
                    [src]="linea.imagenUrl"
                    [alt]="''"
                    width="64"
                    height="64"
                    loading="lazy"
                  />
                }
                <div class="drawer__datos">
                  <a
                    [routerLink]="['/productos', linea.productoId]"
                    (click)="carrito.cerrarPanel()"
                  >
                    {{ linea.nombre }}
                  </a>
                  @if (linea.presentacionDescripcion) {
                    <span>{{ linea.presentacionDescripcion }}</span>
                  }
                  <span>{{ formatear(linea.precio) }}</span>
                  <div class="drawer__cantidad">
                    <button
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
                  </div>
                </div>
                <button
                  mat-icon-button
                  type="button"
                  [attr.aria-label]="'Quitar ' + linea.nombre"
                  (click)="carrito.quitar(linea.productoId, linea.presentacionId)"
                >
                  <mat-icon fontSet="material-icons-outlined">delete</mat-icon>
                </button>
              </li>
            }
          </ul>

          <footer class="drawer__pie">
            <p>
              Subtotal
              <strong>{{ formatear(carrito.subtotal()) }}</strong>
            </p>
            <a
              matButton="filled"
              routerLink="/checkout"
              (click)="carrito.cerrarPanel()"
            >
              Ir a pagar
            </a>
            <a
              matButton
              routerLink="/carrito"
              (click)="carrito.cerrarPanel()"
            >
              Ver carrito completo
            </a>
          </footer>
        }
      </aside>
    }
  `,
  styleUrl: './carrito-drawer.scss',
})
export class CarritoDrawerComponent {
  protected readonly carrito = inject(CarritoService);

  protected formatear(monto: number): string {
    return formatearGs(monto);
  }

  protected track(productoId: number, presentacionId?: number | null): string {
    return claveLineaCarrito(productoId, presentacionId);
  }
}
