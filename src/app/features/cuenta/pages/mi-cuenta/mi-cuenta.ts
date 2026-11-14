import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-mi-cuenta',
  imports: [RouterLink, MatButton],
  template: `
    <div class="mi-cuenta">
      <nav class="mi-cuenta__migas" aria-label="Migas de pan">
        <a routerLink="/">Inicio</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Mi cuenta</span>
      </nav>

      @if (auth.perfil(); as perfil) {
        <h1>Hola, {{ auth.nombreVisible() }}</h1>
        <p class="mi-cuenta__bajada">Estos son los datos de tu cuenta de cliente.</p>

        <dl class="mi-cuenta__datos">
          <div>
            <dt>Correo</dt>
            <dd>{{ perfil.email }}</dd>
          </div>
          <div>
            <dt>Nombre</dt>
            <dd>{{ perfil.nombre }} {{ perfil.apellido ?? '' }}</dd>
          </div>
          @if (perfil.documento) {
            <div>
              <dt>Documento / CI</dt>
              <dd>{{ perfil.documento }}</dd>
            </div>
          }
          @if (perfil.ruc) {
            <div>
              <dt>RUC</dt>
              <dd>{{ perfil.ruc }}</dd>
            </div>
          }
          @if (perfil.telefono) {
            <div>
              <dt>Teléfono</dt>
              <dd>{{ perfil.telefono }}</dd>
            </div>
          }
          @if (perfil.direccion) {
            <div>
              <dt>Dirección</dt>
              <dd>{{ perfil.direccion }}</dd>
            </div>
          }
        </dl>

        <div class="mi-cuenta__acciones">
          <a matButton="filled" routerLink="/productos">Seguir comprando</a>
          <button matButton="outlined" type="button" (click)="cerrarSesion()">
            Cerrar sesión
          </button>
        </div>
      } @else {
        <h1>Mi cuenta</h1>
        <p class="mi-cuenta__bajada">
          No hay una sesión activa. Podés iniciar sesión o crear una cuenta; el catálogo sigue
          disponible sin registrarte.
        </p>
        <div class="mi-cuenta__acciones">
          <a matButton="filled" routerLink="/cuenta/iniciar-sesion">Iniciar sesión</a>
          <a matButton="outlined" routerLink="/cuenta/registro">Crear cuenta</a>
        </div>
      }

      @if (mensaje(); as texto) {
        <p class="mi-cuenta__mensaje" role="status">{{ texto }}</p>
      }
    </div>
  `,
  styles: `
    .mi-cuenta {
      max-width: 560px;
      margin-inline: auto;
    }

    .mi-cuenta__migas {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
      color: var(--text-secondary);
      font-size: 0.9rem;

      a {
        color: var(--brand-color);
        text-decoration: none;

        &:hover,
        &:focus-visible {
          text-decoration: underline;
          outline: none;
        }
      }
    }

    h1 {
      margin: 0 0 8px;
      font-size: clamp(1.6rem, 3vw, 2rem);
    }

    .mi-cuenta__bajada {
      margin: 0 0 24px;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    .mi-cuenta__datos {
      display: grid;
      gap: 14px;
      margin: 0 0 28px;
      padding: 0;

      div {
        display: grid;
        gap: 2px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border-color);
      }

      dt {
        color: var(--text-secondary);
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      dd {
        margin: 0;
        font-size: 1.05rem;
      }
    }

    .mi-cuenta__acciones {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .mi-cuenta__mensaje {
      margin-top: 16px;
      padding: 12px 14px;
      border-radius: var(--radius-md);
      background: color-mix(in srgb, var(--brand-color) 10%, var(--bg-color));
    }
  `,
})
export class MiCuentaComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly mensaje = signal<string | null>(null);

  protected cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.mensaje.set('Cerraste sesión. Podés seguir comprando como invitado.');
    void this.router.navigate(['/cuenta/iniciar-sesion']);
  }
}
