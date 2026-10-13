import { Injectable, inject } from '@angular/core';
import { AlmacenLocalService } from '../../../core/almacen/almacen-local.service';
import { PRODUCTOS_INICIALES } from '../data/productos.data';
import { ProductoDiagrama } from '../models/producto.model';

const CLAVE_CATALOGO = 'ra-catalogo-productos-v1';

@Injectable({ providedIn: 'root' })
export class ProductosRepository {
  private readonly almacen = inject(AlmacenLocalService);

  listar(): ProductoDiagrama[] {
    const guardados = this.almacen.leerJson<ProductoDiagrama[] | null>(CLAVE_CATALOGO, null);
    if (guardados && guardados.length > 0) {
      return [...guardados];
    }
    this.almacen.guardarJson(CLAVE_CATALOGO, PRODUCTOS_INICIALES);
    return [...PRODUCTOS_INICIALES];
  }

  guardarTodos(productos: readonly ProductoDiagrama[]): void {
    this.almacen.guardarJson(CLAVE_CATALOGO, productos);
  }
}
