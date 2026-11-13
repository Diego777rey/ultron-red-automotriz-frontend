import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MarcaDetalleComponent } from './marca-detalle';

describe('MarcaDetalleComponent', () => {
  let fixture: ComponentFixture<MarcaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcaDetalleComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MarcaDetalleComponent);
    fixture.detectChanges();
  });

  it('redirige al catálogo de productos', () => {
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Catálogo actualizado');
  });
});
