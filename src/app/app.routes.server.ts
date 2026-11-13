import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'productos/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'carrito/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'checkout/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'pedido/**',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
