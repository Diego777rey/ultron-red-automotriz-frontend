import { Component, inject } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { CarritoDrawerComponent } from '../../features/carrito/components/carrito-drawer/carrito-drawer';
import { CarritoService } from '../../features/carrito/services/carrito.service';
import { MenuCategoriasComponent } from '../../features/productos/components/menu-categorias/menu-categorias';
import { MenuLateralService } from '../../features/productos/services/menu-lateral.service';
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
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MenuCategoriasComponent,
  ],
  template: `
    <button type="button" class="main-layout__saltar" (click)="contenido.focus()">
      Saltar al contenido
    </button>
    <app-header
      [cantidadCarrito]="carrito.cantidadTotal()"
      [menuAbierto]="menu.abierto()"
      (alternarMenu)="menu.alternar()"
      (buscar)="buscar($event)"
      (abrirCarrito)="abrirCarrito()"
      (abrirCuenta)="irCuenta()"
    />
    <mat-sidenav-container class="main-layout__shell">
      <mat-sidenav
        class="main-layout__menu"
        mode="over"
        fixedInViewport
        [opened]="menu.abierto()"
        (openedChange)="menu.abierto.set($event)"
        aria-label="Categorías"
      >
        <app-menu-categorias
          [categoriaActivaId]="productos.categoriaSeleccionada()"
          (navegacion)="menu.cerrar()"
        />
      </mat-sidenav>
      <mat-sidenav-content>
        <main #contenido class="main-layout__contenido" tabindex="-1">
          <router-outlet />
        </main>
        <app-footer />
      </mat-sidenav-content>
    </mat-sidenav-container>
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
  protected readonly menu = inject(MenuLateralService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

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
