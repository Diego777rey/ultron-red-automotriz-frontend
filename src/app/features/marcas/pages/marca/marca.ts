import { Component, computed, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormField, form } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProductoCardComponent } from '../../../productos/components/producto-card/producto-card';
import { ProductosService } from '../../../productos/services/productos.service';
import { buscarMarca } from '../../data/marcas.data';

@Component({
  selector: 'app-marca',
  imports: [RouterLink, FormField, MatButton, ProductoCardComponent],
  templateUrl: './marca.html',
  styleUrl: './marca.scss',
})
export class MarcaComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly productos = inject(ProductosService);

  protected readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('slug') ?? '' },
  );

  protected readonly marca = computed(() => buscarMarca(this.slug()));

  protected readonly filtros = linkedSignal({
    source: this.slug,
    computation: () => ({ modelo: '', anio: '' }),
  });
  protected readonly formularioFiltros = form(this.filtros);

  protected readonly productosDeMarca = computed(() =>
    this.productos.catalogo().filter((producto) => producto.marcaSlug === this.slug()),
  );

  protected readonly modelos = computed(() =>
    [...new Set(this.productosDeMarca().map((producto) => producto.modelo))].sort((a, b) =>
      a.localeCompare(b, 'es'),
    ),
  );

  protected readonly anios = computed(() => {
    const productos = this.productosDeMarca();
    if (productos.length === 0) {
      return [];
    }
    const minimo = Math.min(...productos.map((producto) => producto.anioDesde));
    const maximo = Math.max(...productos.map((producto) => producto.anioHasta));
    return Array.from({ length: maximo - minimo + 1 }, (_, indice) => maximo - indice);
  });

  protected readonly filtrados = computed(() => {
    const { modelo, anio } = this.filtros();
    const anioNumero = anio ? Number(anio) : null;
    return this.productosDeMarca().filter((producto) => {
      if (modelo && producto.modelo !== modelo) {
        return false;
      }
      const fueraDeRango =
        anioNumero !== null && (anioNumero < producto.anioDesde || anioNumero > producto.anioHasta);
      if (fueraDeRango) {
        return false;
      }
      return true;
    });
  });

  protected readonly hayFiltros = computed(() => {
    const { modelo, anio } = this.filtros();
    return Boolean(modelo || anio);
  });

  protected readonly resumen = computed(() => {
    const cantidad = this.filtrados().length;
    if (cantidad === 1) {
      return '1 diagrama';
    }
    return `${cantidad} diagramas`;
  });

  limpiarFiltros(): void {
    this.filtros.set({ modelo: '', anio: '' });
  }
}
