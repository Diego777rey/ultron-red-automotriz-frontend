import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-metodos-pago',
  imports: [RouterLink, MatButton],
  template: `
    <article class="metodos">
      <h1>Métodos de pago</h1>
      <p>
        En Red Automotriz podés pagar online con tarjeta de crédito o débito al confirmar el
        pedido. El cobro se registra en el servidor de la tienda.
      </p>
      <ul>
        <li>Visa, Mastercard, American Express y otras marcas aceptadas por tu emisor</li>
        <li>El total se muestra en guaraníes (Gs.)</li>
        <li>Al aprobarse el pago recibís un código de pedido para seguimiento</li>
      </ul>
      <p>
        Si una tarjeta termina en <strong>0000</strong> el emisor de prueba la rechaza (útil para
        demos). Usá cualquier otro número válido de prueba para aprobar.
      </p>
      <a matButton="filled" routerLink="/productos">Ir al catálogo</a>
    </article>
  `,
  styles: `
    .metodos {
      max-width: 720px;
      margin-inline: auto;
    }

    h1 {
      margin: 0 0 12px;
      font-size: 2rem;
    }

    p,
    li {
      color: var(--text-secondary);
      line-height: 1.5;
    }

    ul {
      margin: 0 0 20px;
      padding-left: 1.2rem;
    }
  `,
})
export class MetodosPagoComponent {}
