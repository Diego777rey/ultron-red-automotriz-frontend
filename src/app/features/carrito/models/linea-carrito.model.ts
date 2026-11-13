/** Línea del carrito persistida en localStorage. */
export interface LineaCarrito {
  productoId: number;
  presentacionId?: number | null;
  cantidad: number;
  /** Instantánea al agregar (por si el catálogo cambia). */
  nombre: string;
  precio: number;
  imagenUrl: string;
  presentacionDescripcion?: string | null;
}

export function claveLineaCarrito(productoId: number, presentacionId?: number | null): string {
  return `${productoId}:${presentacionId ?? 'base'}`;
}
