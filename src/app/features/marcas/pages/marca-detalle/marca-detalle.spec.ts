import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CatalogoDiagramasService } from '../../services/catalogo-diagramas.service';
import { MARCAS_ROUTES } from '../../marcas.routes';

describe('MarcaDetalleComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'marcas', children: MARCAS_ROUTES }])],
    });
  });

  it('muestra la marca seleccionada y sus tarjetas con valores', async () => {
    const harness = await RouterTestingHarness.create('/marcas/toyota');
    const elemento = harness.routeNativeElement as HTMLElement;

    expect(elemento.querySelector('h1')?.textContent?.trim()).toBe('Diagramas eléctricos Toyota');
    const tarjetas = elemento.querySelectorAll('app-diagrama-card');
    expect(tarjetas.length).toBeGreaterThan(0);
    expect(tarjetas[0].querySelector('.diagrama-card__precio')?.textContent).toContain('Gs.');
  });

  it('filtra los artículos por modelo y por año para encontrar el artículo exacto', async () => {
    const harness = await RouterTestingHarness.create('/marcas/toyota');
    const elemento = harness.routeNativeElement as HTMLElement;

    const totalInicial = elemento.querySelectorAll('app-diagrama-card').length;
    expect(totalInicial).toBe(6);

    const selectModelo = elemento.querySelector<HTMLSelectElement>('#filtro-modelo')!;
    selectModelo.value = 'Hilux';
    selectModelo.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();

    expect(elemento.querySelectorAll('app-diagrama-card')).toHaveLength(3);

    const selectAnio = elemento.querySelector<HTMLSelectElement>('#filtro-anio')!;
    selectAnio.value = '2020';
    selectAnio.dispatchEvent(new Event('input'));
    await harness.fixture.whenStable();

    const tarjetasFiltradas = elemento.querySelectorAll('app-diagrama-card');
    expect(tarjetasFiltradas).toHaveLength(1);
    expect(tarjetasFiltradas[0].textContent).toContain('Sistema inmovilizador y Smart Key');
  });

  it('incrementa el carrito al comprar un diagrama', async () => {
    const harness = await RouterTestingHarness.create('/marcas/toyota');
    const elemento = harness.routeNativeElement as HTMLElement;
    const catalogo = TestBed.inject(CatalogoDiagramasService);

    expect(catalogo.cantidadCarrito()).toBe(0);

    const botonComprar = elemento.querySelector<HTMLButtonElement>('.diagrama-card__boton')!;
    botonComprar.click();
    await harness.fixture.whenStable();

    expect(catalogo.cantidadCarrito()).toBe(1);
    expect(elemento.querySelector('.marca-detalle__aviso-carrito')?.textContent).toContain(
      'Se agregó',
    );
  });

  it('muestra estado de marca no encontrada si el slug no existe', async () => {
    const harness = await RouterTestingHarness.create('/marcas/marca-inexistente');
    const elemento = harness.routeNativeElement as HTMLElement;

    expect(elemento.querySelector('h1')?.textContent?.trim()).toBe('Marca no encontrada');
  });
});
