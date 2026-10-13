import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatToolbar,
    MatNavList,
    MatListItem,
    MatButton,
  ],
  template: `
    <mat-sidenav-container class="admin-layout">
      <mat-sidenav class="admin-layout__panel" mode="side" opened>
        <div class="admin-layout__marca">
          <span>Red Automotriz</span>
          <small>Administración</small>
        </div>
        <mat-nav-list aria-label="Menú administrativo">
          <a mat-list-item routerLink="/admin" routerLinkActive="admin-layout__activo" [routerLinkActiveOptions]="{ exact: true }">
            Panel
          </a>
          <a mat-list-item routerLink="/admin/productos" routerLinkActive="admin-layout__activo">Productos</a>
          <a mat-list-item routerLink="/admin/clientes" routerLinkActive="admin-layout__activo">Clientes</a>
        </mat-nav-list>
        <div class="admin-layout__pie">
          <a matButton="outlined" routerLink="/">Ver tienda</a>
          <button matButton type="button" (click)="cerrarSesion()">Cerrar sesión</button>
        </div>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar class="admin-layout__barra">
          <span>Área del administrador</span>
        </mat-toolbar>
        <main class="admin-layout__contenido" tabindex="-1">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrl: './admin-layout.scss',
  host: {
    class: 'app-admin-layout',
  },
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);

  protected cerrarSesion(): void {
    this.auth.cerrarSesion();
  }
}
