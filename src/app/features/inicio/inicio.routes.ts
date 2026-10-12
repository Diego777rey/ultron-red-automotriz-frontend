import { Routes } from '@angular/router';

export const INICIO_ROUTES: Routes = [
  {
    path: '',
    title: 'Red Automotriz',
    loadComponent: () => import('./pages/inicio/inicio').then((m) => m.InicioComponent),
  },
];
