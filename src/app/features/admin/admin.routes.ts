import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'productos',
    loadComponent: () => import('../marcas/pages/admin-productos/admin-productos').then((m) => m.AdminProductosComponent),
  },
];
