import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

/** La carga de productos se gestiona en Ultron Gestión de Activos. */
@Component({
  selector: 'app-panel-vendedor',
  imports: [RouterLink, MatButton],
  template: `
    <div class="panel-vendedor">
      <h1>Panel del vendedor</h1>
      <p>
        Los productos de la tienda web se administran en <strong>Gestión de Activos</strong>
        (marcar “mostrar en web”, cargar imagen y precio de venta).
      </p>
      <a matButton="filled" routerLink="/productos">Ir al catálogo</a>
    </div>
  `,
  styles: `
    .panel-vendedor {
      max-width: 640px;
      margin-inline: auto;
    }
  `,
})
export class PanelVendedorComponent {}
