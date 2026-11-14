import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/** Redirige `/categorias/:id` → `/productos?categoria=:id`. */
@Component({
  selector: 'app-categoria-redirect',
  template: `<p role="status">Redirigiendo al catálogo…</p>`,
})
export class CategoriaRedirectComponent {
  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);
    const id = route.snapshot.paramMap.get('id');
    void router.navigate(['/productos'], {
      queryParams: id ? { categoria: id } : {},
      replaceUrl: true,
    });
  }
}
