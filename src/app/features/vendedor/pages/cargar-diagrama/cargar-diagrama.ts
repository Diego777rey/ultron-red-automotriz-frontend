import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FieldTree, FormField, form, max, min, required, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { buscarMarca, MARCAS } from '../../../marcas/data/marcas.data';
import { DiagramaCardComponent } from '../../../diagramas/components/diagrama-card/diagrama-card';
import {
  NuevoDiagrama,
  TIPOS_DIAGRAMA,
  TipoDiagrama,
  esTipoDiagrama,
} from '../../../diagramas/models/diagrama.model';
import { CatalogoDiagramasService } from '../../../diagramas/services/catalogo-diagramas.service';

const ANIO_MIN = 1980;
const ANIO_MAX = 2027;

interface CargaDiagrama {
  marcaSlug: string;
  titulo: string;
  modelo: string;
  anio: number | null;
  tipo: TipoDiagrama | '';
  precio: number | null;
  descripcion: string;
}

function cargaInicial(marcaSlug: string | null = null): CargaDiagrama {
  return {
    marcaSlug: marcaSlug && buscarMarca(marcaSlug) ? marcaSlug : '',
    titulo: '',
    modelo: '',
    anio: null,
    tipo: '',
    precio: null,
    descripcion: '',
  };
}

