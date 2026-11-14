import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { NewsletterComponent } from '../../../productos/components/newsletter/newsletter';
import { ProductoCardComponent } from '../../../productos/components/producto-card/producto-card';
import { ProductoCatalogo } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, MatButton, ProductoCardComponent, NewsletterComponent],
  template: `
    <div class="inicio">
      <section class="inicio__hero" aria-labelledby="inicio-hero-titulo">
        <p class="inicio__marca">Red Automotriz</p>
        <h1 id="inicio-hero-titulo">Herramientas, taller, ferretería, autos y motos</h1>
        <p class="inicio__bajada">
          Tienda online con stock real y precio claro. Comprá sin registrarte; creá tu cuenta solo
          si querés guardar tus datos.
        </p>
        <div class="inicio__cta">
          <a matButton="filled" routerLink="/productos">Ver catálogo</a>
          <a matButton="outlined" href="#categorias">Comprá por categoría</a>
        </div>
      </section>

      <section id="categorias" class="inicio__seccion" aria-labelledby="categorias-titulo">
        <div class="inicio__cabecera">
          <h2 id="categorias-titulo">Comprá por categoría</h2>
          <p>Departamentos para taller, ferretería, vehículos y más.</p>
        </div>

        @if (productos.categoriasNavLista().length === 0) {
          <p class="inicio__estado" role="status">Cargando categorías…</p>
        } @else {
          <ul class="inicio__categorias">
            @for (categoria of productos.categoriasNavLista(); track categoria.id) {
              <li>
                <a
                  class="inicio__categoria"
                  routerLink="/productos"
                  [queryParams]="{ categoria: categoria.id }"
                >
                  <span class="inicio__categoria-nombre">{{ categoria.nombre }}</span>
                  <span class="inicio__categoria-cta" aria-hidden="true">Ver productos</span>
                </a>
              </li>
            }
          </ul>
        }
      </section>

      <section id="catalogo" class="inicio__seccion" aria-labelledby="destacados-titulo">
        <div class="inicio__cabecera">
          <h2 id="destacados-titulo">Productos destacados</h2>
          <a routerLink="/productos">Ver todos</a>
        </div>

        @if (productos.estaCargando()) {
          <p class="inicio__estado" role="status">Cargando productos…</p>
        } @else if (productos.mensajeError(); as error) {
          <p class="inicio__estado inicio__estado--error" role="alert">{{ error }}</p>
        } @else if (productos.destacados().length === 0) {
          <p class="inicio__estado">Todavía no hay productos publicados en la tienda.</p>
        } @else {
          <ul class="inicio__grilla">
            @for (producto of productos.destacados(); track producto.id) {
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
    this.productos.aplicarFiltros({ filter: '', idCategoria: null });
  }

  protected alAgregar(producto: ProductoCatalogo): void {
    this.carrito.agregar(producto);
    this.confirmacion.set(`“${producto.nombre}” se agregó al carrito.`);
  }
}
