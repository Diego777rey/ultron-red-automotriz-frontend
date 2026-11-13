import { Routes } from '@angular/router';

export const INFO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/metodos-pago/metodos-pago').then((m) => m.MetodosPagoComponent),
  },
];
