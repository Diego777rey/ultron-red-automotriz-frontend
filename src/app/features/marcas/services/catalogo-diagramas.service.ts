import { Service, computed, signal } from '@angular/core';
import {
  DIAGRAMAS_INICIALES,
  generarDiagramasPrototipoMarca,
} from '../data/diagramas.data';
import { MARCAS } from '../data/marcas.data';
import { DiagramaArticulo, NuevoDiagramaArticulo } from '../models/diagrama.model';

function construirCatalogoInicial(): DiagramaArticulo[] {
  const iniciales = [...DIAGRAMAS_INICIALES];
  const slugsConDatos = new Set(iniciales.map((item) => item.marcaSlug));

  for (const marca of MARCAS) {
    if (!slugsConDatos.has(marca.slug)) {
      iniciales.push(...generarDiagramasPrototipoMarca(marca.slug, marca.nombre));
    }
  }

  return iniciales;
}

@Service()
export class CatalogoDiagramasService {
  private readonly articulosSignal = signal<readonly DiagramaArticulo[]>(
    construirCatalogoInicial(),
  );
  private readonly carritoIdsSignal = signal<readonly string[]>([]);
  private siguienteSecuencia = 1;

  readonly articulos = this.articulosSignal.asReadonly();
  readonly cantidadCarrito = computed(() => this.carritoIdsSignal().length);

  obtenerPorMarca(marcaSlug: string): DiagramaArticulo[] {
    return this.articulosSignal().filter((item) => item.marcaSlug === marcaSlug);
  }

  agregarArticulo(nuevo: NuevoDiagramaArticulo): DiagramaArticulo {
    const id = `${nuevo.marcaSlug}-${nuevo.modelo.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nuevo.anio}-v${this.siguienteSecuencia++}`;
    const creado: DiagramaArticulo = {
      id,
      marcaSlug: nuevo.marcaSlug,
      modelo: nuevo.modelo.trim(),
      anio: Number(nuevo.anio),
      titulo: nuevo.titulo.trim(),
      categoria: nuevo.categoria,
      descripcion: nuevo.descripcion.trim(),
      precio: Number(nuevo.precio),
      moneda: nuevo.moneda ?? 'Gs.',
    };

    this.articulosSignal.update((actuales) => [creado, ...actuales]);
    return creado;
  }

  eliminarArticulo(id: string): void {
    this.articulosSignal.update((actuales) => actuales.filter((item) => item.id !== id));
    this.carritoIdsSignal.update((ids) => ids.filter((itemId) => itemId !== id));
  }

  agregarAlCarrito(id: string): void {
    this.carritoIdsSignal.update((ids) => [...ids, id]);
  }
}
