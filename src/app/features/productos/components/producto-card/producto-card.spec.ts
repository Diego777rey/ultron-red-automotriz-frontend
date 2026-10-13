import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Producto } from '../../models/producto.model';
import { ProductoCardComponent } from './producto-card';

describe('ProductoCardComponent', () => {
  let fixture: ComponentFixture<ProductoCardComponent>;
  let elemento: HTMLElement;

  const hilux: Producto = {
    id: 'toyota-hilux-ecu-2016',
    marcaSlug: 'toyota',
    modelo: 'Hilux',
    anioDesde: 2016,
    anioHasta: 2023,
    tipo: 'ecu',
    titulo: 'Diagrama ECU Toyota Hilux',
    precio: 150000,
    descripcion: 'Pinout y esquema de la ECU para Hilux 2016-2023.',
  };

  beforeEach(async () => {
    fixture = TestBed.createComponent(ProductoCardComponent);
    fixture.componentRef.setInput('producto', hilux);
    elemento = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('muestra tipo, título, modelo, años y precio', () => {
    expect(elemento.querySelector('.producto-card__tipo')?.textContent?.trim()).toBe('ECU');
    expect(elemento.querySelector('h2')?.textContent?.trim()).toBe('Diagrama ECU Toyota Hilux');
    expect(elemento.querySelector('.producto-card__detalle')?.textContent?.trim()).toBe(
      'Hilux · 2016 – 2023',
    );
    expect(elemento.querySelector('.producto-card__precio')?.textContent).toContain('150');
    expect(elemento.querySelector('.producto-card__descripcion')?.textContent).toContain('Pinout');
  });
});
