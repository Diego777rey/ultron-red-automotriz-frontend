import { Routes } from '@angular/router';

export const MARCAS_ROUTES: Routes = [
  {
    path: ':slug',
    title: 'Diagramas por marca | Red Automotriz',
    loadComponent: () => import('./pages/marca-detalle/marca-detalle').then((m) => m.MarcaDetalleComponent),
  },
];