@Component({
  selector: 'app-cargar-diagrama',
  imports: [
    FormField,
    RouterLink,
    MatButton,
    MatFormField,
    MatLabel,
    MatError,
    MatHint,
    MatInput,
    DiagramaCardComponent,
  ],
  template: `
    <article class="cargar">
      <a class="cargar__volver" routerLink="/">Volver a las marcas</a>
      <h1 tabindex="-1">Cargar diagramas</h1>
      <p class="cargar__bajada">
        Los diagramas que cargues se muestran en la marca elegida. Por ahora quedan guardados en
        este navegador.
      </p>

      <form class="cargar__formulario" novalidate (submit)="enviar($event)">
        <div class="cargar__campos">
          <mat-form-field>
            <mat-label>Marca</mat-label>
            <select id="carga-marca" matNativeControl [formField]="formulario.marcaSlug">
              <option value="">Elegí una marca</option>
              @for (marca of marcas; track marca.slug) {
                <option [value]="marca.slug">{{ marca.nombre }}</option>
              }
            </select>
            <mat-error>{{ mensaje(formulario.marcaSlug) }}</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Tipo de diagrama</mat-label>
            <select id="carga-tipo" matNativeControl [formField]="formulario.tipo">
              <option value="">Elegí un tipo</option>
              @for (tipo of tipos; track tipo.id) {
                <option [value]="tipo.id">{{ tipo.etiqueta }}</option>
              }
            </select>
            <mat-error>{{ mensaje(formulario.tipo) }}</mat-error>
          </mat-form-field>

          <mat-form-field class="cargar__ancho">
            <mat-label>Título</mat-label>
            <input id="carga-titulo" matInput type="text" [formField]="formulario.titulo" />
            <mat-error>{{ mensaje(formulario.titulo) }}</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Modelo</mat-label>
            <input id="carga-modelo" matInput type="text" [formField]="formulario.modelo" />
            <mat-error>{{ mensaje(formulario.modelo) }}</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Año</mat-label>
            <input
              id="carga-anio"
              matInput
              type="number"
              inputmode="numeric"
              [formField]="formulario.anio"
            />
            <mat-hint>Entre {{ anioMin }} y {{ anioMax }}</mat-hint>
            <mat-error>{{ mensaje(formulario.anio) }}</mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Precio en guaraníes</mat-label>
            <input
              id="carga-precio"
              matInput
              type="number"
              inputmode="numeric"
              [formField]="formulario.precio"
            />
            <mat-error>{{ mensaje(formulario.precio) }}</mat-error>
          </mat-form-field>
        </div>

        <mat-form-field class="cargar__ancho">
          <mat-label>Descripción</mat-label>
          <textarea
            id="carga-descripcion"
            matInput
            rows="4"
            [formField]="formulario.descripcion"
          ></textarea>
          <mat-error>{{ mensaje(formulario.descripcion) }}</mat-error>
        </mat-form-field>

        <button matButton="filled" type="submit">Cargar diagrama</button>
      </form>

      <p class="cargar__aviso" aria-live="polite">
        @if (marcaCargada(); as slug) {
          Diagrama cargado.
          <a [routerLink]="['/marcas', slug]">Ver los diagramas</a>.
        }
      </p>

      <section class="cargar__lista" aria-labelledby="diagramas-cargados">
        <h2 id="diagramas-cargados">Diagramas que cargaste</h2>
        @if (cargados().length === 0) {
          <p class="cargar__bajada">Todavía no cargaste diagramas.</p>
        } @else {
          <ul>
            @for (diagrama of cargados(); track diagrama.id) {
              <li>
                <app-diagrama-card [diagrama]="diagrama" nivel="h3" />
                <div class="cargar__acciones">
                  <a [routerLink]="['/marcas', diagrama.marcaSlug]">Ver en la tienda</a>
                  <button
                    matButton
                    type="button"
                    [attr.aria-label]="'Quitar ' + diagrama.titulo"
                    (click)="quitar(diagrama.id)"
                  >
                    Quitar
                  </button>
                </div>
              </li>
            }
          </ul>
        }
      </section>
    </article>
  `,
  styleUrl: './cargar-diagrama.scss',
})
export class CargarDiagramaComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogo = inject(CatalogoDiagramasService);

  protected readonly marcas = MARCAS;
  protected readonly tipos = TIPOS_DIAGRAMA;
  protected readonly anioMin = ANIO_MIN;
  protected readonly anioMax = ANIO_MAX;
  protected readonly marcaCargada = signal<string | null>(null);
  protected readonly cargados = computed(() =>
    this.catalogo.todos().filter((diagrama) => diagrama.origen === 'vendedor'),
  );

  private readonly marcaConsulta = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('marca') ?? '')),
    { initialValue: this.route.snapshot.queryParamMap.get('marca') ?? '' },
  );
  private readonly datos = signal(cargaInicial(this.route.snapshot.queryParamMap.get('marca')));
  protected readonly formulario = form(this.datos, (campo) => {
    required(campo.marcaSlug, { message: 'Elegí una marca.' });
    required(campo.tipo, { message: 'Elegí el tipo de diagrama.' });
    required(campo.titulo, { message: 'Ingresá el título.' });
    validate(campo.titulo, ({ value }) =>
      value().trim().length >= 3
        ? undefined
        : { kind: 'titulo', message: 'El título necesita al menos 3 caracteres.' },
    );
    required(campo.modelo, { message: 'Ingresá el modelo.' });
    validate(campo.modelo, ({ value }) =>
      value().trim().length > 0 ? undefined : { kind: 'modelo', message: 'Ingresá el modelo.' },
    );
    required(campo.anio, { message: 'Ingresá el año.' });
    min(campo.anio, ANIO_MIN, {
      message: `El año tiene que ser ${ANIO_MIN} o posterior.`,
      when: ({ value }) => value() !== null,
    });
    max(campo.anio, ANIO_MAX, {
      message: `El año tiene que ser ${ANIO_MAX} o anterior.`,
      when: ({ value }) => value() !== null,
    });
    validate(campo.anio, ({ value }) => {
      const anio = value();
      return anio === null || Number.isInteger(anio)
        ? undefined
        : { kind: 'entero', message: 'Ingresá el año sin decimales.' };
    });
    required(campo.precio, { message: 'Ingresá el precio.' });
    min(campo.precio, 1, {
      message: 'El precio tiene que ser mayor a 0.',
      when: ({ value }) => value() !== null,
    });
    validate(campo.precio, ({ value }) => {
      const precio = value();
      return precio === null || Number.isInteger(precio)
        ? undefined
        : { kind: 'entero', message: 'Ingresá el precio sin decimales.' };
    });
    required(campo.descripcion, { message: 'Ingresá la descripción.' });
    validate(campo.descripcion, ({ value }) =>
      value().trim().length >= 10
        ? undefined
        : { kind: 'descripcion', message: 'La descripción necesita al menos 10 caracteres.' },
    );
  });

  constructor() {
    effect(() => {
      const marca = this.marcaConsulta();
      if (!buscarMarca(marca)) {
        return;
      }
      this.datos.update((actual) =>
        actual.marcaSlug === marca ? actual : { ...actual, marcaSlug: marca },
      );
    });
  }

  protected mensaje(campo: FieldTree<unknown>): string {
    const estado = campo();
    if (!estado.touched() || !estado.invalid()) {
      return '';
    }
    return estado.errors()[0]?.message ?? '';
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    this.marcaCargada.set(null);
    if (this.formulario().invalid()) {
      this.formulario().markAsTouched();
      return;
    }
    const diagrama = aNuevoDiagrama(this.datos());
    if (!diagrama) {
      this.formulario().markAsTouched();
      return;
    }
    this.catalogo.cargar(diagrama);
    this.marcaCargada.set(diagrama.marcaSlug);
    this.formulario().reset(cargaInicial(diagrama.marcaSlug));
  }

  protected quitar(id: string): void {
    this.catalogo.quitar(id);
  }
}

function aNuevoDiagrama(valor: CargaDiagrama): NuevoDiagrama | null {
  if (
    valor.anio === null ||
    valor.precio === null ||
    !esTipoDiagrama(valor.tipo) ||
    !buscarMarca(valor.marcaSlug)
  ) {
    return null;
  }
  return {
    marcaSlug: valor.marcaSlug,
    titulo: valor.titulo.trim(),
    modelo: valor.modelo.trim(),
    anio: valor.anio,
    tipo: valor.tipo,
    precio: valor.precio,
    descripcion: valor.descripcion.trim(),
  };
}
