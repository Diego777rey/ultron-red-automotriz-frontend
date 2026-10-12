import { Component, input } from '@angular/core';
import { Marca } from '../../models/marca.model';
import { MarcaCardComponent } from '../marca-card/marca-card';

/** Cantidad de logos que entran en la primera fila; se cargan con prioridad (LCP). */
const LOGOS_PRIORITARIOS = 4;

@Component({
  selector: 'app-marcas-grid',
  imports: [MarcaCardComponent],
  template: `
    <ul class="marcas-grid">
      @for (marca of marcas(); track marca.slug) {
        <li>
          <app-marca-card [marca]="marca" [prioritaria]="$index < logosPrioritarios" />
        </li>
      }
    </ul>
  `,
  styles: `
    .marcas-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 24px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    @media (max-width: 1023px) {
      .marcas-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 599px) {
      .marcas-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }
    }
  `,
})
export class MarcasGridComponent {
  readonly marcas = input.required<readonly Marca[]>();
  protected readonly logosPrioritarios = LOGOS_PRIORITARIOS;
}
