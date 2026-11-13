import { Routes } from '@angular/router';

export const PRODUCTOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Productos | Red Automotriz',
    loadComponent: () =>
      import('./pages/productos-lista/productos-lista').then((m) => m.ProductosListaComponent),
  },
  {
    path: ':id',
    title: 'Producto | Red Automotriz',
    loadComponent: () =>
      import('./pages/producto-detalle/producto-detalle').then((m) => m.ProductoDetalleComponent),
  },
];
