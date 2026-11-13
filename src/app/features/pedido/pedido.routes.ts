import { Routes } from '@angular/router';

export const PEDIDO_ROUTES: Routes = [
  {
    path: ':codigo',
    title: 'Pedido | Red Automotriz',
    loadComponent: () =>
      import('./pages/pedido-confirmacion/pedido-confirmacion').then(
        (m) => m.PedidoConfirmacionComponent,
      ),
  },
];
