export const CATEGORIAS_PRODUCTO = [
  'ECU',
  'Tablero',
  'Inmovilizador',
  'Airbag',
  'Pinout',
] as const;

export type CategoriaProducto = (typeof CATEGORIAS_PRODUCTO)[number];

export interface Producto {
  id: string;
  marcaSlug: string;
  nombre: string;
  modelo: string;
  anio: number;
  categoria: CategoriaProducto;
  descripcion: string;
  precio: number;
  publicadoPorVendedor?: boolean;
}

export interface NuevoProducto {
  marcaSlug: string;
  nombre: string;
  modelo: string;
  anio: number;
  categoria: CategoriaProducto;
  descripcion: string;
  precio: number;
}
