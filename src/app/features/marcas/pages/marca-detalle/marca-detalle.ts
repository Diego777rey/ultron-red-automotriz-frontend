import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  linkedSignal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DiagramaCardComponent } from '../../../diagramas/components/diagrama-card/diagrama-card';
import { CatalogoDiagramasService } from '../../../diagramas/services/catalogo-diagramas.service';
import {
  aniosDisponibles,
  filtrarDiagramas,
  modelosDisponibles,
} from '../../../diagramas/utils/filtrar-diagramas';
import { buscarMarca } from '../../data/marcas.data';

@Component({
  selector: 'app-marca-detalle',
  imports: [RouterLink, DiagramaCardComponent],
  template: `
    @if (marca(); as marca) {
      <article class="marca-detalle">
        <a class="marca-detalle__volver" routerLink="/">Volver a las marcas</a>
        <h1 #tituloPagina tabindex="-1">Diagramas {{ marca.nombre }}</h1>
        <p class="marca-detalle__bajada">
          Precios de muestra. Filtrá por modelo y año para encontrar el diagrama.
        </p>

        <form class="marca-detalle__filtros" role="search" aria-label="Filtrar diagramas">
          <div class="marca-detalle__campo">
            <label for="filtro-modelo">Modelo</label>
            <select id="filtro-modelo" [value]="filtros().modelo" (change)="alElegirModelo($event)">
              <option value="">Todos los modelos</option>
              @for (modelo of modelos(); track modelo) {
                <option [value]="modelo">{{ modelo }}</option>
              }
            </select>
          </div>

          <div class="marca-detalle__campo">
            <label for="filtro-anio">Año</label>
            <select id="filtro-anio" [value]="filtros().anio" (change)="alElegirAnio($event)">
              <option value="">Todos los años</option>
              @for (anio of anios(); track anio) {
                <option [value]="'' + anio">{{ anio }}</option>
              }
            </select>
          </div>
        </form>

        <div aria-live="polite">
          <p class="marca-detalle__resumen">{{ resumen() }}</p>
          @if (resultado().length === 0) {
            <p class="marca-detalle__vacio">
              No hay diagramas con ese modelo y año.
              <a [routerLink]="['/vendedor']" [queryParams]="{ marca: marca.slug }"
                >Cargar un diagrama de {{ marca.nombre }}</a
              >.
            </p>
          }
        </div>

        @if (resultado().length > 0) {
          <ul class="marca-detalle__lista">
            @for (diagrama of resultado(); track diagrama.id) {
              <li>
                <app-diagrama-card [diagrama]="diagrama" />
              </li>
            }
          </ul>
        }

        <p class="marca-detalle__vendedor">
          <a [routerLink]="['/vendedor']" [queryParams]="{ marca: marca.slug }"
            >Cargar un diagrama de {{ marca.nombre }}</a
          >
        </p>
      </article>
    } @else {
      <article class="marca-detalle">
        <h1 #tituloPagina tabindex="-1">Marca no encontrada</h1>
        <p class="marca-detalle__bajada">No encontramos esa marca en el catálogo.</p>
        <a class="marca-detalle__volver" routerLink="/">Volver a las marcas</a>
      </article>
    }
  `,
  styleUrl: './marca-detalle.scss',
})
export class MarcaDetalleComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly injector = inject(Injector);
  private readonly catalogo = inject(CatalogoDiagramasService);
  private readonly tituloPagina = viewChild<ElementRef<HTMLHeadingElement>>('tituloPagina');

  protected readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' },
  );
  protected readonly marca = computed(() => buscarMarca(this.slug()));
  protected readonly filtros = linkedSignal({
    source: () => this.slug(),
    computation: () => ({ modelo: '', anio: '' }),
  });

  private readonly diagramasMarca = computed(() =>
    this.catalogo.todos().filter((diagrama) => diagrama.marcaSlug === this.slug()),
  );

  protected readonly modelos = computed(() => modelosDisponibles(this.diagramasMarca(), null));
  protected readonly anios = computed(() =>
    aniosDisponibles(this.diagramasMarca(), this.filtros().modelo),
  );
  protected readonly resultado = computed(() =>
    filtrarDiagramas(this.diagramasMarca(), {
      modelo: this.filtros().modelo,
      anio: this.anioSeleccionado(),
    }),
  );
  protected readonly resumen = computed(() => {
    const cantidad = this.resultado().length;
    const base = cantidad === 1 ? '1 diagrama' : `${cantidad} diagramas`;
    const detalle = [
      this.filtros().modelo ? `modelo ${this.filtros().modelo}` : '',
      this.filtros().anio ? `año ${this.filtros().anio}` : '',
    ].filter(Boolean);
    return detalle.length === 0 ? base : `${base} para ${detalle.join(', ')}`;
  });

  constructor() {
    effect(() => {
      this.slug();
      afterNextRender(() => this.tituloPagina()?.nativeElement.focus({ preventScroll: true }), {
        injector: this.injector,
      });
    });
  }

  protected alElegirModelo(evento: Event): void {
    const modelo = (evento.target as HTMLSelectElement).value;
    this.filtros.update((filtro) => {
      const anioSigue = aniosDisponibles(this.diagramasMarca(), modelo).some(
        (anio) => String(anio) === filtro.anio,
      );
      return { modelo, anio: filtro.anio !== '' && anioSigue ? filtro.anio : '' };
    });
  }

  protected alElegirAnio(evento: Event): void {
    const anio = (evento.target as HTMLSelectElement).value;
    this.filtros.update((filtro) => ({ ...filtro, anio }));
  }

  private anioSeleccionado(): number | null {
    const anio = this.filtros().anio;
    return anio === '' ? null : Number(anio);
  }
}
