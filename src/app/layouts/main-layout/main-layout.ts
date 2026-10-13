import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CatalogoDiagramasService } from '../../features/marcas/services/catalogo-diagramas.service';
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
      [cantidadCarrito]="catalogo.cantidadCarrito()"
      (abrirCuenta)="irAVendedor()"
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
  private readonly router = inject(Router);
  protected readonly catalogo = inject(CatalogoDiagramasService);

  irAVendedor(): void {
    void this.router.navigate(['/vendedor']);
  }
}
