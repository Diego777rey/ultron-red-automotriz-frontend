import { Injectable, computed, signal } from '@angular/core';
import { PRODUCTOS_INICIALES } from '../data/productos.data';
import { ProductoDiagrama, ProductoNuevo } from '../models/producto.model';

/**
 * Catálogo en memoria del prototipo: lo que carga el vendedor aparece
 * enseguida en la página de la marca. Cuando exista backend, este
 * servicio va a pedir y guardar los diagramas ahí.
 */
@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly productos = signal<readonly ProductoDiagrama[]>(PRODUCTOS_INICIALES);

  readonly todos = this.productos.asReadonly();
  readonly total = computed(() => this.productos().length);

  porMarca(marcaSlug: string): readonly ProductoDiagrama[] {
    return this.productos().filter((producto) => producto.marcaSlug === marcaSlug);
  }

  modelosDe(marcaSlug: string): readonly string[] {
    const modelos = this.porMarca(marcaSlug).map((producto) => producto.modelo);
    return [...new Set(modelos)].sort((a, b) => a.localeCompare(b, 'es'));
  }

  aniosDe(marcaSlug: string): readonly number[] {
    const anios = this.porMarca(marcaSlug).flatMap((producto) =>
      Array.from({ length: producto.anioHasta - producto.anioDesde + 1 }, (_, i) => producto.anioDesde + i),
    );
    return [...new Set(anios)].sort((a, b) => a - b);
  }

  agregar(nuevo: ProductoNuevo): ProductoDiagrama {
    const producto: ProductoDiagrama = {
      ...nuevo,
      id: `prod-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`,
    };
    this.productos.update((actuales) => [...actuales, producto]);
    return producto;
  }
}
