import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input, linkedSignal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Marca } from '../../models/marca.model';

@Component({
  selector: 'app-marca-card',
  imports: [RouterLink, NgOptimizedImage, MatCard],
  template: `
    <a class="marca-card" [routerLink]="['/marcas', marca().slug]">
      <mat-card class="marca-card__card">
        <div class="marca-card__logo">
          @if (logo(); as logo) {
            <img
              [ngSrc]="logo"
              width="400"
              height="250"
              alt=""
              [priority]="prioritaria()"
              (error)="logoDisponible.set(false)"
            />
          } @else {
            <span class="marca-card__iniciales" aria-hidden="true">{{ iniciales() }}</span>
          }
        </div>
        <span class="marca-card__nombre">{{ marca().nombre }}</span>
      </mat-card>
    </a>
  `,
  styleUrl: './marca-card.scss',
})
export class MarcaCardComponent {
  readonly marca = input.required<Marca>();
  readonly prioritaria = input(false);

  protected readonly logoDisponible = linkedSignal(() => Boolean(this.marca().logo));
  protected readonly logo = computed(() => (this.logoDisponible() ? this.marca().logo : undefined));
  protected readonly iniciales = computed(() =>
    this.marca()
      .nombre.split(/[\s-]+/)
      .map((palabra) => palabra.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  );
}
