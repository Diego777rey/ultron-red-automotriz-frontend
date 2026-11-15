import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { ProductoCardComponent } from '../../../productos/components/producto-card/producto-card';
import { ProductoCatalogo } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, ProductoCardComponent],
  template: `
    <div class="inicio">
      <section class="inicio__seccion" aria-labelledby="mas-comprados-titulo">
        <div class="inicio__cabecera">
          <h1 id="mas-comprados-titulo">Más comprados</h1>
          <a routerLink="/productos">Ver todos</a>
        </div>

        @if (productos.estaCargandoMasComprados()) {
          <p class="inicio__estado" role="status">Cargando productos…</p>
        } @else if (productos.mensajeErrorMasComprados(); as error) {
          <p class="inicio__estado inicio__estado--error" role="alert">{{ error }}</p>
        } @else if (productos.masComprados().length === 0) {
          <p class="inicio__estado">Todavía no hay productos publicados en la tienda.</p>
        } @else {
          <ul class="inicio__grilla">
            @for (producto of productos.masComprados(); track producto.id) {
              <li>
                <app-producto-card [producto]="producto" (agregar)="alAgregar($event)" />
              </li>
            }
          </ul>
        }

        @if (confirmacion(); as texto) {
          <p class="inicio__confirmacion" role="status">{{ texto }}</p>
        }
      </section>
    </div>
  `,
  styleUrl: './inicio.scss',
})
export class InicioComponent {
  protected readonly productos = inject(ProductosService);
  private readonly carrito = inject(CarritoService);
  protected readonly confirmacion = signal<string | null>(null);

  constructor() {
    this.productos.cargarMasComprados();
  }

  protected alAgregar(producto: ProductoCatalogo): void {
    this.carrito.agregar(producto);
    this.confirmacion.set(`“${producto.nombre}” se agregó al carrito.`);
  }
}
