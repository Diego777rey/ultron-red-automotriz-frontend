import { Component, output, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { TIPOS_DIAGRAMA, TipoDiagrama } from '../../models/producto.model';

export interface FiltrosProducto {
  modelo?: string;
  anio?: number;
  tipo?: TipoDiagrama;
}

@Component({
  selector: 'app-filtros-producto',
  imports: [MatFormField, MatLabel, MatSelect, MatOption, MatButton],
  template: `
    <div class="filtros-producto">
      <h3>Filtrar productos</h3>

      <div class="filtros-producto__campos">
        <mat-form-field>
          <mat-label>Modelo</mat-label>
          <mat-select [(value)]="modeloSeleccionado" (selectionChange)="aplicarFiltros()">
            <mat-option [value]="undefined">Todos los modelos</mat-option>
            @for (modelo of modelos(); track modelo) {
              <mat-option [value]="modelo">{{ modelo }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Año</mat-label>
          <mat-select [(value)]="anioSeleccionado" (selectionChange)="aplicarFiltros()">
            <mat-option [value]="undefined">Todos los años</mat-option>
            @for (anio of anios(); track anio) {
              <mat-option [value]="anio">{{ anio }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Tipo de diagrama</mat-label>
          <mat-select [(value)]="tipoSeleccionado" (selectionChange)="aplicarFiltros()">
            <mat-option [value]="undefined">Todos los tipos</mat-option>
            @for (tipo of tiposDiagrama; track tipo) {
              <mat-option [value]="tipo">{{ tipo }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <button mat-stroked-button (click)="limpiarFiltros()">
          Limpiar filtros
        </button>
      </div>
    </div>
  `,
  styleUrl: './filtros-producto.scss',
})
export class FiltrosProductoComponent {
  readonly modelos = signal<string[]>([]);
  readonly anios = signal<number[]>([]);
  readonly filtrosChange = output<FiltrosProducto>();

  protected readonly tiposDiagrama = TIPOS_DIAGRAMA;
  protected modeloSeleccionado?: string;
  protected anioSeleccionado?: number;
  protected tipoSeleccionado?: TipoDiagrama;

  setModelos(modelos: string[]): void {
    this.modelos.set(modelos.sort());
  }

  setAnios(anios: number[]): void {
    this.anios.set(anios.sort((a, b) => b - a));
  }

  protected aplicarFiltros(): void {
    this.filtrosChange.emit({
      modelo: this.modeloSeleccionado,
      anio: this.anioSeleccionado,
      tipo: this.tipoSeleccionado,
    });
  }

  limpiarFiltros(): void {
    this.modeloSeleccionado = undefined;
    this.anioSeleccionado = undefined;
    this.tipoSeleccionado = undefined;
    this.aplicarFiltros();
  }
}
