import { Routes } from '@angular/router';

export const VENDEDOR_ROUTES: Routes = [
  {
    path: '',
    title: 'Panel del vendedor — Red Automotriz',
    loadComponent: () => import('./pages/vendedor/vendedor').then((m) => m.VendedorComponent),
  },
];
