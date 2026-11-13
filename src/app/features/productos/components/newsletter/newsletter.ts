import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { GraphqlRequestError } from '../../../../core/graphql/graphql.service';
import { ProductosService } from '../../services/productos.service';

/** Bloque de suscripción al newsletter (mutation `suscribirNewsletter`). */
@Component({
  selector: 'app-newsletter',
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  template: `
    <section class="newsletter" aria-labelledby="newsletter-titulo">
      <div class="newsletter__texto">
        <h2 id="newsletter-titulo">Recibí novedades y ofertas</h2>
        <p>Dejanos tu correo y te contamos cuando haya productos nuevos en la tienda.</p>
      </div>
      <form class="newsletter__formulario" [formGroup]="formulario" (ngSubmit)="enviar()">
        <mat-form-field subscriptSizing="dynamic">
          <mat-label>Nombre (opcional)</mat-label>
          <input matInput formControlName="nombre" autocomplete="name" />
        </mat-form-field>
        <mat-form-field subscriptSizing="dynamic">
          <mat-label>Correo electrónico</mat-label>
          <input
            matInput
            type="email"
            formControlName="email"
            autocomplete="email"
            required
          />
        </mat-form-field>
        <button matButton="filled" type="submit" [disabled]="enviando() || formulario.invalid">
          Suscribirme
        </button>
        @if (mensaje(); as mensaje) {
          <p class="newsletter__mensaje" [class.newsletter__mensaje--error]="esError()" role="status">
            {{ mensaje }}
          </p>
        }
      </form>
    </section>
  `,
  styleUrl: './newsletter.scss',
})
export class NewsletterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productos = inject(ProductosService);

  protected readonly formulario = this.fb.nonNullable.group({
    nombre: [''],
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly enviando = signal(false);
  protected readonly mensaje = signal<string | null>(null);
  protected readonly esError = signal(false);

  protected enviar(): void {
    if (this.formulario.invalid || this.enviando()) {
      return;
    }
    this.enviando.set(true);
    this.mensaje.set(null);
    const { email, nombre } = this.formulario.getRawValue();
    this.productos.suscribirNewsletter(email, nombre || undefined).subscribe({
      next: (resultado) => {
        this.enviando.set(false);
        this.esError.set(false);
        this.mensaje.set(resultado.mensaje || `¡Listo! Suscribimos ${resultado.email}.`);
        this.formulario.reset({ nombre: '', email: '' });
      },
      error: (err: unknown) => {
        this.enviando.set(false);
        this.esError.set(true);
        this.mensaje.set(
          err instanceof GraphqlRequestError
            ? err.message
            : 'No pudimos suscribirte. Probá de nuevo en un momento.',
        );
      },
    });
  }
}
