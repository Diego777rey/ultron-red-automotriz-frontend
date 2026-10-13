import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '../../layouts/admin-layout/admin-layout';
import { administradorGuard } from '../../core/guards/administrador.guard';
import { invitadoAdminGuard } from '../../core/guards/invitado-admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'acceso',
    title: 'Acceso administrativo | Red Automotriz',
    canActivate: [invitadoAdminGuard],
    loadComponent: () => import('./pages/acceso-admin/acceso-admin').then((m) => m.AccesoAdminComponent),
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [administradorGuard],
    children: [
      {
        path: '',
        title: 'Administración | Red Automotriz',
        loadComponent: () => import('./pages/panel-admin/panel-admin').then((m) => m.PanelAdminComponent),
      },
      {
        path: 'productos',
        title: 'Productos | Administración',
        loadComponent: () => import('./pages/productos-lista/productos-lista').then((m) => m.ProductosListaComponent),
      },
      {
        path: 'productos/nuevo',
        title: 'Nuevo producto | Administración',
        loadComponent: () =>
          import('./pages/producto-formulario/producto-formulario').then((m) => m.ProductoFormularioComponent),
      },
      {
        path: 'productos/:id/editar',
        title: 'Editar producto | Administración',
        loadComponent: () =>
          import('./pages/producto-formulario/producto-formulario').then((m) => m.ProductoFormularioComponent),
      },
      {
        path: 'clientes',
        title: 'Clientes | Administración',
        loadComponent: () => import('./pages/clientes-lista/clientes-lista').then((m) => m.ClientesListaComponent),
      },
    ],
  },
];
