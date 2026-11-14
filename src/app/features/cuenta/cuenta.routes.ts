import { Routes } from '@angular/router';

export const CUENTA_ROUTES: Routes = [
  {
    path: '',
    title: 'Mi cuenta | Red Automotriz',
    loadComponent: () => import('./pages/mi-cuenta/mi-cuenta').then((m) => m.MiCuentaComponent),
  },
  {
    path: 'iniciar-sesion',
    title: 'Iniciar sesión | Red Automotriz',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    title: 'Crear cuenta | Red Automotriz',
    loadComponent: () => import('./pages/registro/registro').then((m) => m.RegistroComponent),
  },
];
