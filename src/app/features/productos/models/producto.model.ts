export type TipoDiagrama = 'ecu' | 'tablero' | 'inmovilizador' | 'airbag' | 'pinout';

export interface Producto {
  id: string;
  marcaSlug: string;
  modelo: string;
  anioDesde: number;
  anioHasta: number;
  tipo: TipoDiagrama;
  titulo: string;
  precio: number;
  descripcion?: string;
}

export type AltaProducto = Omit<Producto, 'id'>;
