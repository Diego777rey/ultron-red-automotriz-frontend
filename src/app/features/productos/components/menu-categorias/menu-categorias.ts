import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MENU_CATEGORIAS_TIENDA } from '../../data/menu-categorias.data';
import { CategoriaCatalogo } from '../../models/producto.model';

/**
 * Menú lateral fijo de la tienda: familias y, al desplegar, subcategorías.
 * No consulta el backend.
 */
@Component({
  selector: 'app-menu-categorias',
  imports: [RouterLink, MatIcon],
  template: `
    <div class="menu">
      <header class="menu__cabecera">
        <h2 class="menu__cabecera-titulo">Menú</h2>
      </header>

      <nav class="menu__nav" aria-label="Categorías" (click)="alElegir($event)">
        <p class="menu__seccion">Categorías</p>
        <ul class="menu__lista">
          @for (familia of categorias; track familia.id) {
            <li class="menu__grupo">
              <button
                type="button"
                class="menu__item menu__item--familia"
                [class.menu__item--abierta]="estaAbierta(familia.id)"
                [attr.aria-expanded]="estaAbierta(familia.id)"
                [attr.aria-controls]="'subcategorias-' + familia.id"
                (click)="alternar(familia.id)"
              >
                <span class="menu__nombre">{{ familia.nombre }}</span>
                <mat-icon fontSet="material-icons-outlined" aria-hidden="true">
                  {{ estaAbierta(familia.id) ? 'expand_more' : 'chevron_right' }}
                </mat-icon>
              </button>

              <ul
                class="menu__subs"
                [id]="'subcategorias-' + familia.id"
                [class.menu__subs--abierta]="estaAbierta(familia.id)"
                [attr.inert]="estaAbierta(familia.id) ? null : ''"
                [attr.aria-hidden]="estaAbierta(familia.id) ? null : true"
              >
                <li class="menu__subs-caja">
                  <ul class="menu__subs-lista">
                    @for (sub of hijas(familia); track sub.id) {
                      <li>
                        <a
                          class="menu__sub"
                          routerLink="/productos"
                          [queryParams]="{ categoria: sub.id }"
                          [class.menu__sub--activa]="categoriaActivaId() === sub.id"
                          [attr.aria-current]="categoriaActivaId() === sub.id ? 'page' : null"
                        >
                          {{ sub.nombre }}
                        </a>
                      </li>
                    }
                  </ul>
                </li>
              </ul>
            </li>
          }
        </ul>
      </nav>
    </div>
  `,
  styleUrl: './menu-categorias.scss',
})
export class MenuCategoriasComponent {
  readonly categoriaActivaId = input<number | null>(null);
  /** Se emite al seguir un enlace, para cerrar el panel lateral. */
  readonly navegacion = output<void>();

  protected readonly categorias = MENU_CATEGORIAS_TIENDA;
  private readonly abiertas = signal<ReadonlySet<number>>(new Set());

  constructor() {
    effect(() => {
      const activa = this.categoriaActivaId();
      if (activa == null) {
        return;
      }
      const familia = this.categorias.find(
        (categoria) =>
          categoria.id === activa || this.hijas(categoria).some((sub) => sub.id === activa),
      );
      if (!familia) {
        return;
      }
      untracked(() => {
        if (this.abiertas().has(familia.id)) {
          return;
        }
        this.abiertas.update((actual) => {
          const siguiente = new Set(actual);
          siguiente.add(familia.id);
          return siguiente;
        });
      });
    });
  }

  protected hijas(categoria: CategoriaCatalogo): readonly CategoriaCatalogo[] {
    return categoria.subcategorias ?? [];
  }

  protected estaAbierta(id: number): boolean {
    return this.abiertas().has(id);
  }

  protected alElegir(evento: Event): void {
    const objetivo = evento.target;
    if (objetivo instanceof Element && objetivo.closest('a')) {
      this.navegacion.emit();
    }
  }

  protected alternar(id: number): void {
    this.abiertas.update((actual) => {
      const siguiente = new Set(actual);
      if (siguiente.has(id)) {
        siguiente.delete(id);
      } else {
        siguiente.add(id);
      }
      return siguiente;
    });
  }
}
