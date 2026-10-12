import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SITIO } from '../../../config/sitio.config';
import { FooterComponent } from './footer';
import { COLUMNAS_FOOTER, ENLACES_LEGALES, METODOS_PAGO } from './footer-contenido';

describe('FooterComponent', () => {
  let elemento: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(FooterComponent);
    elemento = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  function textos(selector: string): string[] {
    return Array.from(elemento.querySelectorAll(selector)).map(
      (nodo) => nodo.textContent?.trim() ?? '',
    );
  }

  it('muestra la marca, la ayuda y el teléfono como enlace de llamada', () => {
    expect(elemento.querySelector('.footer__marca')?.textContent?.trim()).toBe('Red Automotriz.');
    expect(elemento.querySelector('.footer__ayuda')?.textContent?.trim()).toBe('¿Necesitas ayuda?');

    const telefono = elemento.querySelector<HTMLAnchorElement>('.footer__telefono')!;
    expect(telefono.textContent?.trim()).toBe(SITIO.telefono.visible);
    expect(telefono.getAttribute('href')).toBe(SITIO.telefono.enlace);
  });

  it('abre las redes sociales en otra pestaña y lo avisa en la etiqueta', () => {
    const redes = Array.from(elemento.querySelectorAll<HTMLAnchorElement>('.footer__redes a'));

    expect(redes.map((red) => red.getAttribute('href'))).toEqual(SITIO.redes.map((r) => r.url));
    for (const red of redes) {
      expect(red.target).toBe('_blank');
      expect(red.rel).toBe('noopener noreferrer');
      expect(red.getAttribute('aria-label')).toContain('se abre en una pestaña nueva');
    }
  });

  it('arma una columna de navegación por cada grupo, nombrada por su título', () => {
    const columnas = Array.from(elemento.querySelectorAll('nav.footer__columna'));

    expect(columnas.map((nav) => nav.querySelector('h2')?.textContent?.trim())).toEqual(
      COLUMNAS_FOOTER.map((c) => c.titulo),
    );
    for (const nav of columnas) {
      const titulo = nav.querySelector('h2')!;
      expect(nav.getAttribute('aria-labelledby')).toBe(titulo.id);
    }
    expect(columnas[0].querySelector('a')?.getAttribute('href')).toBe('/ofertas');
  });

  it('lista los enlaces legales y los métodos de pago con nombre accesible', () => {
    expect(textos('.footer__legales a')).toEqual(ENLACES_LEGALES.map((e) => e.etiqueta));

    const pagos = Array.from(elemento.querySelectorAll('.footer__pagos app-svg-icon'));
    expect(pagos.map((pago) => pago.getAttribute('aria-label'))).toEqual(
      METODOS_PAGO.map((p) => p.nombre),
    );
    for (const pago of pagos) {
      expect(pago.getAttribute('role')).toBe('img');
    }
  });

  it('muestra el año actual en los créditos', () => {
    expect(elemento.querySelector('.footer__creditos')?.textContent?.trim()).toBe(
      `© ${new Date().getFullYear()} Red Automotriz.`,
    );
  });
});
