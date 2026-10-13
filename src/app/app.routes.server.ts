import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'marcas/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server,
  },
  {
    path: 'cuenta/**',
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
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
