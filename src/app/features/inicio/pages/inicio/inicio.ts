import { Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MarcasGridComponent } from '../../../marcas/components/marcas-grid/marcas-grid';
import { MARCAS } from '../../../marcas/data/marcas.data';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, MatAnchor, MatIcon, MarcasGridComponent],
  template: `
    <div class="inicio">
      <h1>Diagramas eléctricos automotrices por marca</h1>
      <p>Diagramas de ECU, tableros, inmovilizadores y airbag. Elegí la marca de tu vehículo.</p>
      <div class="inicio__acciones">
        <a mat-stroked-button routerLink="/vendedor">
          <mat-icon aria-hidden="true">storefront</mat-icon>
          Acceso vendedor: cargar productos
        </a>
      </div>
      <app-marcas-grid [marcas]="marcas" />
    </div>
  `,
  styles: `
    .inicio {
      max-width: 1000px;
      margin-inline: auto;
    }

    h1 {
      margin: 0 0 8px;
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
    }

    p {
      margin: 0 0 16px;
      color: var(--text-secondary);
      text-align: center;
    }

    .inicio__acciones {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;
    }

    @media (max-width: 599px) {
      h1 {
        font-size: 1.5rem;
      }
    }
  `,
})
export class InicioComponent {
  protected readonly marcas = MARCAS;
}
