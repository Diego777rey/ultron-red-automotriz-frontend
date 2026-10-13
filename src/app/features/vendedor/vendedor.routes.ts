import { Routes } from '@angular/router';

export const VENDEDOR_ROUTES: Routes = [
  {
    path: '',
    title: 'Cargar diagramas · Red Automotriz',
    loadComponent: () =>
      import('./pages/cargar-diagrama/cargar-diagrama').then((m) => m.CargarDiagramaComponent),
  },
];
