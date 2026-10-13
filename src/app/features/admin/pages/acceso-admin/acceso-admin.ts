import { Component, inject, signal } from '@angular/core';
import { FormField, form, required, email } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { esAdministrador } from '../../../../core/models/rol-usuario';

@Component({
  selector: 'app-acceso-admin',
  imports: [RouterLink, FormField, MatFormField, MatLabel, MatInput, MatButton],
  template: `
    <div class="cuenta-auth">
      <h1>Acceso administrativo</h1>
      <p>Ingresá con la cuenta del dueño o administrador de Red Automotriz.</p>
      <form class="cuenta-auth__formulario" (submit)="enviar($event)">
        <mat-form-field>
          <mat-label>Correo</mat-label>
          <input matInput type="email" autocomplete="username" [formField]="formulario.email" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" autocomplete="current-password" [formField]="formulario.contrasena" />
        </mat-form-field>
        @if (error(); as error) {
          <p class="cuenta-auth__error" role="alert">{{ error }}</p>
        }
        <button matButton="filled" type="submit" [disabled]="procesando()">Entrar al panel</button>
      </form>
      <p><a routerLink="/">Volver a la tienda</a></p>
    </div>
  `,
  styleUrl: '../../../cuenta/pages/cuenta-auth.scss',
})
export class AccesoAdminComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly credenciales = signal({ email: '', contrasena: '' });
  protected readonly formulario = form(this.credenciales, (f) => {
    required(f.email);
    email(f.email);
    required(f.contrasena);
  });

  protected readonly error = signal<string | null>(null);
  protected readonly procesando = signal(false);

  protected async enviar(evento: Event): Promise<void> {
    evento.preventDefault();
    this.error.set(null);
    if (this.formulario().invalid()) {
      return;
    }
    this.procesando.set(true);
    const { email, contrasena } = this.credenciales();
    const resultado = await this.auth.iniciarSesion(email, contrasena);
    this.procesando.set(false);
    if (!resultado.ok) {
      this.error.set(resultado.mensaje);
      return;
    }
    if (!esAdministrador(resultado.usuario.rol)) {
      this.auth.cerrarSesion();
      this.error.set('Esta cuenta no tiene permisos de administrador.');
      return;
    }
    await this.router.navigateByUrl('/admin');
  }
}
