import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PanelVendedorComponent } from './panel-vendedor';

describe('PanelVendedorComponent', () => {
  let fixture: ComponentFixture<PanelVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelVendedorComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PanelVendedorComponent);
    fixture.detectChanges();
  });

  it('indica que los productos se administran en gestión de activos', () => {
    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Gestión de Activos');
  });
});
