import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { GraphqlRequestError } from '../../../../core/graphql/graphql.service';

function contraseñasIguales(grupo: AbstractControl): ValidationErrors | null {
  const password = grupo.get('password')?.value as string;
  const confirmacion = grupo.get('passwordConfirmacion')?.value as string;
  if (!password || !confirmacion) {
    return null;
  }
  return password === confirmacion ? null : { contraseñasDistintas: true };
}

@Component({
  selector: 'app-registro',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatError,
    MatInput,
    MatButton,
  ],
  template: `
    <div class="cuenta-form">
      <nav class="cuenta-form__migas" aria-label="Migas de pan">
        <a routerLink="/">Inicio</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Crear cuenta</span>
      </nav>

      <h1>Creá tu cuenta</h1>
      <p class="cuenta-form__bajada">
        Registrate para comprar más rápido la próxima vez. Podés seguir explorando el catálogo sin
        cuenta.
      </p>

      <form class="cuenta-form__campos" [formGroup]="formulario" (ngSubmit)="enviar()">
        <p class="cuenta-form__paso">1 · Datos personales</p>
        <div class="cuenta-form__fila">
          <mat-form-field>
            <mat-label>Nombre</mat-label>
            <input matInput formControlName="nombre" autocomplete="given-name" required />
            @if (formulario.controls.nombre.touched && formulario.controls.nombre.invalid) {
              <mat-error>Ingresá tu nombre.</mat-error>
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label>Apellido</mat-label>
            <input matInput formControlName="apellido" autocomplete="family-name" />
          </mat-form-field>
        </div>

        <div class="cuenta-form__fila">
          <mat-form-field>
            <mat-label>Documento / CI</mat-label>
            <input matInput formControlName="documento" autocomplete="off" required />
            <mat-hint>Número de cédula de identidad</mat-hint>
            @if (formulario.controls.documento.touched && formulario.controls.documento.invalid) {
              <mat-error>El documento es obligatorio.</mat-error>
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label>RUC</mat-label>
            <input matInput formControlName="ruc" autocomplete="off" />
            <mat-hint>Si no tenés RUC, dejalo vacío</mat-hint>
          </mat-form-field>
        </div>

        <p class="cuenta-form__paso">2 · Contacto</p>
        <mat-form-field>
          <mat-label>Correo electrónico</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" required />
          <mat-hint>Lo usás para iniciar sesión</mat-hint>
          @if (formulario.controls.email.touched && formulario.controls.email.invalid) {
            <mat-error>Ingresá un correo válido.</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono" autocomplete="tel" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Dirección</mat-label>
          <input matInput formControlName="direccion" autocomplete="street-address" />
        </mat-form-field>

        <p class="cuenta-form__paso">3 · Seguridad</p>
        <mat-form-field>
          <mat-label>Contraseña</mat-label>
          <input
            matInput
            type="password"
            formControlName="password"
            autocomplete="new-password"
            required
          />
          <mat-hint>Mínimo 6 caracteres</mat-hint>
          @if (formulario.controls.password.touched && formulario.controls.password.invalid) {
            <mat-error>La contraseña debe tener al menos 6 caracteres.</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Confirmar contraseña</mat-label>
          <input
            matInput
            type="password"
            formControlName="passwordConfirmacion"
            autocomplete="new-password"
            required
          />
          @if (
            formulario.controls.passwordConfirmacion.touched &&
            (formulario.controls.passwordConfirmacion.invalid ||
              formulario.hasError('contraseñasDistintas'))
          ) {
            <mat-error>Las contraseñas deben coincidir.</mat-error>
          }
        </mat-form-field>

        @if (mensaje(); as texto) {
          <p class="cuenta-form__mensaje" role="alert">{{ texto }}</p>
        }

        <div class="cuenta-form__acciones">
          <button matButton="filled" type="submit" [disabled]="enviando() || formulario.invalid">
            Crear cuenta
          </button>
          <a matButton="outlined" routerLink="/cuenta/iniciar-sesion" [queryParams]="returnParams()">
            Ya tengo cuenta
          </a>
        </div>
      </form>

      <p class="cuenta-form__pie">
        Al registrarte vinculamos tu cuenta a un cliente en el sistema. Podés comprar como invitado
        sin crear cuenta.
      </p>
    </div>
  `,
  styleUrl: '../cuenta-form.scss',
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly formulario = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: [''],
      documento: ['', [Validators.required, Validators.minLength(3)]],
      ruc: [''],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      direccion: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirmacion: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: contraseñasIguales },
  );

  protected readonly enviando = signal(false);
  protected readonly mensaje = signal<string | null>(null);

  constructor() {
    if (this.auth.estaAutenticado()) {
      void this.router.navigateByUrl(this.returnUrl());
    }
  }

  protected returnParams(): Record<string, string> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl ? { returnUrl } : {};
  }

  protected enviar(): void {
    if (this.formulario.invalid || this.enviando()) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.mensaje.set(null);
    const valores = this.formulario.getRawValue();
    this.auth
      .registrar({
        nombre: valores.nombre,
        apellido: valores.apellido || null,
        documento: valores.documento,
        ruc: valores.ruc || null,
        email: valores.email,
        telefono: valores.telefono || null,
        direccion: valores.direccion || null,
        password: valores.password,
        passwordConfirmacion: valores.passwordConfirmacion,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          void this.router.navigateByUrl(this.returnUrl());
        },
        error: (err: unknown) => {
          this.enviando.set(false);
          this.mensaje.set(
            err instanceof GraphqlRequestError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'No se pudo crear la cuenta. Revisá los datos e intentá de nuevo.',
          );
        },
      });
  }

  private returnUrl(): string {
    const raw = this.route.snapshot.queryParamMap.get('returnUrl')?.trim();
    if (raw && raw.startsWith('/') && !raw.startsWith('//')) {
      return raw;
    }
    return '/';
  }
}
