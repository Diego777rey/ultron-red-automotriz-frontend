import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./features/inicio/inicio.routes').then((m) => m.INICIO_ROUTES),
      },
      {
        path: 'marcas',
        loadChildren: () => import('./features/marcas/marcas.routes').then((m) => m.MARCAS_ROUTES),
      },
      {
        path: 'vendedor',
        loadChildren: () =>
          import('./features/vendedor/vendedor.routes').then((m) => m.VENDEDOR_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
