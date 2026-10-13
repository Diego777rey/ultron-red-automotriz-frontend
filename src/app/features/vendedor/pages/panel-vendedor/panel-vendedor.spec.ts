import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductosService } from '../../../productos/services/productos.service';
import { PanelVendedorComponent } from './panel-vendedor';

describe('PanelVendedorComponent', () => {
  let fixture: ComponentFixture<PanelVendedorComponent>;
  let elemento: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(PanelVendedorComponent);
    elemento = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('muestra el formulario de carga y los diagramas cargados', () => {
    expect(elemento.querySelector('h1')?.textContent).toContain('Panel del vendedor');
    expect(elemento.querySelector('form')).not.toBeNull();
  });

  it('guarda el diagrama y confirma que ya está visible en la tienda', async () => {
    const componente = fixture.componentInstance;
    componente['formulario'].patchValue({
      marcaSlug: 'fiat',
      modelo: 'Cronos',
      anioDesde: 2022,
      anioHasta: 2024,
      tipo: 'ECU',
      titulo: 'Diagrama ECU Fiat Cronos',
      precio: 160000,
    });
    await fixture.whenStable();

    elemento.querySelector<HTMLFormElement>('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();

    const servicio = TestBed.inject(ProductosService);
    expect(servicio.porMarca('fiat').map((producto) => producto.modelo)).toContain('Cronos');
    expect(elemento.textContent).toContain('ya está visible en la tienda');
  });

  it('rechaza un rango de años invertido', async () => {
    const componente = fixture.componentInstance;
    componente['formulario'].patchValue({ anioDesde: 2024, anioHasta: 2020 });
    await fixture.whenStable();

    expect(componente['formulario'].invalid).toBe(true);
    expect(elemento.textContent).toContain('no puede ser anterior');
  });
});
