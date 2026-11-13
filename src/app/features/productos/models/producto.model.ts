/** Categoría de producto publicada en el catálogo web. */
export interface CategoriaCatalogo {
  id: number;
  nombre: string;
  padre?: { id: number; nombre: string } | null;
}

/** Presentación (pack / unidad) opcional de un producto. */
export interface PresentacionCatalogo {
  id: number;
  descripcion: string;
  codigoBarras?: string | null;
  cantidad: number;
  precio: number | null;
}

/**
 * Producto del catálogo web (solo los que el backend publica con
 * `mostrarEnWeb`, imagen y precio de venta > 0).
 */
export interface ProductoCatalogo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  precioVenta: number;
  /** Ruta relativa en uploads, o URL absoluta. */
  imagen: string | null;
  /** URL lista para `<img src>`. */
  imagenUrl: string;
  tipoIva: string | null;
  categoria: CategoriaCatalogo | null;
  presentaciones: readonly PresentacionCatalogo[];
}

/** Forma cruda que devuelve GraphQL (`id_producto`, etc.). */
export interface ProductoCatalogoGql {
  id_producto: number | string;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  precioVenta: number | string;
  imagen?: string | null;
  tipoIva?: string | null;
  categoriaProducto?: {
    id_categoria_producto: number | string;
    nombre: string;
    categoriaPadre?: {
      id_categoria_producto: number | string;
      nombre: string;
    } | null;
  } | null;
  presentaciones?: Array<{
    id_presentacion_producto: number | string;
    descripcion: string;
    codigoBarras?: string | null;
    cantidad?: number | string | null;
    precio?: number | string | null;
  }> | null;
}

export interface CategoriaCatalogoGql {
  id_categoria_producto: number | string;
  nombre: string;
  categoriaPadre?: {
    id_categoria_producto: number | string;
    nombre: string;
  } | null;
}
