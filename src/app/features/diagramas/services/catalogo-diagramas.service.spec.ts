import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DIAGRAMAS_PROTOTIPO } from '../data/diagramas.data';
import { CLAVE_DIAGRAMAS_VENDEDOR, CatalogoDiagramasService } from './catalogo-diagramas.service';

@Component({ template: '' })
class Anfitrion {
  readonly catalogo = inject(CatalogoDiagramasService);
}

describe('CatalogoDiagramasService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('suma un diagrama del vendedor y no deja borrar un prototipo', async () => {
    const fixture = TestBed.createComponent(Anfitrion);
    await fixture.whenStable();
    const catalogo = fixture.componentInstance.catalogo;
    const prototipo = DIAGRAMAS_PROTOTIPO[0];

    catalogo.quitar(prototipo.id);
    expect(catalogo.todos().some((diagrama) => diagrama.id === prototipo.id)).toBe(true);

    const cargado = catalogo.cargar({
      marcaSlug: 'kia',
      titulo: 'Diagrama de ECU Sportage 2019',
      modelo: 'Sportage',
      anio: 2019,
      tipo: 'ecu',
      precio: 200000,
      descripcion: 'Cargado por el vendedor.',
    });

    expect(catalogo.todos().some((diagrama) => diagrama.id === cargado.id)).toBe(true);
    expect(JSON.parse(localStorage.getItem(CLAVE_DIAGRAMAS_VENDEDOR) ?? '[]')).toEqual([
      expect.objectContaining({ id: cargado.id, origen: 'vendedor', modelo: 'Sportage' }),
    ]);

    catalogo.quitar(cargado.id);
    expect(catalogo.todos().some((diagrama) => diagrama.id === cargado.id)).toBe(false);
    expect(localStorage.getItem(CLAVE_DIAGRAMAS_VENDEDOR)).toBe('[]');
  });

  it('recupera los diagramas del vendedor guardados y descarta los inválidos', async () => {
    localStorage.setItem(
      CLAVE_DIAGRAMAS_VENDEDOR,
      JSON.stringify([
        {
          id: 'vendedor-guardado',
          marcaSlug: 'ford',
          titulo: 'Diagrama de ECU Ranger 2019',
          modelo: 'Ranger',
          anio: 2019,
          tipo: 'ecu',
          precio: 210000,
          descripcion: 'Guardado en el navegador.',
          origen: 'vendedor',
        },
        { id: 'roto', origen: 'vendedor' },
      ]),
    );

    const fixture = TestBed.createComponent(Anfitrion);
    await fixture.whenStable();

    const modelos = fixture.componentInstance.catalogo
      .todos()
      .filter((diagrama) => diagrama.marcaSlug === 'ford')
      .map((diagrama) => diagrama.modelo);
    expect(modelos).toContain('Ranger');
    expect(
      fixture.componentInstance.catalogo.todos().some((diagrama) => diagrama.id === 'roto'),
    ).toBe(false);
  });
});
