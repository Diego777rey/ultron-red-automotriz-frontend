import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriaCatalogo } from '../../models/producto.model';

/**
 * Barra horizontal de departamentos (estilo tienda multi-categoría).
 * Enlaces a `/productos?categoria=<id>`.
 */
@Component({
  selector: 'app-categorias-nav',
  imports: [RouterLink],
  template: `
    <nav class="categorias-nav" aria-label="Departamentos">
      <div class="categorias-nav__pista">
        <a
          class="categorias-nav__enlace"
          routerLink="/productos"
          [class.categorias-nav__enlace--activo]="categoriaActivaId() == null"
          [attr.aria-current]="categoriaActivaId() == null ? 'page' : null"
        >
          Todos
        </a>
        @for (categoria of categorias(); track categoria.id) {
          <a
            class="categorias-nav__enlace"
            routerLink="/productos"
            [queryParams]="{ categoria: categoria.id }"
            [class.categorias-nav__enlace--activo]="categoriaActivaId() === categoria.id"
            [attr.aria-current]="categoriaActivaId() === categoria.id ? 'page' : null"
          >
            {{ categoria.nombre }}
          </a>
        }
      </div>
    </nav>
  `,
  styles: `
    :host {
      display: block;
      background: color-mix(in srgb, var(--brand-color) 8%, var(--bg-color));
      border-bottom: 1px solid var(--border-color);
    }

    .categorias-nav {
      max-width: var(--content-max-width);
      margin-inline: auto;
    }

    .categorias-nav__pista {
      display: flex;
      gap: 4px;
      padding: 0 28px;
      overflow-x: auto;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }

    .categorias-nav__enlace {
      flex: 0 0 auto;
      padding: 12px 14px;
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
      border-bottom: 2px solid transparent;

      &:hover,
      &:focus-visible {
        color: var(--brand-color);
        outline: none;
      }

      &:focus-visible {
        outline: 2px solid var(--brand-color);
        outline-offset: -2px;
      }
    }

    .categorias-nav__enlace--activo {
      color: var(--brand-color);
      border-bottom-color: var(--brand-color);
      font-weight: 600;
    }

    @media (max-width: 699px) {
      .categorias-nav__pista {
        padding-inline: 16px;
      }

      .categorias-nav__enlace {
        padding: 10px 12px;
        font-size: 0.85rem;
      }
    }
  `,
})
export class CategoriasNavComponent {
  readonly categorias = input.required<readonly CategoriaCatalogo[]>();
  readonly categoriaActivaId = input<number | null>(null);
}
