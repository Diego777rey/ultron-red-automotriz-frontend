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
        path: 'carrito',
        loadChildren: () => import('./features/carrito/carrito.routes').then((m) => m.CARRITO_ROUTES),
      },
      {
        path: 'checkout',
        loadChildren: () => import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
      },
      {
        path: 'cuenta',
        loadChildren: () => import('./features/cuenta/cuenta.routes').then((m) => m.CUENTA_ROUTES),
      },
      {
        path: 'vendedor',
        redirectTo: 'admin/acceso',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
