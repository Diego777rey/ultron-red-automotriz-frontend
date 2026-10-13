import { Routes } from '@angular/router';
import { buscarMarca } from './data/marcas.data';

export const MARCAS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/',
  },
  {
    path: ':slug',
    title: (ruta) => {
      const marca = buscarMarca(ruta.paramMap.get('slug') ?? '');
      return marca
        ? `Diagramas ${marca.nombre} — Red Automotriz`
        : 'Marca no encontrada — Red Automotriz';
    },
    loadComponent: () => import('./pages/marca/marca').then((m) => m.MarcaComponent),
  },
];
