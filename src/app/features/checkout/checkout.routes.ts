import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    title: 'Checkout | Red Automotriz',
    loadComponent: () => import('./pages/checkout/checkout').then((m) => m.CheckoutComponent),
  },
];
