import { TestBed } from '@angular/core/testing';
import { Diagrama } from '../../models/diagrama.model';
import { formatearPrecio } from '../../utils/formatear-precio';
import { DiagramaCardComponent } from './diagrama-card';

describe('DiagramaCardComponent', () => {
  it('muestra el tipo, el vehículo y el precio', async () => {
    const diagrama: Diagrama = {
      id: 'toyota-corolla-2016-ecu',
      marcaSlug: 'toyota',
      titulo: 'Diagrama de ECU Corolla 2016',
      modelo: 'Corolla',
      anio: 2016,
      tipo: 'ecu',
      precio: 180000,
      descripcion: 'Pines y referencias.',
      origen: 'prototipo',
    };

    const fixture = TestBed.createComponent(DiagramaCardComponent);
    fixture.componentRef.setInput('diagrama', diagrama);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('h2')?.textContent).toBe('Diagrama de ECU Corolla 2016');
    expect(elemento.querySelector('.diagrama-card__tipo')?.textContent?.trim()).toBe('ECU');
    expect(elemento.querySelector('.diagrama-card__vehiculo')?.textContent?.trim()).toBe(
      'Corolla · 2016',
    );
    expect(elemento.querySelector('.diagrama-card__precio')?.textContent?.trim()).toBe(
      formatearPrecio(180000),
    );
  });
});
