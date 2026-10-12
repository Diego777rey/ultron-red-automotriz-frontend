import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MARCAS } from '../../data/marcas.data';
import { MarcasGridComponent } from './marcas-grid';

describe('MarcasGridComponent', () => {
  it('muestra una tarjeta por marca y prioriza solo los logos de la primera fila', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(MarcasGridComponent);
    fixture.componentRef.setInput('marcas', MARCAS);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelectorAll('li app-marca-card')).toHaveLength(MARCAS.length);
    expect(elemento.querySelectorAll('img[fetchpriority="high"]')).toHaveLength(4);
  });
});
