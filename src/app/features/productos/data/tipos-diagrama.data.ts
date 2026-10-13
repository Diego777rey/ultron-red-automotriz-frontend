import { TipoDiagrama } from '../models/producto.model';

export interface TipoDiagramaInfo {
  id: TipoDiagrama;
  etiqueta: string;
  icono: string;
}

export const TIPOS_DIAGRAMA: readonly TipoDiagramaInfo[] = [
  { id: 'ecu', etiqueta: 'ECU', icono: 'developer_board' },
  { id: 'tablero', etiqueta: 'Tablero', icono: 'dashboard' },
  { id: 'inmovilizador', etiqueta: 'Inmovilizador', icono: 'lock' },
  { id: 'airbag', etiqueta: 'Airbag', icono: 'health_and_safety' },
  { id: 'pinout', etiqueta: 'Pinout', icono: 'account_tree' },
];

const POR_ID = new Map(TIPOS_DIAGRAMA.map((tipo) => [tipo.id, tipo]));

export function tipoDiagrama(id: TipoDiagrama): TipoDiagramaInfo {
  const tipo = POR_ID.get(id);
  if (!tipo) {
    throw new Error(`Tipo de diagrama desconocido: ${id}`);
  }
  return tipo;
}
