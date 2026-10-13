import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CatalogoDiagramasService } from '../../../marcas/services/catalogo-diagramas.service';
import { VENDEDOR_ROUTES } from '../../vendedor.routes';

describe('VendedorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'vendedor', children: VENDEDOR_ROUTES }])],
    });
  });

  function completarCampo(elemento: HTMLElement, selector: string, valor: string): void {
    const input = elemento.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
    input.value = valor;
    input.dispatchEvent(new Event('input'));
  }

  it('permite al vendedor cargar un producto nuevo que se agrega al catálogo de la marca', async () => {
    const harness = await RouterTestingHarness.create('/vendedor?marca=toyota');
    const elemento = harness.routeNativeElement as HTMLElement;
    const catalogo = TestBed.inject(CatalogoDiagramasService);

    const cantidadInicial = catalogo.obtenerPorMarca('toyota').length;

    completarCampo(elemento, '#vendedor-modelo', 'Yaris');
    completarCampo(elemento, '#vendedor-anio', '2024');
    completarCampo(elemento, '#vendedor-titulo', 'Diagrama ECU Motor 1.5 Yaris');
    completarCampo(elemento, '#vendedor-precio', '130000');
    completarCampo(elemento, '#vendedor-descripcion', 'Esquema completo Yaris 2024.');

    const formulario = elemento.querySelector<HTMLFormElement>('.vendedor__formulario')!;
    formulario.dispatchEvent(new Event('submit', { cancelable: true }));
    await harness.fixture.whenStable();

    const articulosToyota = catalogo.obtenerPorMarca('toyota');
    expect(articulosToyota).toHaveLength(cantidadInicial + 1);
    expect(articulosToyota[0].modelo).toBe('Yaris');
    expect(articulosToyota[0].anio).toBe(2024);
    expect(articulosToyota[0].precio).toBe(130000);
    expect(elemento.querySelector('.vendedor__alerta--exito')?.textContent).toContain(
      'Diagrama ECU Motor 1.5 Yaris',
    );
  });

  it('muestra error de validación si faltan datos obligatorios al intentar cargar', async () => {
    const harness = await RouterTestingHarness.create('/vendedor');
    const elemento = harness.routeNativeElement as HTMLElement;

    const formulario = elemento.querySelector<HTMLFormElement>('.vendedor__formulario')!;
    formulario.dispatchEvent(new Event('submit', { cancelable: true }));
    await harness.fixture.whenStable();

    expect(elemento.querySelector('.vendedor__alerta--error')?.textContent).toContain(
      'Completá la marca, el modelo y el título',
    );
  });
});
