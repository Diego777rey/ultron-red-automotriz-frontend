import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../app.routes';
import { formatearPrecio } from '../../../diagramas/utils/formatear-precio';

describe('CargarDiagramaComponent', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('preselecciona la marca que viene en la consulta', async () => {
    const harness = await RouterTestingHarness.create('/vendedor?marca=toyota');
    const marca = harness.routeNativeElement!.querySelector('#carga-marca') as HTMLSelectElement;

    expect(marca.value).toBe('toyota');
  });

  it('muestra los errores si se envía vacío y no agrega diagramas', async () => {
    const harness = await RouterTestingHarness.create('/vendedor');
    await enviar(harness);

    const elemento = harness.routeNativeElement!;
    expect(elemento.textContent).toContain('Elegí una marca.');
    expect(elemento.textContent).toContain('Ingresá el título.');
    expect(elemento.querySelectorAll('app-diagrama-card')).toHaveLength(0);
  });

  it('carga un diagrama y lo muestra en la marca', async () => {
    const harness = await RouterTestingHarness.create('/vendedor?marca=kia');
    const elemento = harness.routeNativeElement!;

    await escribir(harness, '#carga-titulo', 'Diagrama de ECU Cerato 2020');
    await escribir(harness, '#carga-modelo', 'Cerato');
    await escribir(harness, '#carga-anio', '2020');
    await escribir(harness, '#carga-precio', '175000');
    await escribir(harness, '#carga-descripcion', 'Pines del conector de la ECU.');
    await elegir(harness, '#carga-tipo', 'ecu');
    await enviar(harness);

    expect(elemento.textContent).toContain('Diagrama cargado.');
    expect(elemento.querySelector('app-diagrama-card h3')?.textContent).toBe(
      'Diagrama de ECU Cerato 2020',
    );

    await harness.navigateByUrl('/marcas/kia');
    const marca = harness.routeNativeElement!;
    const tarjeta = Array.from(marca.querySelectorAll('app-diagrama-card')).find((card) =>
      card.textContent?.includes('Cerato 2020'),
    );

    expect(tarjeta?.textContent).toContain(formatearPrecio(175000));

    await elegir(harness, '#filtro-modelo', 'Cerato');
    await elegir(harness, '#filtro-anio', '2020');
    const visibles = harness.routeNativeElement!.querySelectorAll('app-diagrama-card');
    expect(visibles).toHaveLength(1);
    expect(visibles[0].textContent).toContain('Diagrama de ECU Cerato 2020');
  });
});

async function escribir(
  harness: RouterTestingHarness,
  selector: string,
  valor: string,
): Promise<void> {
  const campo = harness.routeNativeElement!.querySelector(selector) as HTMLInputElement;
  campo.value = valor;
  campo.dispatchEvent(new Event('input', { bubbles: true }));
  campo.dispatchEvent(new Event('change', { bubbles: true }));
  harness.detectChanges();
  await harness.fixture.whenStable();
}

async function elegir(
  harness: RouterTestingHarness,
  selector: string,
  valor: string,
): Promise<void> {
  const campo = harness.routeNativeElement!.querySelector(selector) as HTMLSelectElement;
  campo.value = valor;
  campo.dispatchEvent(new Event('change', { bubbles: true }));
  campo.dispatchEvent(new Event('input', { bubbles: true }));
  harness.detectChanges();
  await harness.fixture.whenStable();
}

async function enviar(harness: RouterTestingHarness): Promise<void> {
  const formulario = harness.routeNativeElement!.querySelector('.cargar__formulario')!;
  formulario.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  harness.detectChanges();
  await harness.fixture.whenStable();
}
