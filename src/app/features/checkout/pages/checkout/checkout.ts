import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { PagosService } from '../../services/pagos.service';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  template: `
    <div class="checkout">
      <h1>Pago con tarjeta</h1>
      <p>
        Total a pagar:
        <strong>Gs. {{ carrito.subtotal().toLocaleString('es-PY') }}</strong>
      </p>
      @if (carrito.vacio()) {
        <p>No hay productos en el carrito.</p>
        <a matButton="filled" routerLink="/">Volver al inicio</a>
      } @else {
        <form class="checkout__formulario" [formGroup]="formulario" (ngSubmit)="pagar()">
          <mat-form-field>
            <mat-label>Titular de la tarjeta</mat-label>
            <input matInput formControlName="titular" autocomplete="cc-name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Número de tarjeta</mat-label>
            <input
              matInput
              formControlName="numero"
              inputmode="numeric"
              autocomplete="cc-number"
              placeholder="4242 4242 4242 4242"
            />
          </mat-form-field>
          <div class="checkout__fila">
            <mat-form-field>
              <mat-label>Vencimiento (MM/AA)</mat-label>
              <input matInput formControlName="vencimiento" autocomplete="cc-exp" placeholder="12/28" />
            </mat-form-field>
            <mat-form-field>
              <mat-label>CVC</mat-label>
              <input matInput formControlName="cvc" inputmode="numeric" autocomplete="cc-csc" />
            </mat-form-field>
          </div>
          <p class="checkout__aviso">
            Los datos se validan en el navegador. En producción se tokenizan con la pasarela de pago; no
            se almacena el número completo.
          </p>
          @if (mensaje(); as mensaje) {
            <p class="checkout__mensaje" [class.checkout__mensaje--error]="!exito()" role="status">
              {{ mensaje }}
            </p>
          }
          <button matButton="filled" type="submit" [disabled]="procesando() || formulario.invalid">
            Pagar ahora
          </button>
        </form>
      }
    </div>
  `,
  styleUrl: './checkout.scss',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pagos = inject(PagosService);
  private readonly pedidos = inject(PedidosService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly carrito = inject(CarritoService);

  protected readonly formulario = this.fb.nonNullable.group({
    titular: ['', [Validators.required, Validators.minLength(3)]],
    numero: ['', [Validators.required, Validators.minLength(13)]],
    vencimiento: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  protected readonly procesando = signal(false);
  protected readonly mensaje = signal<string | null>(null);
  protected readonly exito = signal(false);

  protected async pagar(): Promise<void> {
    if (this.formulario.invalid || this.carrito.vacio()) {
      return;
    }
    const usuario = this.auth.usuario();
    if (!usuario) {
      return;
    }
    this.procesando.set(true);
    this.mensaje.set(null);
    const tarjeta = this.formulario.getRawValue();
    const total = this.carrito.subtotal();
    const resultado = await this.pagos.cobrarConTarjeta(total, tarjeta);
    this.procesando.set(false);
    if (!resultado.aprobado) {
      this.exito.set(false);
      this.mensaje.set(resultado.mensaje);
      return;
    }
    this.pedidos.registrar({
      usuarioId: usuario.id,
      lineas: this.carrito.items(),
      total,
      transaccionId: resultado.transaccionId,
      ultimosCuatroTarjeta: resultado.ultimosCuatro,
    });
    this.carrito.vaciar();
    this.exito.set(true);
    this.mensaje.set(`${resultado.mensaje} Nº ${resultado.transaccionId}`);
    await this.router.navigate(['/cuenta']);
  }
}
