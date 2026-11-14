import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { GraphqlRequestError } from '../../../../core/graphql/graphql.service';
import { CarritoService } from '../../../carrito/services/carrito.service';
import { formatearGs } from '../../../productos/services/productos.mapper';
import { PedidosWebService } from '../../services/pedidos-web.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton],
  template: `
    <div class="checkout">
      <h1>Checkout</h1>
      <p>
        Total a pagar:
        <strong>{{ formatear(carrito.subtotal()) }}</strong>
      </p>

      @if (!auth.estaAutenticado()) {
        <aside class="checkout__cta-cuenta" aria-label="Cuenta opcional">
          <p>
            ¿Ya tenés cuenta?
            <a routerLink="/cuenta/iniciar-sesion" [queryParams]="{ returnUrl: '/checkout' }"
              >Iniciá sesión</a
            >
            ·
            <a routerLink="/cuenta/registro" [queryParams]="{ returnUrl: '/checkout' }"
              >Creá tu cuenta para comprar más rápido</a
            >
          </p>
          <p class="checkout__cta-nota">También podés completar el pedido como invitado.</p>
        </aside>
      } @else {
        <p class="checkout__sesion">
          Comprando como <strong>{{ auth.nombreVisible() }}</strong>.
          <a routerLink="/cuenta">Ver mi cuenta</a>
        </p>
      }

      @if (carrito.vacio()) {
        <p>No hay productos en el carrito.</p>
        <a matButton="filled" routerLink="/productos">Ver productos</a>
      } @else {
        <form class="checkout__formulario" [formGroup]="formulario" (ngSubmit)="pagar()">
          <h2>Datos del cliente</h2>
          <mat-form-field>
            <mat-label>Nombre completo</mat-label>
            <input matInput formControlName="clienteNombre" autocomplete="name" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Correo electrónico</mat-label>
            <input matInput type="email" formControlName="clienteEmail" autocomplete="email" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Teléfono</mat-label>
            <input matInput formControlName="clienteTelefono" autocomplete="tel" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Documento</mat-label>
            <input matInput formControlName="clienteDocumento" autocomplete="off" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Dirección de envío</mat-label>
            <input matInput formControlName="direccionEnvio" autocomplete="street-address" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Ciudad</mat-label>
            <input matInput formControlName="ciudad" autocomplete="address-level2" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Notas</mat-label>
            <textarea matInput formControlName="notas" rows="3"></textarea>
          </mat-form-field>

          <h2>Pago con tarjeta</h2>
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
              <input
                matInput
                formControlName="vencimiento"
                autocomplete="cc-exp"
                placeholder="12/28"
              />
            </mat-form-field>
            <mat-form-field>
              <mat-label>CVC</mat-label>
              <input matInput formControlName="cvc" inputmode="numeric" autocomplete="cc-csc" />
            </mat-form-field>
          </div>

          <p class="checkout__aviso">
            El pago se procesa en el servidor de la tienda. En producción los datos de tarjeta se
            tokenizan con la pasarela; no registres el número completo en logs ni capturas.
          </p>

          @if (mensaje(); as texto) {
            <p
              class="checkout__mensaje"
              [class.checkout__mensaje--error]="!exito()"
              role="status"
            >
              {{ texto }}
            </p>
          }

          <button matButton="filled" type="submit" [disabled]="procesando() || formulario.invalid">
            Confirmar pedido
          </button>
        </form>
      }
    </div>
  `,
  styleUrl: './checkout.scss',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly pedidos = inject(PedidosWebService);
  private readonly router = inject(Router);
  protected readonly carrito = inject(CarritoService);
  protected readonly auth = inject(AuthService);

  protected readonly formulario = this.fb.nonNullable.group({
    clienteNombre: ['', [Validators.required, Validators.minLength(3)]],
    clienteEmail: ['', [Validators.required, Validators.email]],
    clienteTelefono: [''],
    clienteDocumento: [''],
    direccionEnvio: [''],
    ciudad: [''],
    notas: [''],
    titular: ['', [Validators.required, Validators.minLength(3)]],
    numero: ['', [Validators.required, Validators.minLength(13)]],
    vencimiento: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  protected readonly procesando = signal(false);
  protected readonly mensaje = signal<string | null>(null);
  protected readonly exito = signal(false);

  constructor() {
    this.prellenarDesdeCuenta();
  }

  protected formatear(monto: number): string {
    return formatearGs(monto);
  }

  protected pagar(): void {
    if (this.formulario.invalid || this.carrito.vacio() || this.procesando()) {
      return;
    }
    this.procesando.set(true);
    this.mensaje.set(null);

    const valores = this.formulario.getRawValue();
    const numeroLimpio = valores.numero.replace(/\D/g, '');

    this.pedidos
      .registrar({
        clienteNombre: valores.clienteNombre.trim(),
        clienteEmail: valores.clienteEmail.trim(),
        clienteTelefono: valores.clienteTelefono.trim() || null,
        clienteDocumento: valores.clienteDocumento.trim() || null,
        direccionEnvio: valores.direccionEnvio.trim() || null,
        ciudad: valores.ciudad.trim() || null,
        notas: valores.notas.trim() || null,
        formaPago: 'TARJETA',
        pagoTarjeta: {
          titular: valores.titular.trim(),
          numero: numeroLimpio,
          vencimiento: valores.vencimiento.trim(),
          cvc: valores.cvc.trim(),
        },
        detalles: this.carrito.items().map((linea) => ({
          idProducto: linea.productoId,
          idPresentacionProducto: linea.presentacionId ?? null,
          cantidad: linea.cantidad,
        })),
      })
      .subscribe({
        next: (pedido) => {
          this.procesando.set(false);
          this.exito.set(true);
          this.carrito.vaciar();
          // No loguear PAN ni CVC.
          void this.router.navigate(['/pedido', pedido.codigo]);
        },
        error: (err: unknown) => {
          this.procesando.set(false);
          this.exito.set(false);
          this.mensaje.set(
            err instanceof GraphqlRequestError
              ? err.message
              : err instanceof Error
                ? err.message
                : 'No se pudo registrar el pedido. Revisá los datos e intentá de nuevo.',
          );
        },
      });
  }

  private prellenarDesdeCuenta(): void {
    const perfil = this.auth.perfil();
    if (!perfil) {
      return;
    }
    const nombreCompleto = [perfil.nombre, perfil.apellido].filter(Boolean).join(' ').trim();
    this.formulario.patchValue({
      clienteNombre: nombreCompleto || this.formulario.controls.clienteNombre.value,
      clienteEmail: perfil.email || this.formulario.controls.clienteEmail.value,
      clienteTelefono: perfil.telefono ?? '',
      clienteDocumento: perfil.documento ?? '',
      direccionEnvio: perfil.direccion ?? '',
      titular: nombreCompleto || this.formulario.controls.titular.value,
    });
  }
}
