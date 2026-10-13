import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, computed, inject, Injectable, signal } from '@angular/core';
import { PRODUCTOS_DEMO } from '../data/productos-demo.data';
import { NuevoProducto, Producto } from '../models/producto.model';

const CLAVE_PRODUCTOS_VENDEDOR = 'red-automotriz.productos-vendedor';

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly productosVendedor = signal<readonly Producto[]>(this.leerProductosGuardados());

  readonly productos = computed(() => [...this.productosVendedor(), ...PRODUCTOS_DEMO]);

  agregar(nuevoProducto: NuevoProducto): Producto {
    const producto: Producto = {
      ...nuevoProducto,
      id: `vendedor-${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
      publicadoPorVendedor: true,
    };

    this.productosVendedor.update((productos) => [producto, ...productos]);
    this.guardarProductos();
    return producto;
  }

  private leerProductosGuardados(): readonly Producto[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    try {
      const valor = localStorage.getItem(CLAVE_PRODUCTOS_VENDEDOR);
      return valor ? this.validarProductos(JSON.parse(valor) as unknown) : [];
    } catch {
      return [];
    }
  }

  private guardarProductos(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(CLAVE_PRODUCTOS_VENDEDOR, JSON.stringify(this.productosVendedor()));
    }
  }

  private validarProductos(valor: unknown): readonly Producto[] {
    if (!Array.isArray(valor)) {
      return [];
    }

    return valor.filter(
      (producto): producto is Producto =>
        typeof producto === 'object' &&
        producto !== null &&
        'id' in producto &&
        typeof producto.id === 'string' &&
        'marcaSlug' in producto &&
        typeof producto.marcaSlug === 'string' &&
        'nombre' in producto &&
        typeof producto.nombre === 'string' &&
        'modelo' in producto &&
        typeof producto.modelo === 'string' &&
        'anio' in producto &&
        typeof producto.anio === 'number' &&
        'categoria' in producto &&
        typeof producto.categoria === 'string' &&
        'descripcion' in producto &&
        typeof producto.descripcion === 'string' &&
        'precio' in producto &&
        typeof producto.precio === 'number',
    );
  }
}
