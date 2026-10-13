import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormField, form } from '@angular/forms/signals';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DiagramaCardComponent } from '../../components/diagrama-card/diagrama-card';
import { MARCAS } from '../../data/marcas.data';
import { CATEGORIAS_DIAGRAMA, DiagramaArticulo } from '../../models/diagrama.model';
import { CatalogoDiagramasService } from '../../services/catalogo-diagramas.service';

@Component({
  selector: 'app-marca-detalle',
  imports: [
    RouterLink,
    NgOptimizedImage,
    FormField,
    MatButton,
    MatAnchor,
    MatIcon,
    DiagramaCardComponent,
  ],
  templateUrl: './marca-detalle.html',
  styleUrl: './marca-detalle.scss',
})
export class MarcaDetalleComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogoService = inject(CatalogoDiagramasService);

  private readonly slugParam = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' },
  );

  protected readonly marca = computed(() =>
    MARCAS.find((item) => item.slug === this.slugParam()),
  );

  protected readonly logoDisponible = linkedSignal(() => Boolean(this.marca()?.logo));
  protected readonly logo = computed(() =>
    this.logoDisponible() ? this.marca()?.logo : undefined,
  );
  protected readonly iniciales = computed(() => {
    const nombre = this.marca()?.nombre ?? '';
    return nombre
      .split(/[\s-]+/)
      .map((palabra) => palabra.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  });

  protected readonly categorias = CATEGORIAS_DIAGRAMA;
  protected readonly filtros = signal({
    modelo: '',
    anio: '',
    categoria: '',
    busqueda: '',
  });
  protected readonly formularioFiltros = form(this.filtros);
  protected readonly ultimoAgregado = signal<string | null>(null);

  protected readonly articulosDeMarca = computed(() => {
    const slug = this.marca()?.slug;
    if (!slug) {
      return [];
    }
    return this.catalogoService.obtenerPorMarca(slug);
  });

  protected readonly modelosDisponibles = computed(() => {
    const modelos = new Set(this.articulosDeMarca().map((item) => item.modelo));
    return Array.from(modelos).sort((a, b) => a.localeCompare(b));
  });

  protected readonly aniosDisponibles = computed(() => {
    const modeloSeleccionado = this.filtros().modelo;
    const base = modeloSeleccionado
      ? this.articulosDeMarca().filter((item) => item.modelo === modeloSeleccionado)
      : this.articulosDeMarca();
    const anios = new Set(base.map((item) => item.anio));
    return Array.from(anios).sort((a, b) => b - a);
  });

  protected readonly articulosFiltrados = computed(() => {
    const { modelo, anio, categoria, busqueda } = this.filtros();
    const termino = busqueda.trim().toLowerCase();

    return this.articulosDeMarca().filter((item) => {
      if (modelo && item.modelo !== modelo) {
        return false;
      }
      if (anio && String(item.anio) !== String(anio)) {
        return false;
      }
      if (categoria && item.categoria !== categoria) {
        return false;
      }
      if (
        termino &&
        !item.titulo.toLowerCase().includes(termino) &&
        !item.modelo.toLowerCase().includes(termino) &&
        !item.descripcion.toLowerCase().includes(termino)
      ) {
        return false;
      }
      return true;
    });
  });

  protected readonly tieneFiltrosActivos = computed(() => {
    const { modelo, anio, categoria, busqueda } = this.filtros();
    return Boolean(modelo || anio || categoria || busqueda.trim());
  });

  limpiarFiltros(): void {
    this.filtros.set({
      modelo: '',
      anio: '',
      categoria: '',
      busqueda: '',
    });
  }

  comprarArticulo(articulo: DiagramaArticulo): void {
    this.catalogoService.agregarAlCarrito(articulo.id);
    this.ultimoAgregado.set(articulo.titulo);
  }
}
