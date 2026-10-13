import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DiagramaArticulo } from '../../models/diagrama.model';

@Component({
  selector: 'app-diagrama-card',
  imports: [DecimalPipe, MatCard, MatButton, MatIcon],
  template: `
    <mat-card class="diagrama-card">
      <div class="diagrama-card__encabezado">
        <span class="diagrama-card__categoria">{{ articulo().categoria }}</span>
        <span class="diagrama-card__vehiculo">
          {{ articulo().modelo }} · {{ articulo().anio }}
        </span>
      </div>

      <h3 class="diagrama-card__titulo">{{ articulo().titulo }}</h3>
      <p class="diagrama-card__descripcion">{{ articulo().descripcion }}</p>

      <div class="diagrama-card__pie">
        <div class="diagrama-card__precio-bloque">
          <span class="diagrama-card__etiqueta-precio">Valor</span>
          <strong class="diagrama-card__precio">
            {{ articulo().moneda }} {{ articulo().precio | number: '1.0-0' }}
          </strong>
        </div>

        <button
          mat-flat-button
          type="button"
          class="diagrama-card__boton"
          [attr.aria-label]="'Agregar al carrito: ' + articulo().titulo"
          (click)="comprar.emit(articulo())"
        >
          <mat-icon aria-hidden="true">add_shopping_cart</mat-icon>
          Comprar
        </button>
      </div>
    </mat-card>
  `,
  styleUrl: './diagrama-card.scss',
})
export class DiagramaCardComponent {
  readonly articulo = input.required<DiagramaArticulo>();
  readonly comprar = output<DiagramaArticulo>();
}
