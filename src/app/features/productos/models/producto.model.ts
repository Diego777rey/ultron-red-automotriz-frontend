/** Tipos de diagramas eléctricos que vende la tienda. */
export const TIPOS_DIAGRAMA = [
  'ECU',
  'Tablero',
  'Inmovilizador',
  'Airbag',
  'Pinout',
] as const;

export type TipoDiagrama = (typeof TIPOS_DIAGRAMA)[number];

/**
 * Diagrama a la venta (prototipo en memoria; cuando exista backend
 * se cargará desde ahí con la ruta relativa de la imagen/portada).
 */
export interface ProductoDiagrama {
  id: string;
  marcaSlug: string;
  modelo: string;
  anioDesde: number;
  anioHasta: number;
  tipo: TipoDiagrama;
  titulo: string;
  /** Precio en guaraníes. */
  precio: number;
  /** Si es `false`, no se muestra en la tienda. */
  activo?: boolean;
}

/** Datos que carga el vendedor en el prototipo (sin id, lo genera el servicio). */
export type ProductoNuevo = Omit<ProductoDiagrama, 'id'>;
