import { Component, ElementRef, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MARCAS } from '../../../marcas/data/marcas.data';
import {
  CATEGORIAS_PRODUCTO,
  CategoriaProducto,
  NuevoProducto,
  Producto,
} from '../../models/producto.model';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-nuevo-producto',
  imports: [RouterLink, MatAnchor, MatButton, MatIcon],
  template: `
    <section class="alta" aria-labelledby="titulo-alta">
      <nav class="alta__migas" aria-label="Migas de pan">
        <a routerLink="/">Inicio</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Publicar producto</span>
      </nav>

      <div class="alta__encabezado">
        <p>Panel del vendedor · Prototipo</p>
        <h1 id="titulo-alta">Publicar un diagrama</h1>
        <span>Completá los datos que verá el comprador en el catálogo de la marca.</span>
      </div>

      @if (productoCreado(); as producto) {
        <div #confirmacion class="alta__confirmacion" role="status" tabindex="-1">
          <mat-icon aria-hidden="true">check_circle</mat-icon>
          <div>
            <h2>Producto publicado</h2>
            <p>
              “{{ producto.nombre }}” ya está disponible en el catálogo de
              {{ nombreMarcaCreada() }}.
            </p>
            <a mat-flat-button [routerLink]="['/marcas', producto.marcaSlug]">
              Ver en el catálogo
            </a>
            <button mat-button type="button" (click)="crearOtro()">Publicar otro</button>
          </div>
        </div>
      } @else {
        <form class="alta__formulario" (submit)="publicar($event)">
          <fieldset>
            <legend>Vehículo compatible</legend>
            <div class="alta__campos">
              <label>
                <span>Marca</span>
                <select
                  required
                  [value]="borrador().marcaSlug"
                  (change)="actualizarMarca($event)"
                >
                  @for (marca of marcas; track marca.slug) {
                    <option [value]="marca.slug">{{ marca.nombre }}</option>
                  }
                </select>
              </label>

              <label>
                <span>Modelo o línea</span>
                <input
                  required
                  minlength="2"
                  autocomplete="off"
                  placeholder="Ej.: Corolla 2.0"
                  [value]="borrador().modelo"
                  (input)="actualizarTexto('modelo', $event)"
                />
              </label>

              <label>
                <span>Año</span>
                <input
                  required
                  type="number"
                  inputmode="numeric"
                  min="1950"
                  [max]="anioMaximo"
                  placeholder="2022"
                  [value]="borrador().anio || ''"
                  (input)="actualizarNumero('anio', $event)"
                />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Información del producto</legend>
            <div class="alta__campos">
              <label class="alta__campo-ancho">
                <span>Nombre del producto</span>
                <input
                  required
                  minlength="5"
                  autocomplete="off"
                  placeholder="Ej.: Diagrama eléctrico de ECU"
                  [value]="borrador().nombre"
                  (input)="actualizarTexto('nombre', $event)"
                />
              </label>

              <label>
                <span>Categoría</span>
                <select
                  required
                  [value]="borrador().categoria"
                  (change)="actualizarCategoria($event)"
                >
                  @for (categoria of categorias; track categoria) {
                    <option [value]="categoria">{{ categoria }}</option>
                  }
                </select>
              </label>

              <label>
                <span>Precio (ARS)</span>
                <input
                  required
                  type="number"
                  inputmode="decimal"
                  min="1"
                  step="1"
                  placeholder="12500"
                  [value]="borrador().precio || ''"
                  (input)="actualizarNumero('precio', $event)"
                />
              </label>

              <label class="alta__campo-ancho">
                <span>Descripción</span>
                <textarea
                  required
                  minlength="10"
                  rows="4"
                  placeholder="Detallá qué incluye el diagrama y sus conexiones."
                  [value]="borrador().descripcion"
                  (input)="actualizarTexto('descripcion', $event)"
                ></textarea>
                <small>Mínimo 10 caracteres.</small>
              </label>
            </div>
          </fieldset>

          <div class="alta__nota">
            <mat-icon fontSet="material-icons-outlined" aria-hidden="true">info</mat-icon>
            <p>
              Este prototipo guarda la publicación únicamente en este navegador. La integración con
              inventario, imágenes y pagos se realizará al conectar el backend.
            </p>
          </div>

          <div class="alta__acciones">
            <a mat-button routerLink="/">Cancelar</a>
            <button mat-flat-button type="submit">
              <mat-icon>publish</mat-icon>
              Publicar producto
            </button>
          </div>
        </form>
      }
    </section>
  `,
  styleUrl: './nuevo-producto.scss',
})
export class NuevoProductoComponent {
  private readonly productosService = inject(ProductosService);
  private readonly confirmacion = viewChild<ElementRef<HTMLElement>>('confirmacion');

  protected readonly marcas = MARCAS;
  protected readonly categorias = CATEGORIAS_PRODUCTO;
  protected readonly anioMaximo = new Date().getFullYear() + 1;
  protected readonly productoCreado = signal<Producto | undefined>(undefined);
  protected readonly borrador = signal<NuevoProducto>(this.borradorInicial());
  protected readonly nombreMarcaCreada = computed(
    () =>
      MARCAS.find((marca) => marca.slug === this.productoCreado()?.marcaSlug)?.nombre ??
      'la marca seleccionada',
  );

  protected actualizarMarca(evento: Event): void {
    this.borrador.update((valor) => ({
      ...valor,
      marcaSlug: (evento.target as HTMLSelectElement).value,
    }));
  }

  protected actualizarCategoria(evento: Event): void {
    this.borrador.update((valor) => ({
      ...valor,
      categoria: (evento.target as HTMLSelectElement).value as CategoriaProducto,
    }));
  }

  protected actualizarTexto(
    campo: 'nombre' | 'modelo' | 'descripcion',
    evento: Event,
  ): void {
    const valorCampo = (evento.target as HTMLInputElement | HTMLTextAreaElement).value;
    this.borrador.update((valor) => ({ ...valor, [campo]: valorCampo }));
  }

  protected actualizarNumero(campo: 'anio' | 'precio', evento: Event): void {
    const valorCampo = Number((evento.target as HTMLInputElement).value);
    this.borrador.update((valor) => ({ ...valor, [campo]: valorCampo }));
  }

  protected publicar(evento: Event): void {
    evento.preventDefault();
    this.productoCreado.set(this.productosService.agregar(this.borrador()));
    afterNextRender(() => this.confirmacion()?.nativeElement.focus());
  }

  protected crearOtro(): void {
    this.productoCreado.set(undefined);
    this.borrador.set(this.borradorInicial());
  }

  private borradorInicial(): NuevoProducto {
    return {
      marcaSlug: MARCAS[0]?.slug ?? '',
      nombre: '',
      modelo: '',
      anio: 0,
      categoria: CATEGORIAS_PRODUCTO[0],
      descripcion: '',
      precio: 0,
    };
  }
}
