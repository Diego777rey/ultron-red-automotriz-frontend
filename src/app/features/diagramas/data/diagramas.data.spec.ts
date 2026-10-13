import { MARCAS } from '../../marcas/data/marcas.data';
import { DIAGRAMAS_PROTOTIPO } from './diagramas.data';

describe('DIAGRAMAS_PROTOTIPO', () => {
  it('tiene al menos un diagrama por cada marca, sin ids repetidos', () => {
    const ids = DIAGRAMAS_PROTOTIPO.map((diagrama) => diagrama.id);
    expect(new Set(ids).size).toBe(ids.length);

    const slugs = new Set(DIAGRAMAS_PROTOTIPO.map((diagrama) => diagrama.marcaSlug));
    expect(slugs).toEqual(new Set(MARCAS.map((marca) => marca.slug)));
  });
});
