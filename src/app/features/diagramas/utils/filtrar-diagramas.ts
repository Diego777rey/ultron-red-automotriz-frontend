import { Diagrama } from '../models/diagrama.model';

export interface FiltroDiagramas {
  modelo: string;
  anio: number | null;
}

export function filtrarDiagramas(
  diagramas: readonly Diagrama[],
  filtro: FiltroDiagramas,
): Diagrama[] {
  return diagramas.filter((diagrama) => {
    const coincideModelo = filtro.modelo === '' || diagrama.modelo === filtro.modelo;
    const coincideAnio = filtro.anio === null || diagrama.anio === filtro.anio;
    return coincideModelo && coincideAnio;
  });
}

export function modelosDisponibles(diagramas: readonly Diagrama[], anio: number | null): string[] {
  const base = anio === null ? diagramas : diagramas.filter((diagrama) => diagrama.anio === anio);
  return [...new Set(base.map((diagrama) => diagrama.modelo))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

export function aniosDisponibles(diagramas: readonly Diagrama[], modelo: string): number[] {
  const base =
    modelo === '' ? diagramas : diagramas.filter((diagrama) => diagrama.modelo === modelo);
  return [...new Set(base.map((diagrama) => diagrama.anio))].sort((a, b) => b - a);
}
