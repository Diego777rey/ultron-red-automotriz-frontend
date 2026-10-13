import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../app.routes';
import { ProductosService } from '../../../productos/services/productos.service';

describe('VendedorProductosComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    TestBed.inject(ProductosService).reiniciar();
  });

  it('carga un diagrama y lo muestra en el catálogo de la marca', async () => {
    const harness = await RouterTestingHarness.create('/vendedor/productos');
    const elemento = harness.routeNativeElement as HTMLElement;

    expect(elemento.querySelector('h1')?.textContent).toBe('Cargar diagramas');

    completar(elemento, '#alta-marca', 'bmw');
    completar(elemento, '#alta-modelo', 'X5');
    completar(elemento, '#alta-anio-desde', '2018');
    completar(elemento, '#alta-anio-hasta', '2022');
    completar(elemento, '#alta-tipo', 'ecu');
    completar(elemento, '#alta-titulo', 'Diagrama ECU BMW X5');
    completar(elemento, '#alta-precio', '200000');

    elemento.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(elemento.querySelector('.vendedor__exito')?.textContent).toContain(
      'Diagrama ECU BMW X5',
    );

    await harness.navigateByUrl('/marcas/bmw');
    const catalogo = harness.routeNativeElement as HTMLElement;
    expect(catalogo.querySelector('h1')?.textContent).toBe('Diagramas BMW');
    expect(textosDeTarjetas(catalogo)).toContain('Diagrama ECU BMW X5');
  });

  it('no carga si faltan datos y muestra el error', async () => {
    const harness = await RouterTestingHarness.create('/vendedor/productos');
    const elemento = harness.routeNativeElement as HTMLElement;
    const cantidadInicial = TestBed.inject(ProductosService).cantidad();

    elemento.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(elemento.querySelector('.vendedor__error')?.textContent).toContain('Elegí la marca');
    expect(TestBed.inject(ProductosService).cantidad()).toBe(cantidadInicial);
    expect(elemento.querySelector('.vendedor__exito')).toBeNull();
  });
});

function completar(elemento: HTMLElement, selector: string, valor: string): void {
  const campo = elemento.querySelector<HTMLInputElement | HTMLSelectElement>(selector)!;
  campo.value = valor;
  campo.dispatchEvent(new Event('input'));
  campo.dispatchEvent(new Event('change'));
}

function textosDeTarjetas(elemento: HTMLElement): string[] {
  return Array.from(elemento.querySelectorAll('app-producto-card h2')).map(
    (nodo) => nodo.textContent?.trim() ?? '',
  );
}
