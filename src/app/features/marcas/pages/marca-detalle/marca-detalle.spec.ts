import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MarcaDetalleComponent } from './marca-detalle';

describe('MarcaDetalleComponent', () => {
  let fixture: ComponentFixture<MarcaDetalleComponent>;
  let elemento: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(MarcaDetalleComponent);
    fixture.componentRef.setInput('slug', 'toyota');
    elemento = fixture.nativeElement as HTMLElement;
  });

  it('muestra el nombre de la marca y sus diagramas con precio', async () => {
    await fixture.whenStable();

    expect(elemento.querySelector('h1')?.textContent).toContain('Toyota');
    const tarjetas = elemento.querySelectorAll('app-producto-card');
    expect(tarjetas.length).toBe(3);
    expect(elemento.textContent).toContain('Gs.');
  });

  it('filtra por modelo y año hasta dar con el artículo exacto', async () => {
    await fixture.whenStable();
    const componente = fixture.componentInstance;

    componente['modelo'].set('Hilux');
    componente['anio'].set(2020);
    await fixture.whenStable();

    expect(elemento.textContent).toContain('1 diagrama disponible');
    expect(elemento.textContent).toContain('Hilux');
    expect(elemento.textContent).not.toContain('Corolla');
  });

  it('avisa cuando la marca no existe', async () => {
    fixture.componentRef.setInput('slug', 'marca-inexistente');
    await fixture.whenStable();

    expect(elemento.querySelector('h1')?.textContent).toContain('Marca no encontrada');
  });
});
