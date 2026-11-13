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
        path: 'productos',
        loadChildren: () =>
          import('./features/productos/productos.routes').then((m) => m.PRODUCTOS_ROUTES),
      },
      {
        path: 'carrito',
        loadChildren: () => import('./features/carrito/carrito.routes').then((m) => m.CARRITO_ROUTES),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
      },
      {
        path: 'pedido',
        loadChildren: () => import('./features/pedido/pedido.routes').then((m) => m.PEDIDO_ROUTES),
      },
      {
        path: 'metodos-de-pago',
        loadChildren: () => import('./features/info/info.routes').then((m) => m.INFO_ROUTES),
      },
      {
        path: 'marcas',
        redirectTo: 'productos',
        pathMatch: 'prefix',
      },
      {
        path: 'vendedor',
        redirectTo: 'productos',
        pathMatch: 'prefix',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
