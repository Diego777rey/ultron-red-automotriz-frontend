export type CategoriaDiagrama =
  | 'ECU'
  | 'Tableros'
  | 'Inmovilizadores'
  | 'Airbag'
  | 'Pinouts';

export const CATEGORIAS_DIAGRAMA: readonly CategoriaDiagrama[] = [
  'ECU',
  'Tableros',
  'Inmovilizadores',
  'Airbag',
  'Pinouts',
];

export interface DiagramaArticulo {
  id: string;
  marcaSlug: string;
  modelo: string;
  anio: number;
  titulo: string;
  categoria: CategoriaDiagrama;
  descripcion: string;
  precio: number;
  moneda: string;
}

export type NuevoDiagramaArticulo = Omit<DiagramaArticulo, 'id' | 'moneda'> & {
  moneda?: string;
};
