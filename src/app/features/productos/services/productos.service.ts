import { Injectable, computed, inject, signal } from '@angular/core';
import { ProductoDiagrama, ProductoNuevo } from '../models/producto.model';
import { ProductosRepository } from '../repository/productos.repository';

function nuevoId(): string {
  return `prod-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly repository = inject(ProductosRepository);

  private readonly productos = signal<readonly ProductoDiagrama[]>(this.repository.listar());

  readonly todos = this.productos.asReadonly();
  readonly total = computed(() => this.productos().length);

  /** Catálogo público: solo productos activos. */
  porMarca(marcaSlug: string): readonly ProductoDiagrama[] {
    return this.productos().filter((producto) => producto.marcaSlug === marcaSlug && producto.activo !== false);
  }

  obtener(id: string): ProductoDiagrama | undefined {
    return this.productos().find((producto) => producto.id === id);
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

  crear(nuevo: ProductoNuevo): ProductoDiagrama {
    const producto: ProductoDiagrama = {
      ...nuevo,
      id: nuevoId(),
      activo: nuevo.activo ?? true,
    };
    this.persistir([...this.productos(), producto]);
    return producto;
  }

  actualizar(id: string, cambios: Partial<ProductoNuevo>): ProductoDiagrama | null {
    const actual = this.obtener(id);
    if (!actual) {
      return null;
    }
    const actualizado: ProductoDiagrama = { ...actual, ...cambios, id: actual.id };
    this.persistir(this.productos().map((p) => (p.id === id ? actualizado : p)));
    return actualizado;
  }

  eliminar(id: string): boolean {
    const existe = this.obtener(id);
    if (!existe) {
      return false;
    }
    this.persistir(this.productos().filter((p) => p.id !== id));
    return true;
  }

  private persistir(productos: readonly ProductoDiagrama[]): void {
    this.productos.set(productos);
    this.repository.guardarTodos(productos);
  }
}
