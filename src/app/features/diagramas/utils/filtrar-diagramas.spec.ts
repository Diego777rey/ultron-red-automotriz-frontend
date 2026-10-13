import { Diagrama } from '../models/diagrama.model';
import { aniosDisponibles, filtrarDiagramas, modelosDisponibles } from './filtrar-diagramas';

const DIAGRAMAS: readonly Diagrama[] = [
  diagrama('Corolla', 2016, 'ecu'),
  diagrama('Corolla', 2018, 'tablero'),
  diagrama('Hilux', 2016, 'airbag'),
];

describe('filtrarDiagramas', () => {
  it('devuelve todo si no hay modelo ni año', () => {
    expect(filtrarDiagramas(DIAGRAMAS, { modelo: '', anio: null })).toEqual(DIAGRAMAS);
  });

  it('combina modelo y año para dejar un diagrama', () => {
    expect(filtrarDiagramas(DIAGRAMAS, { modelo: 'Corolla', anio: 2016 }).map((d) => d.id)).toEqual(
      ['Corolla-2016-ecu'],
    );
  });

  it('filtra solo por año', () => {
    expect(filtrarDiagramas(DIAGRAMAS, { modelo: '', anio: 2016 })).toHaveLength(2);
  });

  it('no devuelve nada si la combinación no existe', () => {
    expect(filtrarDiagramas(DIAGRAMAS, { modelo: 'Hilux', anio: 2018 })).toEqual([]);
  });
});

describe('opciones de filtro', () => {
  it('ofrece los años del modelo elegido, del más nuevo al más viejo', () => {
    expect(aniosDisponibles(DIAGRAMAS, 'Corolla')).toEqual([2018, 2016]);
    expect(aniosDisponibles(DIAGRAMAS, '')).toEqual([2018, 2016]);
  });

  it('ofrece los modelos del año elegido', () => {
    expect(modelosDisponibles(DIAGRAMAS, 2016)).toEqual(['Corolla', 'Hilux']);
    expect(modelosDisponibles(DIAGRAMAS, 2018)).toEqual(['Corolla']);
  });
});

function diagrama(modelo: string, anio: number, tipo: Diagrama['tipo']): Diagrama {
  return {
    id: `${modelo}-${anio}-${tipo}`,
    marcaSlug: 'toyota',
    titulo: modelo,
    modelo,
    anio,
    tipo,
    precio: 1000,
    descripcion: 'Prototipo',
    origen: 'prototipo',
  };
}
