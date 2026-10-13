import { Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { MARCAS } from '../../../marcas/data/marcas.data';
import { TIPOS_DIAGRAMA } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';

@Component({
  selector: 'app-producto-formulario',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatButton,
  ],
  template: `
    <div class="producto-formulario">
      <h1>{{ esEdicion() ? 'Editar diagrama' : 'Nuevo diagrama' }}</h1>
      <form class="producto-formulario__form" [formGroup]="formulario" (ngSubmit)="guardar()">
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
          <input matInput formControlName="modelo" />
        </mat-form-field>
        <div class="producto-formulario__fila">
          <mat-form-field>
            <mat-label>Año desde</mat-label>
            <input matInput type="number" formControlName="anioDesde" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Año hasta</mat-label>
            <input matInput type="number" formControlName="anioHasta" />
          </mat-form-field>
        </div>
        <mat-form-field>
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="tipo">
            @for (tipo of tipos; track tipo) {
              <mat-option [value]="tipo">{{ tipo }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Precio (Gs.)</mat-label>
          <input matInput type="number" formControlName="precio" />
        </mat-form-field>
        <mat-checkbox formControlName="activo">Visible en la tienda</mat-checkbox>
        <div class="producto-formulario__acciones">
          <button matButton="filled" type="submit" [disabled]="formulario.invalid">Guardar</button>
          <a matButton routerLink="/admin/productos">Cancelar</a>
        </div>
      </form>
    </div>
  `,
  styleUrl: './producto-formulario.scss',
})
export class ProductoFormularioComponent {
  readonly id = input<string | undefined>();

  private readonly fb = inject(FormBuilder);
  private readonly productos = inject(ProductosService);
  private readonly router = inject(Router);

  protected readonly marcas = MARCAS;
  protected readonly tipos = TIPOS_DIAGRAMA;

  private readonly productoExistente = linkedSignal(() => {
    const id = this.id();
    return id ? this.productos.obtener(id) : undefined;
  });

  protected readonly esEdicion = computed(() => Boolean(this.id()));

  protected readonly formulario = this.fb.nonNullable.group({
    marcaSlug: ['toyota', Validators.required],
    modelo: ['', Validators.required],
    anioDesde: [2020, [Validators.required, Validators.min(1980)]],
    anioHasta: [2024, [Validators.required, Validators.min(1980)]],
    tipo: ['ECU' as (typeof TIPOS_DIAGRAMA)[number], Validators.required],
    titulo: ['', Validators.required],
    precio: [150000, [Validators.required, Validators.min(1000)]],
    activo: [true],
  });

  private readonly sincronizarEdicion = effect(() => {
    const existente = this.productoExistente();
    if (existente) {
      this.formulario.patchValue(existente);
    }
  });

  protected guardar(): void {
    if (this.formulario.invalid) {
      return;
    }
    const valores = this.formulario.getRawValue();
    const id = this.id();
    if (id) {
      this.productos.actualizar(id, valores);
    } else {
      this.productos.crear(valores);
    }
    void this.router.navigate(['/admin/productos']);
  }
}
