import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el menú, la página de inicio y el pie en la ruta raíz', async () => {
    const harness = await RouterTestingHarness.create('/');
    const elemento = harness.routeNativeElement as HTMLElement;

    expect(document.querySelector('app-header .header__marca')?.textContent?.trim()).toBe(
      'Red Automotriz.',
    );
    expect(elemento.querySelector('h1')?.textContent).toBe(
      'Diagramas eléctricos automotrices por marca',
    );
    expect(elemento.querySelectorAll('app-marca-card').length).toBeGreaterThan(0);
    expect(document.querySelector('app-footer footer')).not.toBeNull();
  });

  it('al elegir una marca abre su catálogo de diagramas', async () => {
    const harness = await RouterTestingHarness.create('/');
    const toyota = document.querySelector<HTMLAnchorElement>('a[href="/marcas/toyota"]')!;
    expect(toyota).not.toBeNull();

    await harness.navigateByUrl('/marcas/toyota');
    const catalogo = harness.routeNativeElement as HTMLElement;
    expect(catalogo.querySelector('h1')?.textContent).toBe('Diagramas Toyota');
    expect(catalogo.querySelectorAll('app-producto-card').length).toBeGreaterThan(0);
  });
});
