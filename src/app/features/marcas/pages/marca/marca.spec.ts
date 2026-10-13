import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../app.routes';
import { ProductosService } from '../../../productos/services/productos.service';

describe('MarcaComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    TestBed.inject(ProductosService).reiniciar();
  });

  it('muestra los diagramas de la marca con precio', async () => {
    const harness = await RouterTestingHarness.create('/marcas/toyota');
    const elemento = harness.routeNativeElement as HTMLElement;

    expect(elemento.querySelector('h1')?.textContent).toBe('Diagramas Toyota');
    expect(elemento.querySelectorAll('app-producto-card').length).toBeGreaterThan(0);
    expect(elemento.textContent).toContain('Hilux');
    expect(elemento.querySelector('.producto-card__precio')?.textContent).toContain('Gs.');
  });

  it('filtra por modelo y año para dejar el artículo exacto', async () => {
    const harness = await RouterTestingHarness.create('/marcas/toyota');
    const elemento = harness.routeNativeElement as HTMLElement;

    const modelo = elemento.querySelector<HTMLSelectElement>('#filtro-modelo')!;
    modelo.value = 'Hilux';
    modelo.dispatchEvent(new Event('input'));
    modelo.dispatchEvent(new Event('change'));
    harness.detectChanges();
    await harness.fixture.whenStable();

    const titulosTrasModelo = textosDeTarjetas(elemento);
    expect(titulosTrasModelo.length).toBe(2);
    expect(titulosTrasModelo.every((titulo) => titulo.includes('Hilux'))).toBe(true);

    const anio = elemento.querySelector<HTMLSelectElement>('#filtro-anio')!;
    anio.value = '2018';
    anio.dispatchEvent(new Event('input'));
    anio.dispatchEvent(new Event('change'));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(textosDeTarjetas(elemento).length).toBe(2);
    expect(elemento.querySelector('.marca__resumen')?.textContent?.trim()).toBe('2 diagramas');
  });

  it('avisa cuando la marca no tiene diagramas', async () => {
    const harness = await RouterTestingHarness.create('/marcas/bmw');
    const elemento = harness.routeNativeElement as HTMLElement;

    expect(elemento.querySelector('.marca__vacio')?.textContent).toContain(
      'Todavía no hay diagramas de BMW',
    );
    expect(elemento.querySelector('app-producto-card')).toBeNull();
  });

  it('avisa cuando el slug no existe', async () => {
    const harness = await RouterTestingHarness.create('/marcas/no-existe');
    const elemento = harness.routeNativeElement as HTMLElement;

    expect(elemento.querySelector('h1')?.textContent).toBe('No encontramos esa marca');
    expect(elemento.querySelector('.marca__vacio a')?.textContent).toContain('Volvé al inicio');
  });
});

function textosDeTarjetas(elemento: HTMLElement): string[] {
  return Array.from(elemento.querySelectorAll('app-producto-card h2')).map(
    (nodo) => nodo.textContent?.trim() ?? '',
  );
}
