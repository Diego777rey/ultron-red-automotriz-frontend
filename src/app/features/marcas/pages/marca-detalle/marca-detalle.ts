import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

/** La tienda ya no organiza el catálogo por marca de vehículo. */
@Component({
  selector: 'app-marca-detalle',
  imports: [RouterLink, MatButton],
  template: `
    <div class="marca-detalle">
      <h1>Catálogo actualizado</h1>
      <p>
        Los productos de la tienda ahora se publican desde gestión de activos. Explorá el catálogo
        completo.
      </p>
      <a matButton="filled" routerLink="/productos">Ver productos</a>
    </div>
  `,
  styles: `
    .marca-detalle {
      max-width: 640px;
      margin-inline: auto;
    }
  `,
})
export class MarcaDetalleComponent {}
