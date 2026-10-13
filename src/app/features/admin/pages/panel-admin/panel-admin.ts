import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../../../core/auth/auth.service';
import { PedidosService } from '../../../checkout/services/pedidos.service';
import { ProductosService } from '../../../productos/services/productos.service';

@Component({
  selector: 'app-panel-admin',
  imports: [RouterLink, MatButton],
  template: `
    <div class="panel-admin">
      <h1>Panel de administración</h1>
      <p>Bienvenido, {{ auth.usuario()?.nombre }}. Gestioná el catálogo que ven los clientes.</p>
      <dl class="panel-admin__metricas">
        <div>
          <dt>Productos en catálogo</dt>
          <dd>{{ productos.total() }}</dd>
        </div>
        <div>
          <dt>Clientes registrados</dt>
          <dd>{{ clientes() }}</dd>
        </div>
        <div>
          <dt>Pedidos pagados</dt>
          <dd>{{ pedidos.todos().length }}</dd>
        </div>
      </dl>
      <div class="panel-admin__acciones">
        <a matButton="filled" routerLink="/admin/productos/nuevo">Nuevo diagrama</a>
        <a matButton="outlined" routerLink="/admin/productos">Ver productos</a>
      </div>
    </div>
  `,
  styleUrl: './panel-admin.scss',
})
export class PanelAdminComponent {
  protected readonly auth = inject(AuthService);
  protected readonly productos = inject(ProductosService);
  protected readonly pedidos = inject(PedidosService);

  protected readonly clientes = computed(() => this.auth.listarClientes().length);
}
