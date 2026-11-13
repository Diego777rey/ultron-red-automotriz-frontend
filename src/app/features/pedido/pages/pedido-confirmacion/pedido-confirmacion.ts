import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { PedidoWeb } from '../../../checkout/models/pedido-web.model';
import { PedidosWebService } from '../../../checkout/services/pedidos-web.service';
import { formatearGs } from '../../../productos/services/productos.mapper';

type EstadoPedido =
  | { cargando: true; pedido: null }
  | { cargando: false; pedido: PedidoWeb | null };

@Component({
  selector: 'app-pedido-confirmacion',
  imports: [RouterLink, MatButton],
  template: `
    <div class="pedido">
      @if (estado().cargando) {
        <p role="status">Buscando tu pedido…</p>
      } @else if (estado().pedido; as pedido) {
        <h1>Pedido confirmado</h1>
        <p class="pedido__codigo">
          Código: <strong>{{ pedido.codigo }}</strong>
        </p>
        <p>Estado: {{ pedido.estado }}</p>
        <p>Total: <strong>{{ formatear(pedido.total) }}</strong></p>
        @if (pedido.pagoUltimosCuatro) {
          <p>Tarjeta terminada en {{ pedido.pagoUltimosCuatro }}</p>
        }
        @if (pedido.pagoMensaje) {
          <p>{{ pedido.pagoMensaje }}</p>
        }

        <h2>Detalle</h2>
        <ul class="pedido__lista">
          @for (linea of pedido.detalles; track linea.id_detalle_pedido_web) {
            <li>
              <span>
                {{ linea.nombreProducto }}
                @if (linea.presentacion) {
                  ({{ linea.presentacion }})
                }
                × {{ linea.cantidad }}
              </span>
              <strong>{{ formatear(linea.subtotal) }}</strong>
            </li>
          }
        </ul>

        <p class="pedido__cliente">
          Enviaremos la confirmación a <strong>{{ pedido.clienteEmail }}</strong>
          @if (pedido.clienteNombre) {
            ({{ pedido.clienteNombre }})
          }.
        </p>

        <a matButton="filled" routerLink="/productos">Seguir comprando</a>
      } @else {
        <h1>Pedido no encontrado</h1>
        <p>No encontramos un pedido con el código “{{ codigo() }}”.</p>
        <a matButton="filled" routerLink="/">Ir al inicio</a>
      }
    </div>
  `,
  styleUrl: './pedido-confirmacion.scss',
})
export class PedidoConfirmacionComponent {
  readonly codigo = input.required<string>();

  private readonly pedidos = inject(PedidosWebService);

  protected readonly estado = toSignal(
    toObservable(this.codigo).pipe(
      switchMap((codigo) =>
        this.pedidos.buscarPorCodigo(codigo).pipe(
          map((pedido): EstadoPedido => ({ cargando: false, pedido })),
          catchError(() => of({ cargando: false, pedido: null } satisfies EstadoPedido)),
          startWith({ cargando: true, pedido: null } satisfies EstadoPedido),
        ),
      ),
    ),
    { initialValue: { cargando: true, pedido: null } satisfies EstadoPedido },
  );

  protected formatear(monto: number): string {
    return formatearGs(Number(monto));
  }
}
