import { RenderMode, ServerRoute } from '@angular/ssr';
import { MARCAS } from './features/marcas/data/marcas.data';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'marcas/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return MARCAS.map((marca) => ({ slug: marca.slug }));
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
