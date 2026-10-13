import { ProductoDiagrama } from '../../productos/models/producto.model';

export interface LineaCarrito {
  productoId: string;
  cantidad: number;
  /** Copia al agregar para mostrar aunque el producto se edite después. */
  producto: ProductoDiagrama;
}
