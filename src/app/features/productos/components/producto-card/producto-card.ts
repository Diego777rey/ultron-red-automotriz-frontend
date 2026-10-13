import { Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ProductoDiagrama } from '../../models/producto.model';

/** Tarjeta con el diagrama a la venta: tipo, modelo, años y precio. */
@Component({
  selector: 'app-producto-card',
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatButton, MatIcon],
  template: `
    <mat-card class="producto-card">
      <mat-card-header>
        <span class="producto-card__tipo">{{ producto().tipo }}</span>
        <mat-card-title class="producto-card__titulo">{{ producto().titulo }}</mat-card-title>
        <mat-card-subtitle>{{ detalle() }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <p class="producto-card__precio">
          <span class="producto-card__precio-etiqueta">Precio</span>
          <span class="producto-card__precio-valor">{{ precioFormateado() }}</span>
        </p>
      </mat-card-content>
      <mat-card-actions>
        <button
          matButton="filled"
          type="button"
          (click)="agregar.emit(producto())"
          [attr.aria-label]="'Agregar ' + producto().titulo + ' al carrito'"
        >
          <mat-icon fontSet="material-icons-outlined">add_shopping_cart</mat-icon>
          Agregar
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrl: './producto-card.scss',
})
export class ProductoCardComponent {
  readonly producto = input.required<ProductoDiagrama>();
  readonly agregar = output<ProductoDiagrama>();

  protected readonly detalle = computed(() => {
    const producto = this.producto();
    const anios =
      producto.anioDesde === producto.anioHasta
        ? `${producto.anioDesde}`
        : `${producto.anioDesde} – ${producto.anioHasta}`;
    return `${producto.modelo} · ${anios}`;
  });

  protected readonly precioFormateado = computed(() => `Gs. ${this.producto().precio.toLocaleString('es-PY')}`);
}
