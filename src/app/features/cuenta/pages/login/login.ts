import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { GraphqlRequestError } from '../../../../core/graphql/graphql.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, MatFormField, MatLabel, MatError, MatInput, MatButton],
  template: `
    <div class="cuenta-form">
      <nav class="cuenta-form__migas" aria-label="Migas de pan">
        <a routerLink="/">Inicio</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Iniciar sesión</span>
      </nav>

      <h1>Iniciá sesión</h1>
      <p class="cuenta-form__bajada">
        Accedé a tu cuenta para comprar más rápido. El catálogo se puede ver sin registrarse.
      </p>

      <form class="cuenta-form__campos" [formGroup]="formulario" (ngSubmit)="enviar()">
        <mat-form-field>
          <mat-label>Correo electrónico</mat-label>
          <input matInput type="email" formControlName="email" autocomplete="email" required />
          @if (formulario.controls.email.touched && formulario.controls.email.invalid) {
            <mat-error>Ingresá un correo válido.</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Contraseña</mat-label>
          <input
            matInput
            type="password"
            formControlName="password"
            autocomplete="current-password"
            required
          />
          @if (formulario.controls.password.touched && formulario.controls.password.invalid) {
            <mat-error>La contraseña es obligatoria.</mat-error>
          }
        </mat-form-field>

        @if (mensaje(); as texto) {
          <p class="cuenta-form__mensaje" role="alert">{{ texto }}</p>
        }

        <button matButton="filled" type="submit" [disabled]="enviando() || formulario.invalid">
          Entrar
        </button>
      </form>

      <p class="cuenta-form__pie">
        ¿No tenés cuenta?
        <a routerLink="/cuenta/registro" [queryParams]="returnParams()">Creá tu cuenta</a>
      </p>
    </div>
  `,
  styleUrl: '../cuenta-form.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly formulario = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

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
    const { email, password } = this.formulario.getRawValue();
    this.auth.login({ email, password }).subscribe({
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
              : 'No se pudo iniciar sesión. Revisá tus datos.',
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
