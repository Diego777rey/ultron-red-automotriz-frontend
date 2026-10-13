import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { ProductosService } from '../../../productos/services/productos.service';

@Component({
  selector: 'app-productos-lista',
  imports: [
    RouterLink,
    MatButton,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
  ],
  template: `
    <div class="productos-lista">
      <header class="productos-lista__cabecera">
        <h1>Productos (diagramas)</h1>
        <a matButton="filled" routerLink="/admin/productos/nuevo">Nuevo</a>
      </header>
      <table mat-table [dataSource]="productos.todos()" class="productos-lista__tabla">
        <ng-container matColumnDef="titulo">
          <th mat-header-cell *matHeaderCellDef>Título</th>
          <td mat-cell *matCellDef="let producto">{{ producto.titulo }}</td>
        </ng-container>
        <ng-container matColumnDef="marca">
          <th mat-header-cell *matHeaderCellDef>Marca</th>
          <td mat-cell *matCellDef="let producto">{{ producto.marcaSlug }}</td>
        </ng-container>
        <ng-container matColumnDef="precio">
          <th mat-header-cell *matHeaderCellDef>Precio</th>
          <td mat-cell *matCellDef="let producto">Gs. {{ producto.precio.toLocaleString('es-PY') }}</td>
        </ng-container>
        <ng-container matColumnDef="activo">
          <th mat-header-cell *matHeaderCellDef>Visible</th>
          <td mat-cell *matCellDef="let producto">{{ producto.activo === false ? 'No' : 'Sí' }}</td>
        </ng-container>
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let producto">
            <a matButton [routerLink]="['/admin/productos', producto.id, 'editar']">Editar</a>
            <button matButton type="button" (click)="eliminar(producto.id)">Eliminar</button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas"></tr>
      </table>
    </div>
  `,
  styleUrl: './productos-lista.scss',
})
export class ProductosListaComponent {
  protected readonly productos = inject(ProductosService);
  protected readonly columnas = ['titulo', 'marca', 'precio', 'activo', 'acciones'];

  protected eliminar(id: string): void {
    this.productos.eliminar(id);
  }
}
