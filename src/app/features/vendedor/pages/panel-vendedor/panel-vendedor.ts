import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { MARCAS } from '../../../marcas/data/marcas.data';
import { ProductoCardComponent } from '../../../productos/components/producto-card/producto-card';
import { TIPOS_DIAGRAMA } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';

/**
 * Prototipo del lado del vendedor: formulario para cargar los diagramas
 * que se muestran en la página de cada marca, con vista previa de lo cargado.
 */
@Component({
  selector: 'app-panel-vendedor',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    ProductoCardComponent,
  ],
  template: `
    <div class="panel-vendedor">
      <nav class="panel-vendedor__migas" aria-label="Migas de pan">
        <a routerLink="/">Inicio</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Panel del vendedor</span>
      </nav>
      <h1>Panel del vendedor</h1>
      <p class="panel-vendedor__descripcion">
        Cargá los diagramas que querés vender. Es solo un prototipo: lo que guardes aparece
        enseguida en la página de la marca.
      </p>
      <section class="panel-vendedor__bloque" aria-labelledby="titulo-formulario">
        <h2 id="titulo-formulario">Cargar un diagrama</h2>
        <form class="panel-vendedor__formulario" [formGroup]="formulario" (ngSubmit)="guardar()">
          <mat-form-field>
            <mat-label>Marca</mat-label>
            <mat-select formControlName="marcaSlug">
              @for (marca of marcas; track marca.slug) {
                <mat-option [value]="marca.slug">{{ marca.nombre }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Modelo</mat-label>
            <input matInput formControlName="modelo" placeholder="Ej.: Hilux" autocomplete="off" />
          </mat-form-field>
          <div class="panel-vendedor__fila">
            <mat-form-field>
              <mat-label>Año desde</mat-label>
              <input
                matInput
                formControlName="anioDesde"
                type="number"
                min="1980"
                [max]="anioActual"
                inputmode="numeric"
              />
            </mat-form-field>
            <mat-form-field>
              <mat-label>Año hasta</mat-label>
              <input
                matInput
                formControlName="anioHasta"
                type="number"
                min="1980"
                [max]="anioActual + 1"
                inputmode="numeric"
              />
            </mat-form-field>
          </div>
          @if (formulario.errors?.['rangoAnios']) {
            <p class="panel-vendedor__error" role="alert">
              El año “hasta” no puede ser anterior al año “desde”.
            </p>
          }
          <mat-form-field>
            <mat-label>Tipo de diagrama</mat-label>
            <mat-select formControlName="tipo">
              @for (tipo of tipos; track tipo) {
                <mat-option [value]="tipo">{{ tipo }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>Título del aviso</mat-label>
            <input
              matInput
              formControlName="titulo"
              placeholder="Ej.: Diagrama ECU Toyota Hilux 2.8"
              autocomplete="off"
            />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Precio (Gs.)</mat-label>
            <input
              matInput
              formControlName="precio"
              type="number"
              min="1000"
              step="1000"
              inputmode="numeric"
            />
          </mat-form-field>
          <button matButton="filled" type="submit" [disabled]="formulario.invalid">
            Guardar diagrama
          </button>
        </form>
        @if (confirmacion(); as confirmacion) {
          <p class="panel-vendedor__confirmacion" role="status">
            {{ confirmacion }}
            <a [routerLink]="['/marcas', ultimaMarca()]">Ver cómo quedó en la tienda</a>.
          </p>
        }
      </section>
      <section class="panel-vendedor__bloque" aria-labelledby="titulo-cargados">
        <h2 id="titulo-cargados">Diagramas cargados ({{ cargados().length }})</h2>
        @if (cargados().length > 0) {
          <ul class="panel-vendedor__grilla">
            @for (producto of cargados(); track producto.id) {
              <li>
                <app-producto-card [producto]="producto" />
              </li>
            }
          </ul>
        } @else {
          <p class="panel-vendedor__vacio">Todavía no cargaste ningún diagrama en este prototipo.</p>
        }
      </section>
    </div>
  `,
  styleUrl: './panel-vendedor.scss',
})
export class PanelVendedorComponent {
  private readonly constructorFormulario = inject(FormBuilder);
  private readonly productosService = inject(ProductosService);

  protected readonly marcas = MARCAS;
  protected readonly tipos = TIPOS_DIAGRAMA;
  protected readonly anioActual = 2026;

  protected readonly confirmacion = signal<string | null>(null);
  protected readonly ultimaMarca = signal<string>('toyota');

  protected readonly cargados = computed(() => this.productosService.todos());

  protected readonly formulario = this.constructorFormulario.nonNullable.group(
    {
      marcaSlug: ['toyota', Validators.required],
      modelo: ['', [Validators.required, Validators.maxLength(60)]],
      anioDesde: [2020, [Validators.required, Validators.min(1980), Validators.max(2026)]],
      anioHasta: [2024, [Validators.required, Validators.min(1980), Validators.max(2027)]],
      tipo: ['ECU' as (typeof TIPOS_DIAGRAMA)[number], Validators.required],
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      precio: [150000, [Validators.required, Validators.min(1000)]],
    },
    {
      validators: (grupo) => {
        const desde = grupo.get('anioDesde')?.value as number | null;
        const hasta = grupo.get('anioHasta')?.value as number | null;
        return desde !== null && hasta !== null && hasta < desde ? { rangoAnios: true } : null;
      },
    },
  );

  protected guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valores = this.formulario.getRawValue();
    const producto = this.productosService.agregar({
      marcaSlug: valores.marcaSlug,
      modelo: valores.modelo.trim(),
      anioDesde: valores.anioDesde,
      anioHasta: valores.anioHasta,
      tipo: valores.tipo,
      titulo: valores.titulo.trim(),
      precio: valores.precio,
    });
    this.ultimaMarca.set(producto.marcaSlug);
    this.confirmacion.set(`“${producto.titulo}” ya está visible en la tienda.`);
    this.formulario.patchValue({ modelo: '', titulo: '' });
  }
}
