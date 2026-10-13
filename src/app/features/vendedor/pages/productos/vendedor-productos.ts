import { Component, computed, inject, signal } from '@angular/core';
import { FormField, form, max, min, required, submit, validate } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MARCAS, buscarMarca } from '../../../marcas/data/marcas.data';
import { TIPOS_DIAGRAMA, tipoDiagrama } from '../../../productos/data/tipos-diagrama.data';
import { AltaProducto, Producto, TipoDiagrama } from '../../../productos/models/producto.model';
import { ProductosService } from '../../../productos/services/productos.service';
import { formatearAnios, formatearPrecio } from '../../../productos/utils/precio';

const ANIO_MINIMO = 1990;
const ANIO_MAXIMO = new Date().getFullYear() + 1;

interface AltaDiagrama {
  marcaSlug: string;
  modelo: string;
  anioDesde: number | null;
  anioHasta: number | null;
  tipo: TipoDiagrama | '';
  titulo: string;
  precio: number | null;
  descripcion: string;
}

function altaVacia(): AltaDiagrama {
  return {
    marcaSlug: '',
    modelo: '',
    anioDesde: null,
    anioHasta: null,
    tipo: '',
    titulo: '',
    precio: null,
    descripcion: '',
  };
}

@Component({
  selector: 'app-vendedor-productos',
  imports: [RouterLink, FormField, MatButton],
  templateUrl: './vendedor-productos.html',
  styleUrl: './vendedor-productos.scss',
})
export class VendedorProductosComponent {
  private readonly productos = inject(ProductosService);

  protected readonly marcas = MARCAS;
  protected readonly tipos = TIPOS_DIAGRAMA;
  protected readonly formatearPrecio = formatearPrecio;
  protected readonly formatearAnios = formatearAnios;

  private readonly alta = signal(altaVacia());
  protected readonly formulario = form(this.alta, (ruta) => {
    required(ruta.marcaSlug, { message: 'Elegí la marca' });
    required(ruta.modelo, { message: 'Indicá el modelo' });
    required(ruta.anioDesde, { message: 'Indicá el año desde' });
    min(ruta.anioDesde, ANIO_MINIMO, { message: `El año no puede ser anterior a ${ANIO_MINIMO}` });
    max(ruta.anioDesde, ANIO_MAXIMO, { message: `El año no puede ser posterior a ${ANIO_MAXIMO}` });
    required(ruta.anioHasta, { message: 'Indicá el año hasta' });
    min(ruta.anioHasta, ANIO_MINIMO, { message: `El año no puede ser anterior a ${ANIO_MINIMO}` });
    max(ruta.anioHasta, ANIO_MAXIMO, { message: `El año no puede ser posterior a ${ANIO_MAXIMO}` });
    validate(ruta.anioHasta, ({ value, valueOf }) => {
      const hasta = value();
      const desde = valueOf(ruta.anioDesde);
      if (hasta === null || desde === null || hasta >= desde) {
        return undefined;
      }
      return { kind: 'rango', message: 'El año hasta no puede ser menor que el año desde' };
    });
    required(ruta.tipo, { message: 'Elegí el tipo de diagrama' });
    required(ruta.titulo, { message: 'Indicá el título' });
    required(ruta.precio, { message: 'Indicá el precio' });
    min(ruta.precio, 1, { message: 'El precio debe ser mayor a 0' });
  });

  protected readonly catalogo = this.productos.catalogo;
  protected readonly cargado = signal<Producto | null>(null);
  protected readonly marcaCargada = computed(() => {
    const producto = this.cargado();
    return producto ? buscarMarca(producto.marcaSlug) : undefined;
  });

  nombreMarca(slug: string): string {
    return buscarMarca(slug)?.nombre ?? slug;
  }

  etiquetaTipo(tipo: TipoDiagrama): string {
    return tipoDiagrama(tipo).etiqueta;
  }

  erroresDe(
    campo: 'marcaSlug' | 'modelo' | 'anioDesde' | 'anioHasta' | 'tipo' | 'titulo' | 'precio',
  ): string[] {
    const estado = this.formulario[campo]();
    if (!estado.touched() || !estado.invalid()) {
      return [];
    }
    return estado.errors().map((error) => error.message ?? 'Dato inválido');
  }

  async cargar(evento: Event): Promise<void> {
    evento.preventDefault();
    this.cargado.set(null);
    let creado: Producto | undefined;
    const ok = await submit(this.formulario, async () => {
      const datos = this.alta();
      creado = this.productos.agregar({
        marcaSlug: datos.marcaSlug,
        modelo: datos.modelo,
        anioDesde: datos.anioDesde ?? 0,
        anioHasta: datos.anioHasta ?? 0,
        tipo: datos.tipo as TipoDiagrama,
        titulo: datos.titulo,
        precio: datos.precio ?? 0,
        descripcion: datos.descripcion,
      } satisfies AltaProducto);
      return undefined;
    });
    if (!ok || !creado) {
      return;
    }
    this.cargado.set(creado);
    this.alta.set(altaVacia());
  }
}
