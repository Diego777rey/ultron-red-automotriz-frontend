import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatChip,
    NgOptimizedImage,
    CurrencyPipe,
  ],
  template: `
    <mat-card class="producto-card">
      <mat-card-header>
        <mat-card-title>{{ producto().titulo }}</mat-card-title>
        <mat-card-subtitle>
          {{ producto().modelo }} {{ producto().anio }}
        </mat-card-subtitle>
      </mat-card-header>

      @if (producto().imagen) {
        <div class="producto-card__imagen">
          <img
            [ngSrc]="producto().imagen!"
            width="300"
            height="200"
            alt=""
            (error)="onImageError($event)"
          />
        </div>
      } @else {
        <div class="producto-card__imagen-placeholder">
          <span class="producto-card__tipo-icon">{{ producto().tipo }}</span>
        </div>
      }

      <mat-card-content>
        <mat-chip class="producto-card__tipo">{{ producto().tipo }}</mat-chip>
        <p class="producto-card__descripcion">{{ producto().descripcion }}</p>
        <p class="producto-card__precio">{{ producto().precio | currency: 'ARS':'symbol-narrow':'1.0-0' }}</p>
      </mat-card-content>

      <mat-card-actions>
        <button mat-flat-button color="primary" [disabled]="!producto().disponible">
          {{ producto().disponible ? 'Agregar al carrito' : 'No disponible' }}
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styleUrl: './producto-card.scss',
})
export class ProductoCardComponent {
  readonly producto = input.required<Producto>();

  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
