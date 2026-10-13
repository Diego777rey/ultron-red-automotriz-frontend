import { Component, inject, signal } from '@angular/core';
import { FormField, form, required, email, minLength } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-registro-cliente',
  imports: [RouterLink, FormField, MatFormField, MatLabel, MatInput, MatButton],
  template: `
    <div class="cuenta-auth">
      <h1>Crear cuenta de cliente</h1>
      <p>Registrate para agregar diagramas al carrito y pagar con tarjeta.</p>
      <form class="cuenta-auth__formulario" (submit)="enviar($event)">
        <mat-form-field>
          <mat-label>Nombre completo</mat-label>
          <input matInput autocomplete="name" [formField]="formulario.nombre" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Correo electrónico</mat-label>
          <input matInput type="email" autocomplete="email" [formField]="formulario.email" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Contraseña</mat-label>
          <input
            matInput
            type="password"
            autocomplete="new-password"
            [formField]="formulario.contrasena"
          />
        </mat-form-field>
        @if (error(); as error) {
          <p class="cuenta-auth__error" role="alert">{{ error }}</p>
        }
        <button matButton="filled" type="submit" [disabled]="procesando()">Crear cuenta</button>
      </form>
      <p>
        ¿Ya tenés cuenta? <a routerLink="/cuenta/iniciar-sesion">Iniciar sesión</a>
      </p>
    </div>
  `,
  styleUrl: '../cuenta-auth.scss',
})
export class RegistroClienteComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly datos = signal({ nombre: '', email: '', contrasena: '' });
  protected readonly formulario = form(this.datos, (f) => {
    required(f.nombre, { message: 'El nombre es obligatorio.' });
    required(f.email, { message: 'El correo es obligatorio.' });
    email(f.email, { message: 'Correo inválido.' });
    minLength(f.contrasena, 8, { message: 'Mínimo 8 caracteres.' });
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
    const datos = this.datos();
    const resultado = await this.auth.registrarCliente(datos);
    this.procesando.set(false);
    if (!resultado.ok) {
      this.error.set(resultado.mensaje);
      return;
    }
    await this.router.navigateByUrl('/');
  }
}
