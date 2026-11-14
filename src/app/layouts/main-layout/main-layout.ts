import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { CarritoDrawerComponent } from '../../features/carrito/components/carrito-drawer/carrito-drawer';
import { CarritoService } from '../../features/carrito/services/carrito.service';
import { CategoriasNavComponent } from '../../features/productos/components/categorias-nav/categorias-nav';
import { ProductosService } from '../../features/productos/services/productos.service';
import { FooterComponent } from '../../shared/components/footer/footer';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CarritoDrawerComponent,
    CategoriasNavComponent,
  ],
  template: `
    <button type="button" class="main-layout__saltar" (click)="contenido.focus()">
      Saltar al contenido
    </button>
    <app-header
      [cantidadCarrito]="carrito.cantidadTotal()"
      (buscar)="buscar($event)"
      (abrirCarrito)="abrirCarrito()"
      (abrirCuenta)="irCuenta()"
    />
    @if (productos.categoriasNavLista().length > 0) {
      <app-categorias-nav
        [categorias]="productos.categoriasNavLista()"
        [categoriaActivaId]="categoriaDesdeUrl()"
      />
    }
    <main #contenido class="main-layout__contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
    <app-carrito-drawer />
  `,
  styleUrl: './main-layout.scss',
  host: {
    class: 'app-main-layout',
  },
})
export class MainLayoutComponent {
  protected readonly carrito = inject(CarritoService);
  protected readonly productos = inject(ProductosService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly categoriaDesdeUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let actual: ActivatedRoute | null = this.route;
        while (actual?.firstChild) {
          actual = actual.firstChild;
        }
        const raw = actual?.snapshot.queryParamMap.get('categoria');
        if (!raw) {
          return null;
        }
        const id = Number(raw);
        return Number.isFinite(id) ? id : null;
      }),
    ),
    { initialValue: null as number | null },
  );

  constructor() {
    this.productos.cargarCategoriasNav();
  }

  protected abrirCarrito(): void {
    this.carrito.abrirPanel();
  }

  protected irCuenta(): void {
    if (this.auth.estaAutenticado()) {
      void this.router.navigate(['/cuenta']);
      return;
    }
    void this.router.navigate(['/cuenta/iniciar-sesion']);
  }

  protected buscar(termino: string): void {
    void this.router.navigate(['/productos'], { queryParams: { q: termino } });
  }
}
