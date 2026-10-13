import { Routes } from '@angular/router';

export const VENDEDOR_ROUTES: Routes = [
  {
    path: '',
    title: 'Panel del vendedor | Red Automotriz',
    loadComponent: () => import('./pages/panel-vendedor/panel-vendedor').then((m) => m.PanelVendedorComponent),
  },
];
