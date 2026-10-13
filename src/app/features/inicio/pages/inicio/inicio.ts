import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarcasGridComponent } from '../../../marcas/components/marcas-grid/marcas-grid';
import { MARCAS } from '../../../marcas/data/marcas.data';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, MarcasGridComponent],
  template: `
    <div class="inicio">
      <h1>Diagramas eléctricos automotrices por marca</h1>
      <p>Diagramas de ECU, tableros, inmovilizadores y airbag. Elegí la marca de tu vehículo.</p>
      <aside class="inicio__prototipo" aria-label="Guía del prototipo">
        <p class="inicio__prototipo-texto">
          <strong>Prototipo:</strong> al hacer clic en una marca vas al catálogo con tarjetas, precio
          en guaraníes y filtros por modelo y año. También podés ir directo a
          <a routerLink="/marcas/toyota">Toyota (ejemplo)</a> o al
          <a routerLink="/vendedor">panel del vendedor</a> para cargar diagramas.
        </p>
      </aside>
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
      margin: 0 0 32px;
      color: var(--text-secondary);
      text-align: center;
    }

    .inicio__prototipo {
      margin: 0 0 24px;
      padding: 12px 16px;
      border: 1px solid var(--brand-color);
      border-radius: 8px;
      background: color-mix(in srgb, var(--brand-color) 8%, var(--bg-color));
    }

    .inicio__prototipo-texto {
      margin: 0;
      color: var(--text-primary);
      font-size: 0.9rem;
      line-height: 1.5;
      text-align: left;
    }

    .inicio__prototipo a {
      color: var(--brand-color);
      font-weight: 600;
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
