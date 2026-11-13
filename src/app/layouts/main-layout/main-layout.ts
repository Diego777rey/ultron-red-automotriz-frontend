import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CarritoService } from '../../features/carrito/services/carrito.service';
import { FooterComponent } from '../../shared/components/footer/footer';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <button type="button" class="main-layout__saltar" (click)="contenido.focus()">
      Saltar al contenido
    </button>
    <app-header
      [cantidadCarrito]="carrito.cantidadTotal()"
      (buscar)="buscar($event)"
      (abrirCarrito)="irCarrito()"
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
  private readonly router = inject(Router);

  protected irCarrito(): void {
    void this.router.navigate(['/carrito']);
  }

  protected buscar(termino: string): void {
    void this.router.navigate(['/productos'], { queryParams: { q: termino } });
  }
}
