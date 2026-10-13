import { Component, computed, input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { tipoDiagrama } from '../../data/tipos-diagrama.data';
import { Producto } from '../../models/producto.model';
import { formatearAnios, formatearPrecio } from '../../utils/precio';

@Component({
  selector: 'app-producto-card',
  imports: [MatCard, MatIcon],
  template: `
    <mat-card class="producto-card">
      <div class="producto-card__icono" aria-hidden="true">
        <mat-icon fontSet="material-icons-outlined">{{ tipo().icono }}</mat-icon>
      </div>
      <div class="producto-card__cuerpo">
        <p class="producto-card__tipo">{{ tipo().etiqueta }}</p>
        <h2 class="producto-card__titulo">{{ producto().titulo }}</h2>
        <p class="producto-card__detalle">{{ producto().modelo }} · {{ anios() }}</p>
        @if (producto().descripcion; as descripcion) {
          <p class="producto-card__descripcion">{{ descripcion }}</p>
        }
        <p class="producto-card__precio">{{ precio() }}</p>
      </div>
    </mat-card>
  `,
  styleUrl: './producto-card.scss',
})
export class ProductoCardComponent {
  readonly producto = input.required<Producto>();

  protected readonly tipo = computed(() => tipoDiagrama(this.producto().tipo));
  protected readonly anios = computed(() =>
    formatearAnios(this.producto().anioDesde, this.producto().anioHasta),
  );
  protected readonly precio = computed(() => formatearPrecio(this.producto().precio));
}
