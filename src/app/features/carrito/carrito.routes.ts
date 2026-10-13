import { Routes } from '@angular/router';

export const CARRITO_ROUTES: Routes = [
  {
    path: '',
    title: 'Carrito | Red Automotriz',
    loadComponent: () => import('./pages/carrito/carrito').then((m) => m.CarritoComponent),
  },
];
