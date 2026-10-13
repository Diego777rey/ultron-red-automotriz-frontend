import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { Producto, TIPOS_DIAGRAMA, TipoDiagrama } from '../../models/producto.model';
import { MARCAS } from '../../data/marcas.data';

@Component({
  selector: 'app-admin-productos',
  imports: [
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    MatButton,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
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
    MatIcon,
    MatIconButton,
    CurrencyPipe,
  ],
  template: `
    <div class="admin-productos">
      <h1>Administración de productos</h1>
      <p class="admin-productos__descripcion">
        Panel de gestión para cargar y administrar diagramas eléctricos
      </p>

      <mat-card class="admin-productos__formulario">
        <mat-card-header>
          <mat-card-title>{{ editando() ? 'Editar producto' : 'Nuevo producto' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form class="admin-productos__form" #formulario="ngForm">
            <mat-form-field>
              <mat-label>Título</mat-label>
              <input matInput [(ngModel)]="productoActual.titulo" name="titulo" required />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Descripción</mat-label>
              <textarea
                matInput
                [(ngModel)]="productoActual.descripcion"
                name="descripcion"
                rows="3"
                required
              ></textarea>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Marca</mat-label>
              <mat-select [(ngModel)]="productoActual.marca" name="marca" required>
                @for (marca of marcas; track marca.slug) {
                  <mat-option [value]="marca.slug">{{ marca.nombre }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Modelo</mat-label>
              <input matInput [(ngModel)]="productoActual.modelo" name="modelo" required />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Año</mat-label>
              <input
                matInput
                type="number"
                [(ngModel)]="productoActual.anio"
                name="anio"
                required
                min="1990"
                max="2030"
              />
            </mat-form-field>

            <mat-form-field>
              <mat-label>Tipo de diagrama</mat-label>
              <mat-select [(ngModel)]="productoActual.tipo" name="tipo" required>
                @for (tipo of tiposDiagrama; track tipo) {
                  <mat-option [value]="tipo">{{ tipo }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Precio (ARS)</mat-label>
              <input
                matInput
                type="number"
                [(ngModel)]="productoActual.precio"
                name="precio"
                required
                min="0"
              />
            </mat-form-field>

            <mat-form-field>
              <mat-label>URL de imagen (opcional)</mat-label>
              <input matInput [(ngModel)]="productoActual.imagen" name="imagen" />
            </mat-form-field>

            <div class="admin-productos__form-actions">
              <button
                mat-flat-button
                color="primary"
                type="button"
                (click)="guardarProducto()"
                [disabled]="!formulario.valid"
              >
                {{ editando() ? 'Actualizar' : 'Guardar' }} producto
              </button>
              @if (editando()) {
                <button mat-stroked-button type="button" (click)="cancelarEdicion()">
                  Cancelar
                </button>
              }
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="admin-productos__listado">
        <mat-card-header>
          <mat-card-title>Productos cargados</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (productos().length > 0) {
            <div class="admin-productos__tabla-container">
              <table mat-table [dataSource]="productos()">
                <ng-container matColumnDef="titulo">
                  <th mat-header-cell *matHeaderCellDef>Título</th>
                  <td mat-cell *matCellDef="let producto">{{ producto.titulo }}</td>
                </ng-container>

                <ng-container matColumnDef="marca">
                  <th mat-header-cell *matHeaderCellDef>Marca</th>
                  <td mat-cell *matCellDef="let producto">{{ obtenerNombreMarca(producto.marca) }}</td>
                </ng-container>

                <ng-container matColumnDef="modelo">
                  <th mat-header-cell *matHeaderCellDef>Modelo</th>
                  <td mat-cell *matCellDef="let producto">{{ producto.modelo }}</td>
                </ng-container>

                <ng-container matColumnDef="anio">
                  <th mat-header-cell *matHeaderCellDef>Año</th>
                  <td mat-cell *matCellDef="let producto">{{ producto.anio }}</td>
                </ng-container>

                <ng-container matColumnDef="tipo">
                  <th mat-header-cell *matHeaderCellDef>Tipo</th>
                  <td mat-cell *matCellDef="let producto">{{ producto.tipo }}</td>
                </ng-container>

                <ng-container matColumnDef="precio">
                  <th mat-header-cell *matHeaderCellDef>Precio</th>
                  <td mat-cell *matCellDef="let producto">
                    {{ producto.precio | currency: 'ARS':'symbol-narrow':'1.0-0' }}
                  </td>
                </ng-container>

                <ng-container matColumnDef="acciones">
                  <th mat-header-cell *matHeaderCellDef>Acciones</th>
                  <td mat-cell *matCellDef="let producto">
                    <button
                      mat-icon-button
                      (click)="editarProducto(producto)"
                      aria-label="Editar producto"
                    >
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button
                      mat-icon-button
                      color="warn"
                      (click)="eliminarProducto(producto.id)"
                      aria-label="Eliminar producto"
                    >
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="columnasTabla"></tr>
                <tr mat-row *matRowDef="let row; columns: columnasTabla"></tr>
              </table>
            </div>
          } @else {
            <p class="admin-productos__vacio">No hay productos cargados</p>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './admin-productos.scss',
})
export class AdminProductosComponent {
  protected readonly marcas = MARCAS;
  protected readonly tiposDiagrama = TIPOS_DIAGRAMA;
  protected readonly productos = signal<Producto[]>([]);
  protected readonly editando = signal(false);
  protected readonly columnasTabla = ['titulo', 'marca', 'modelo', 'anio', 'tipo', 'precio', 'acciones'];

  protected productoActual: Partial<Producto> & { tipo: TipoDiagrama } = {
    titulo: '',
    descripcion: '',
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    tipo: 'ECU',
    precio: 0,
    imagen: '',
    disponible: true,
  };

  protected guardarProducto(): void {
    if (this.editando()) {
      const index = this.productos().findIndex((p) => p.id === this.productoActual.id);
      if (index !== -1) {
        const productosActualizados = [...this.productos()];
        productosActualizados[index] = this.productoActual as Producto;
        this.productos.set(productosActualizados);
      }
    } else {
      const nuevoProducto: Producto = {
        ...this.productoActual,
        id: Date.now().toString(),
      } as Producto;
      this.productos.set([...this.productos(), nuevoProducto]);
    }

    this.resetearFormulario();
  }

  protected editarProducto(producto: Producto): void {
    this.productoActual = { ...producto };
    this.editando.set(true);
  }

  protected eliminarProducto(id: string): void {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      this.productos.set(this.productos().filter((p) => p.id !== id));
    }
  }

  protected cancelarEdicion(): void {
    this.resetearFormulario();
  }

  protected obtenerNombreMarca(slug: string): string {
    return this.marcas.find((m) => m.slug === slug)?.nombre ?? slug;
  }

  private resetearFormulario(): void {
    this.productoActual = {
      titulo: '',
      descripcion: '',
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      tipo: 'ECU',
      precio: 0,
      imagen: '',
      disponible: true,
    };
    this.editando.set(false);
  }
}
