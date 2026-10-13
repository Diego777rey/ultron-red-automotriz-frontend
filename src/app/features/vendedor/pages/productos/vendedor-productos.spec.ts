import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../app.routes';
import { ProductosService } from '../../../productos/services/productos.service';
import { VendedorProductosComponent } from './vendedor-productos';

describe('VendedorProductosComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
    TestBed.inject(ProductosService).reiniciar();
  });

  it('carga un diagrama y lo muestra en el catálogo de la marca', async () => {
    const harness = await RouterTestingHarness.create('/vendedor/productos');
    const pagina = harness.fixture.debugElement.query(
      By.directive(VendedorProductosComponent),
    ).componentInstance as VendedorProductosComponent;

    (
      pagina as unknown as {
        formulario: { (): { value: { set(datos: object): void } } };
      }
    ).formulario().value.set({
      marcaSlug: 'bmw',
      modelo: 'X5',
      anioDesde: 2018,
      anioHasta: 2022,
      tipo: 'ecu',
      titulo: 'Diagrama ECU BMW X5',
      precio: 200000,
      descripcion: '',
    });
    await pagina.cargar(new Event('submit'));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(harness.routeNativeElement?.querySelector('.vendedor__exito')?.textContent).toContain(
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

    elemento
      .querySelector('app-vendedor-productos form')!
      .dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    harness.detectChanges();
    await harness.fixture.whenStable();

    expect(elemento.querySelector('.vendedor__error')?.textContent).toContain('Elegí la marca');
    expect(TestBed.inject(ProductosService).cantidad()).toBe(cantidadInicial);
    expect(elemento.querySelector('.vendedor__exito')).toBeNull();
  });
});

function textosDeTarjetas(elemento: HTMLElement): string[] {
  return Array.from(elemento.querySelectorAll('app-producto-card h2')).map(
    (nodo) => nodo.textContent?.trim() ?? '',
  );
}
