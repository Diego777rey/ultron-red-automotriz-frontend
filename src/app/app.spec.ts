import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
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
    expect(elemento.querySelector('.inicio__marca')?.textContent?.trim()).toBe('Red Automotriz');
    expect(elemento.querySelector('#catalogo')).not.toBeNull();
    expect(document.querySelector('app-footer footer')).not.toBeNull();
  });
});
