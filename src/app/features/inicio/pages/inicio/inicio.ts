import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { CategoriaChipsComponent } from '../../../productos/components/categoria-chips/categoria-chips';
import { NewsletterComponent } from '../../../productos/components/newsletter/newsletter';
import { ProductoCardComponent } from '../../../productos/components/producto-card/producto-card';
import { ProductoCatalogo } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';

@Component({
  selector: 'app-inicio',
  imports: [
    RouterLink,
    MatButton,
    ProductoCardComponent,
    CategoriaChipsComponent,
    NewsletterComponent,
  ],
  template: `
    <div class="inicio">
      <section class="inicio__hero" aria-labelledby="inicio-hero-titulo">
        <p class="inicio__marca">Red Automotriz</p>
        <h1 id="inicio-hero-titulo">Todo lo que tu taller necesita, en un solo lugar</h1>
        <p class="inicio__bajada">
          Productos automotrices con stock real, precio claro y compra online.
        </p>
        <div class="inicio__cta">
          <a matButton="filled" href="#catalogo">Ver catálogo</a>
          <a matButton="outlined" routerLink="/productos">Todos los productos</a>
        </div>
      </section>

      <section id="catalogo" class="inicio__catalogo" aria-labelledby="catalogo-titulo">
        <div class="inicio__catalogo-cabecera">
          <h2 id="catalogo-titulo">Catálogo</h2>
          <a routerLink="/productos">Ver todos</a>
        </div>

        @if (productos.categoriasLista().length > 0) {
          <app-categoria-chips
            [categorias]="productos.categoriasLista()"
            [categoriaId]="productos.categoriaSeleccionada()"
            (categoriaIdChange)="productos.setCategoria($event)"
          />
        }

        @if (productos.estaCargando()) {
          <p class="inicio__estado" role="status">Cargando productos…</p>
        } @else if (productos.mensajeError(); as error) {
          <p class="inicio__estado inicio__estado--error" role="alert">{{ error }}</p>
        } @else if (productos.filtrados().length === 0) {
          <p class="inicio__estado">Todavía no hay productos publicados en la tienda.</p>
        } @else {
          <ul class="inicio__grilla">
            @for (producto of productos.filtrados(); track producto.id) {
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

      <div id="newsletter">
        <app-newsletter />
      </div>
    </div>
  `,
  styleUrl: './inicio.scss',
})
export class InicioComponent {
  protected readonly productos = inject(ProductosService);
  private readonly carrito = inject(CarritoService);
  protected readonly confirmacion = signal<string | null>(null);

  constructor() {
    this.productos.cargar();
  }

  protected alAgregar(producto: ProductoCatalogo): void {
    this.carrito.agregar(producto);
    this.confirmacion.set(`“${producto.nombre}” se agregó al carrito.`);
  }
}
