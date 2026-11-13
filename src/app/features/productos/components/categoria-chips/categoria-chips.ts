import { Component, input, model } from '@angular/core';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { CategoriaCatalogo } from '../../models/producto.model';

/** Chips para filtrar el catálogo por categoría. */
@Component({
  selector: 'app-categoria-chips',
  imports: [MatChipListbox, MatChipOption],
  template: `
    <mat-chip-listbox
      class="categoria-chips"
      aria-label="Filtrar por categoría"
      [multiple]="false"
      [hideSingleSelectionIndicator]="true"
      [value]="categoriaId()"
      (change)="categoriaId.set($event.value ?? null)"
    >
      <mat-chip-option [value]="null">Todas</mat-chip-option>
      @for (categoria of categorias(); track categoria.id) {
        <mat-chip-option [value]="categoria.id">{{ categoria.nombre }}</mat-chip-option>
      }
    </mat-chip-listbox>
  `,
  styles: `
    .categoria-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-bottom: 20px;
    }
  `,
})
export class CategoriaChipsComponent {
  readonly categorias = input.required<readonly CategoriaCatalogo[]>();
  readonly categoriaId = model<number | null>(null);
}
