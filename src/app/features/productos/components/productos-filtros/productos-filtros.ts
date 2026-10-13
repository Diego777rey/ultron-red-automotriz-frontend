import { Component, input, model } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

/**
 * Filtros de la página de marca: modelo y año. Los valores se enlazan
 * con `[(modelo)]` y `[(anio)]` desde la página que los usa.
 */
@Component({
  selector: 'app-productos-filtros',
  imports: [MatFormField, MatLabel, MatSelect, MatOption, MatButton],
  template: `
    <form class="filtros" aria-label="Filtrar diagramas por modelo y año" (submit)="$event.preventDefault()">
      <mat-form-field class="filtros__campo" subscriptSizing="dynamic">
        <mat-label>Modelo</mat-label>
        <mat-select [(value)]="modelo" aria-label="Filtrar por modelo">
          <mat-option value="">Todos los modelos</mat-option>
          @for (opcion of modelos(); track opcion) {
            <mat-option [value]="opcion">{{ opcion }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field class="filtros__campo" subscriptSizing="dynamic">
        <mat-label>Año</mat-label>
        <mat-select [(value)]="anio" aria-label="Filtrar por año">
          <mat-option [value]="null">Todos los años</mat-option>
          @for (opcion of anios(); track opcion) {
            <mat-option [value]="opcion">{{ opcion }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      @if (tieneFiltros()) {
        <button matButton="outlined" type="button" (click)="limpiar()">Limpiar</button>
      }
    </form>
  `,
  styleUrl: './productos-filtros.scss',
})
export class ProductosFiltrosComponent {
  readonly modelos = input.required<readonly string[]>();
  readonly anios = input.required<readonly number[]>();

  readonly modelo = model('');
  readonly anio = model<number | null>(null);

  protected tieneFiltros(): boolean {
    return this.modelo() !== '' || this.anio() !== null;
  }

  protected limpiar(): void {
    this.modelo.set('');
    this.anio.set(null);
  }
}
