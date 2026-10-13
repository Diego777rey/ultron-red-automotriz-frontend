import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MARCAS } from '../../../marcas/data/marcas.data';
import {
  CATEGORIAS_DIAGRAMA,
  CategoriaDiagrama,
  DiagramaArticulo,
} from '../../../marcas/models/diagrama.model';
import { CatalogoDiagramasService } from '../../../marcas/services/catalogo-diagramas.service';

@Component({
  selector: 'app-vendedor',
  imports: [
    RouterLink,
    DecimalPipe,
    FormField,
    MatCard,
    MatButton,
    MatAnchor,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './vendedor.html',
  styleUrl: './vendedor.scss',
})
export class VendedorComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogoService = inject(CatalogoDiagramasService);

  private readonly marcaInicial = this. resolverMarcaInicial();

  protected readonly marcas = MARCAS;
  protected readonly categorias = CATEGORIAS_DIAGRAMA;

  protected readonly datosFormulario = signal({
    marcaSlug: this.marcaInicial,
    modelo: '',
    anio: '2023',
    categoria: 'ECU' as CategoriaDiagrama,
    titulo: '',
    precio: '120000',
    descripcion: '',
  });
  protected readonly formularioProducto = form(this.datosFormulario);

  protected readonly errorFormulario = signal<string | null>(null);
  protected readonly ultimoPublicado = signal<DiagramaArticulo | null>(null);

  protected readonly marcaSeleccionada = computed(() =>
    MARCAS.find((item) => item.slug === this.datosFormulario().marcaSlug),
  );

  protected readonly productosDeMarca = computed(() =>
    this.catalogoService.obtenerPorMarca(this.datosFormulario().marcaSlug),
  );

  private resolverMarcaInicial(): string {
    const paramMarca = this.route.snapshot.queryParamMap.get('marca');
    if (paramMarca && MARCAS.some((item) => item.slug === paramMarca)) {
      return paramMarca;
    }
    return 'toyota';
  }

  guardarProducto(evento: Event): void {
    evento.preventDefault();
    const datos = this.datosFormulario();
    const modelo = datos.modelo.trim();
    const titulo = datos.titulo.trim();
    const descripcion = datos.descripcion.trim();
    const anio = Number(datos.anio);
    const precio = Number(datos.precio);

    if (!datos.marcaSlug || !modelo || !titulo) {
      this.errorFormulario.set('Completá la marca, el modelo y el título del artículo.');
      return;
    }

    if (!Number.isInteger(anio) || anio < 1980 || anio > 2030) {
      this.errorFormulario.set('Ingresá un año válido entre 1980 y 2030.');
      return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
      this.errorFormulario.set('Ingresá un valor mayor a 0.');
      return;
    }

    this.errorFormulario.set(null);

    const creado = this.catalogoService.agregarArticulo({
      marcaSlug: datos.marcaSlug,
      modelo,
      anio,
      categoria: datos.categoria,
      titulo,
      descripcion:
        descripcion ||
        `Diagrama eléctrico de ${datos.categoria} para ${modelo} (${anio}).`,
      precio,
    });

    this.ultimoPublicado.set(creado);
    this.datosFormulario.update((actual) => ({
      ...actual,
      modelo: '',
      titulo: '',
      descripcion: '',
    }));
  }

  eliminarProducto(id: string): void {
    this.catalogoService.eliminarArticulo(id);
    if (this.ultimoPublicado()?.id === id) {
      this.ultimoPublicado.set(null);
    }
  }
}
