import { Routes } from '@angular/router';

export const VENDEDOR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'productos',
  },
  {
    path: 'productos',
    title: 'Cargar diagramas — Red Automotriz',
    loadComponent: () =>
      import('./pages/productos/vendedor-productos').then((m) => m.VendedorProductosComponent),
  },
];
