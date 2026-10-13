import { Routes } from '@angular/router';
import { buscarMarca } from './data/marcas.data';

export const MARCAS_ROUTES: Routes = [
  {
    path: ':slug',
    title: (route) => {
      const marca = buscarMarca(route.paramMap.get('slug') ?? '');
      return marca ? `Diagramas ${marca.nombre} · Red Automotriz` : 'Marca no encontrada';
    },
    loadComponent: () =>
      import('./pages/marca-detalle/marca-detalle').then((m) => m.MarcaDetalleComponent),
  },
];
