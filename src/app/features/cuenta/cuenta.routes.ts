import { Routes } from '@angular/router';
import { autenticadoGuard } from '../../core/guards/autenticado.guard';

export const CUENTA_ROUTES: Routes = [
  {
    path: 'iniciar-sesion',
    title: 'Iniciar sesión | Red Automotriz',
    loadComponent: () => import('./pages/iniciar-sesion/iniciar-sesion').then((m) => m.IniciarSesionComponent),
  },
  {
    path: 'registro',
    title: 'Registro | Red Automotriz',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.RegistroClienteComponent),
  },
  {
    path: '',
    title: 'Mi cuenta | Red Automotriz',
    canActivate: [autenticadoGuard],
    loadComponent: () => import('./pages/mi-cuenta/mi-cuenta').then((m) => m.MiCuentaComponent),
  },
];
