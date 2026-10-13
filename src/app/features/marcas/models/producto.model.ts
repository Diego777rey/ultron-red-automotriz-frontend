export interface Producto {
  id: string;
  titulo: string;
  descripcion: string;
  marca: string;
  modelo: string;
  anio: number;
  /** Tipo de diagrama: ECU, Tablero, Inmovilizador, Airbag, Pinout */
  tipo: TipoDiagrama;
  precio: number;
  imagen?: string;
  disponible: boolean;
}

export type TipoDiagrama = 'ECU' | 'Tablero' | 'Inmovilizador' | 'Airbag' | 'Pinout';

export const TIPOS_DIAGRAMA: readonly TipoDiagrama[] = [
  'ECU',
  'Tablero',
  'Inmovilizador',
  'Airbag',
  'Pinout',
];
