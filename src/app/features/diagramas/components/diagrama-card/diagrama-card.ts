import { Component, computed, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Diagrama, etiquetaTipo } from '../../models/diagrama.model';
import { formatearPrecio } from '../../utils/formatear-precio';

@Component({
  selector: 'app-diagrama-card',
  imports: [MatCard, MatCardContent],
  template: `
    <mat-card class="diagrama-card" appearance="outlined">
      <mat-card-content>
        <p class="diagrama-card__tipo">{{ tipo() }}</p>
        @switch (nivel()) {
          @case ('h3') {
            <h3 class="diagrama-card__titulo">{{ diagrama().titulo }}</h3>
          }
          @default {
            <h2 class="diagrama-card__titulo">{{ diagrama().titulo }}</h2>
          }
        }
        <p class="diagrama-card__vehiculo">{{ diagrama().modelo }} · {{ diagrama().anio }}</p>
        <p class="diagrama-card__descripcion">{{ diagrama().descripcion }}</p>
        <p class="diagrama-card__precio">{{ precio() }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styleUrl: './diagrama-card.scss',
})
export class DiagramaCardComponent {
  readonly diagrama = input.required<Diagrama>();
  readonly nivel = input<'h2' | 'h3'>('h2');

  protected readonly tipo = computed(() => etiquetaTipo(this.diagrama().tipo));
  protected readonly precio = computed(() => formatearPrecio(this.diagrama().precio));
}
