import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Marca } from '../../models/marca.model';
import { MarcaCardComponent } from './marca-card';

describe('MarcaCardComponent', () => {
  let fixture: ComponentFixture<MarcaCardComponent>;
  let elemento: HTMLElement;

  async function renderizar(marca: Marca): Promise<void> {
    fixture.componentRef.setInput('marca', marca);
    await fixture.whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(MarcaCardComponent);
    elemento = fixture.nativeElement as HTMLElement;
  });

  it('enlaza a la página de la marca y usa el nombre como texto del enlace', async () => {
    await renderizar({ nombre: 'Toyota', slug: 'toyota', logo: 'marcas/toyota.webp' });

    const enlace = elemento.querySelector('a')!;
    expect(enlace.getAttribute('href')).toBe('/marcas/toyota');
    expect(enlace.textContent?.trim()).toBe('Toyota');
  });

  it('muestra el logo como imagen decorativa', async () => {
    await renderizar({ nombre: 'Toyota', slug: 'toyota', logo: 'marcas/toyota.webp' });

    const logo = elemento.querySelector('img')!;
    expect(logo.getAttribute('src')).toContain('marcas/toyota.webp');
    expect(logo.getAttribute('alt')).toBe('');
  });

  it('muestra las iniciales si la marca no tiene logo', async () => {
    await renderizar({ nombre: 'Great Wall', slug: 'great-wall' });

    expect(elemento.querySelector('img')).toBeNull();
    expect(elemento.querySelector('.marca-card__iniciales')?.textContent?.trim()).toBe('GW');
  });

  it('cambia a las iniciales si el logo no carga', async () => {
    await renderizar({ nombre: 'Mercedes-Benz', slug: 'mercedes-benz', logo: 'marcas/x.webp' });

    elemento.querySelector('img')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();

    expect(elemento.querySelector('img')).toBeNull();
    expect(elemento.querySelector('.marca-card__iniciales')?.textContent?.trim()).toBe('MB');
  });
});
