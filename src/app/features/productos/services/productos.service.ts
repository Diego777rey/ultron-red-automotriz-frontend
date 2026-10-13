import { Service, computed, signal } from '@angular/core';
import { PRODUCTOS_INICIALES } from '../data/productos.data';
import { AltaProducto, Producto } from '../models/producto.model';

@Service()
export class ProductosService {
  private siguienteId = PRODUCTOS_INICIALES.length + 1;
  private readonly productos = signal<Producto[]>([...PRODUCTOS_INICIALES]);

  readonly catalogo = this.productos.asReadonly();
  readonly cantidad = computed(() => this.productos().length);

  agregar(alta: AltaProducto): Producto {
    const producto: Producto = {
      ...alta,
      modelo: alta.modelo.trim(),
      titulo: alta.titulo.trim(),
      descripcion: alta.descripcion?.trim() || undefined,
      id: `nuevo-${this.siguienteId++}`,
    };
    this.productos.update((lista) => [producto, ...lista]);
    return producto;
  }

  /** Vuelve el catálogo al prototipo inicial. Pensado para las pruebas. */
  reiniciar(): void {
    this.productos.set([...PRODUCTOS_INICIALES]);
    this.siguienteId = PRODUCTOS_INICIALES.length + 1;
  }
}
