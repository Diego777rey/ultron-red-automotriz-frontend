import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { PedidosService } from '../../../checkout/services/pedidos.service';

@Component({
  selector: 'app-mi-cuenta',
  imports: [MatButton, DatePipe],
  template: `
    @if (auth.usuario(); as usuario) {
      <div class="mi-cuenta">
        <h1>Mi cuenta</h1>
        <p>Hola, {{ usuario.nombre }} ({{ usuario.email }}).</p>
        <section aria-labelledby="titulo-pedidos">
          <h2 id="titulo-pedidos">Mis compras</h2>
          @if (pedidos().length === 0) {
            <p>Todavía no realizaste compras.</p>
          } @else {
            <ul class="mi-cuenta__lista">
              @for (pedido of pedidos(); track pedido.id) {
                <li>
                  <strong>{{ pedido.creadoEn | date: 'medium' }}</strong> — Gs.
                  {{ pedido.total.toLocaleString('es-PY') }} · Tarjeta ****
                  {{ pedido.ultimosCuatroTarjeta }}
                </li>
              }
            </ul>
          }
        </section>
        <button matButton="outlined" type="button" (click)="cerrarSesion()">Cerrar sesión</button>
      </div>
    }
  `,
  styles: `
    .mi-cuenta__lista {
      margin: 0;
      padding-left: 1.2rem;
    }
  `,
})
export class MiCuentaComponent {
  protected readonly auth = inject(AuthService);
  private readonly pedidosService = inject(PedidosService);
  private readonly router = inject(Router);

  protected readonly pedidos = computed(() => {
    const usuario = this.auth.usuario();
    return usuario ? this.pedidosService.porUsuario(usuario.id) : [];
  });

  protected cerrarSesion(): void {
    this.auth.cerrarSesion();
    void this.router.navigateByUrl('/');
  }
}
