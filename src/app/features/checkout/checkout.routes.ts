import { Routes } from '@angular/router';
import { autenticadoGuard } from '../../core/guards/autenticado.guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    title: 'Pago | Red Automotriz',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.CheckoutComponent),
  },
];
