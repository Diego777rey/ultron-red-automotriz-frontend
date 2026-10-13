import { Routes } from '@angular/router';

export const PRODUCTOS_ROUTES: Routes = [
  {
    path: 'marcas/:slug',
    title: 'Catálogo de diagramas | Red Automotriz',
    loadComponent: () =>
      import('./pages/catalogo-marca/catalogo-marca').then((m) => m.CatalogoMarcaComponent),
  },
  {
    path: 'vendedor/productos/nuevo',
    title: 'Publicar diagrama | Red Automotriz',
    loadComponent: () =>
      import('./pages/nuevo-producto/nuevo-producto').then((m) => m.NuevoProductoComponent),
  },
];
