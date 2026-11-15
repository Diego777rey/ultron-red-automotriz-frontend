import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { API_CONFIG } from './config/api.config';

describe('App', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el menú, la página de inicio y el pie en la ruta raíz', async () => {
    const harness = await RouterTestingHarness.create('/');
    const elemento = harness.routeNativeElement as HTMLElement;

    for (const req of http.match(API_CONFIG.graphqlEndpoint)) {
      const query = String(req.request.body.query);
      if (query.includes('catalogoWebProductosMasComprados')) {
        req.flush({ data: { catalogoWebProductosMasComprados: [] } });
      } else {
        req.flush({ data: {} });
      }
    }

    expect(document.querySelector('app-header .header__marca')?.textContent?.trim()).toBe(
      'Red Automotriz.',
    );
    expect(elemento.querySelector('#mas-comprados-titulo')?.textContent?.trim()).toBe(
      'Más comprados',
    );
    expect(document.querySelector('app-footer footer')).not.toBeNull();
  });
});
