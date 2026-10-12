import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let elemento: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    elemento = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  function botonesDeAcciones(): HTMLButtonElement[] {
    return Array.from(elemento.querySelectorAll<HTMLButtonElement>('.header__acciones button'));
  }

  function escribirBusqueda(texto: string): void {
    const campo = elemento.querySelector<HTMLInputElement>('#campo-busqueda')!;
    campo.value = texto;
    campo.dispatchEvent(new Event('input'));
  }

  it('muestra la marca Red Automotriz enlazada al inicio', () => {
    const marca = elemento.querySelector<HTMLAnchorElement>('.header__marca')!;
    expect(marca.textContent?.trim()).toBe('Red Automotriz.');
    expect(marca.getAttribute('href')).toBe('/');
  });

  it('ordena los accesos como lupa, carrito y usuario', () => {
    const iconos = botonesDeAcciones().map((boton) =>
      boton.querySelector('mat-icon')?.textContent?.trim(),
    );
    expect(iconos).toEqual(['search', 'shopping_cart', 'person']);
  });

  it('muestra la cantidad del carrito en el contador y en la etiqueta accesible', async () => {
    const carrito = botonesDeAcciones()[1];
    expect(carrito.querySelector('.header__contador')?.textContent?.trim()).toBe('0');
    expect(carrito.getAttribute('aria-label')).toBe('Carrito, 0 productos');

    fixture.componentRef.setInput('cantidadCarrito', 1);
    await fixture.whenStable();

    expect(carrito.querySelector('.header__contador')?.textContent?.trim()).toBe('1');
    expect(carrito.getAttribute('aria-label')).toBe('Carrito, 1 producto');
  });

  it('no muestra una lupa propia dentro de la búsqueda', () => {
    expect(elemento.querySelector('form[role="search"] mat-icon')).toBeNull();
  });

  it('la lupa abre la búsqueda con foco en el campo y la vuelve a cerrar', async () => {
    const lupa = botonesDeAcciones()[0];
    const formulario = elemento.querySelector('form[role="search"]')!;
    expect(lupa.getAttribute('aria-expanded')).toBe('false');

    lupa.click();
    await fixture.whenStable();

    expect(formulario.classList.contains('header__busqueda--abierta')).toBe(true);
    expect(lupa.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(elemento.querySelector('#campo-busqueda'));

    lupa.click();
    await fixture.whenStable();

    expect(formulario.classList.contains('header__busqueda--abierta')).toBe(false);
    expect(lupa.getAttribute('aria-expanded')).toBe('false');
  });

  it('emite el término sin espacios al enviar y no emite si está vacío', async () => {
    const terminos: string[] = [];
    fixture.componentInstance.buscar.subscribe((termino) => terminos.push(termino));
    const formulario = elemento.querySelector<HTMLFormElement>('form[role="search"]')!;

    escribirBusqueda('   ');
    formulario.dispatchEvent(new Event('submit', { cancelable: true }));
    escribirBusqueda('  filtro de aceite ');
    formulario.dispatchEvent(new Event('submit', { cancelable: true }));
    await fixture.whenStable();

    expect(terminos).toEqual(['filtro de aceite']);
  });

  it('avisa cuando se pulsa el carrito o la cuenta', () => {
    let carrito = 0;
    let cuenta = 0;
    fixture.componentInstance.abrirCarrito.subscribe(() => carrito++);
    fixture.componentInstance.abrirCuenta.subscribe(() => cuenta++);

    const [, botonCarrito, botonCuenta] = botonesDeAcciones();
    botonCarrito.click();
    botonCuenta.click();

    expect(carrito).toBe(1);
    expect(cuenta).toBe(1);
  });
});
