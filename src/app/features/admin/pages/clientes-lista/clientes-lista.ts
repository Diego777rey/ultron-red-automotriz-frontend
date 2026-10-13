import { Component, inject } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-clientes-lista',
  imports: [
    DatePipe,
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
    <div class="clientes-lista">
      <h1>Clientes registrados</h1>
      <p>Cuentas con rol cliente que pueden comprar en la tienda.</p>
      <table mat-table [dataSource]="clientes" class="clientes-lista__tabla">
        <ng-container matColumnDef="nombre">
          <th mat-header-cell *matHeaderCellDef>Nombre</th>
          <td mat-cell *matCellDef="let cliente">{{ cliente.nombre }}</td>
        </ng-container>
        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>Correo</th>
          <td mat-cell *matCellDef="let cliente">{{ cliente.email }}</td>
        </ng-container>
        <ng-container matColumnDef="creadoEn">
          <th mat-header-cell *matHeaderCellDef>Registro</th>
          <td mat-cell *matCellDef="let cliente">{{ cliente.creadoEn | date: 'short' }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas"></tr>
      </table>
    </div>
  `,
  styleUrl: './clientes-lista.scss',
})
export class ClientesListaComponent {
  private readonly auth = inject(AuthService);
  protected readonly clientes = this.auth.listarClientes();
  protected readonly columnas = ['nombre', 'email', 'creadoEn'];
}
