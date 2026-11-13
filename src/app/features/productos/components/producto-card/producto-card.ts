import { Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProductoCatalogo } from '../../models/producto.model';
import { formatearGs } from '../../services/productos.mapper';

/** Tarjeta de producto del catálogo web: imagen, precio y acciones. */
@Component({
  selector: 'app-producto-card',
  imports: [
    RouterLink,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatCardImage,
    MatButton,
    MatIcon,
  ],
  template: `
    <mat-card class="producto-card">
      <a class="producto-card__media" [routerLink]="['/productos', producto().id]">
        @if (producto().imagenUrl) {
          <img
            mat-card-image
            class="producto-card__imagen"
            [src]="producto().imagenUrl"
            [alt]="''"
            width="400"
            height="300"
            loading="lazy"
            decoding="async"
          />
        } @else {
          <div class="producto-card__sin-imagen" aria-hidden="true">
            <mat-icon fontSet="material-icons-outlined">inventory_2</mat-icon>
          </div>
        }
      </a>
      <mat-card-header>
        @if (categoria(); as categoria) {
          <span class="producto-card__tipo">{{ categoria }}</span>
        }
        <mat-card-title class="producto-card__titulo">
          <a [routerLink]="['/productos', producto().id]">{{ producto().nombre }}</a>
        </mat-card-title>
        @if (producto().descripcion; as descripcion) {
          <mat-card-subtitle class="producto-card__descripcion">{{ resumen() }}</mat-card-subtitle>
        }
      </mat-card-header>
      <mat-card-content>
        <p class="producto-card__precio">
          <span class="producto-card__precio-etiqueta">Precio</span>
          <span class="producto-card__precio-valor">{{ precioFormateado() }}</span>
        </p>
      </mat-card-content>
      <mat-card-actions>
        <a matButton type="button" [routerLink]="['/productos', producto().id]">Ver</a>
        <button
          matButton="filled"
          type="button"
          (click)="agregar.emit(producto())"
          [attr.aria-label]="'Agregar ' + producto().nombre + ' al carrito'"
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
  readonly producto = input.required<ProductoCatalogo>();
  readonly agregar = output<ProductoCatalogo>();

  protected readonly categoria = computed(() => this.producto().categoria?.nombre ?? null);

  protected readonly resumen = computed(() => {
    const texto = this.producto().descripcion?.trim() ?? '';
    if (texto.length <= 90) {
      return texto;
    }
    return `${texto.slice(0, 87).trimEnd()}…`;
  });

  protected readonly precioFormateado = computed(() => formatearGs(this.producto().precioVenta));
}
