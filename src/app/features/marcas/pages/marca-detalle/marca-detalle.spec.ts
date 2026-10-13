import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../app.routes';

describe('MarcaDetalleComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('muestra los diagramas de la marca y filtra por modelo y año', async () => {
    const harness = await RouterTestingHarness.create('/marcas/toyota');
    const elemento = harness.routeNativeElement!;

    expect(elemento.querySelector('h1')?.textContent?.trim()).toBe('Diagramas Toyota');
    expect(elemento.querySelectorAll('app-diagrama-card')).toHaveLength(8);

    await elegir(harness, '#filtro-modelo', 'Corolla');
    expect(elemento.querySelectorAll('app-diagrama-card')).toHaveLength(3);
    expect(textos(elemento, '#filtro-anio option')).toEqual([
      'Todos los años',
      '2022',
      '2018',
      '2016',
    ]);

    await elegir(harness, '#filtro-anio', '2016');
    expect(elemento.querySelectorAll('app-diagrama-card')).toHaveLength(1);
    expect(elemento.textContent).toContain('Diagrama de ECU Corolla 2016');
    expect(elemento.querySelector('.marca-detalle__resumen')?.textContent?.trim()).toBe(
      '1 diagrama para modelo Corolla, año 2016',
    );
  });

  it('suelta el año si el modelo elegido no lo tiene', async () => {
    const harness = await RouterTestingHarness.create('/marcas/toyota');
    await elegir(harness, '#filtro-modelo', 'Corolla');
    await elegir(harness, '#filtro-anio', '2018');
    await elegir(harness, '#filtro-modelo', 'Hilux');

    const elemento = harness.routeNativeElement!;
    expect((elemento.querySelector('#filtro-anio') as HTMLSelectElement).value).toBe('');
    expect(elemento.querySelectorAll('app-diagrama-card')).toHaveLength(3);
    expect(elemento.textContent).toContain('Hilux');
  });

  it('avisa si la marca no existe', async () => {
    const harness = await RouterTestingHarness.create('/marcas/no-existe');
    const elemento = harness.routeNativeElement!;

    expect(elemento.querySelector('h1')?.textContent?.trim()).toBe('Marca no encontrada');
    expect(elemento.querySelector('app-diagrama-card')).toBeNull();
    expect(elemento.querySelector('a')?.getAttribute('href')).toBe('/');
  });
});

async function elegir(
  harness: RouterTestingHarness,
  selector: string,
  valor: string,
): Promise<void> {
  const campo = harness.routeNativeElement!.querySelector(selector) as HTMLSelectElement;
  campo.value = valor;
  campo.dispatchEvent(new Event('input', { bubbles: true }));
  campo.dispatchEvent(new Event('change', { bubbles: true }));
  harness.detectChanges();
  await harness.fixture.whenStable();
}

function textos(elemento: Element, selector: string): string[] {
  return Array.from(elemento.querySelectorAll(selector)).map(
    (nodo) => nodo.textContent?.trim() ?? '',
  );
}
