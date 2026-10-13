import { Routes } from '@angular/router';

export const MARCAS_ROUTES: Routes = [
  {
    path: ':slug',
    loadComponent: () => import('./pages/productos-marca/productos-marca').then((m) => m.ProductosMarcaComponent),
  },
];
