export const TIPOS_DIAGRAMA = [
  { id: 'ecu', etiqueta: 'ECU' },
  { id: 'tablero', etiqueta: 'Tablero' },
  { id: 'inmovilizador', etiqueta: 'Inmovilizador' },
  { id: 'airbag', etiqueta: 'Airbag' },
  { id: 'pinout', etiqueta: 'Pinout' },
] as const;

export type TipoDiagrama = (typeof TIPOS_DIAGRAMA)[number]['id'];

export interface Diagrama {
  id: string;
  marcaSlug: string;
  titulo: string;
  modelo: string;
  anio: number;
  tipo: TipoDiagrama;
  precio: number;
  descripcion: string;
  origen: 'prototipo' | 'vendedor';
}

export interface NuevoDiagrama {
  marcaSlug: string;
  titulo: string;
  modelo: string;
  anio: number;
  tipo: TipoDiagrama;
  precio: number;
  descripcion: string;
}

const ETIQUETAS = new Map(TIPOS_DIAGRAMA.map((tipo) => [tipo.id, tipo.etiqueta]));

export function etiquetaTipo(tipo: TipoDiagrama): string {
  return ETIQUETAS.get(tipo) ?? tipo;
}

export function esTipoDiagrama(valor: string): valor is TipoDiagrama {
  return ETIQUETAS.has(valor as TipoDiagrama);
}
