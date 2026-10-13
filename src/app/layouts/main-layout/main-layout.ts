import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer';
import { HeaderComponent } from '../../shared/components/header/header';
import { CarritoService } from '../../features/carrito/services/carrito.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <button type="button" class="main-layout__saltar" (click)="contenido.focus()">
      Saltar al contenido
    </button>
    <app-header
      [cantidadCarrito]="carrito.cantidadTotal()"
      (abrirCarrito)="irCarrito()"
      (abrirCuenta)="irCuenta()"
    />
    <main #contenido class="main-layout__contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styleUrl: './main-layout.scss',
  host: {
    class: 'app-main-layout',
  },
})
export class MainLayoutComponent {
  protected readonly carrito = inject(CarritoService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected irCarrito(): void {
    void this.router.navigate(['/carrito']);
  }

  protected irCuenta(): void {
    if (this.auth.autenticado()) {
      void this.router.navigate(['/cuenta']);
      return;
    }
    void this.router.navigate(['/cuenta/iniciar-sesion']);
  }
}
