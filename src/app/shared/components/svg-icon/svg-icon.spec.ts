import { TestBed } from '@angular/core/testing';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';
import { SvgIconComponent } from './svg-icon';

describe('SvgIconComponent', () => {
  function renderizar(icono: IconDefinition): SVGSVGElement {
    const fixture = TestBed.createComponent(SvgIconComponent);
    fixture.componentRef.setInput('icono', icono);
    fixture.detectChanges();
    return (fixture.nativeElement as HTMLElement).querySelector('svg')!;
  }

  it('usa el ancho y alto del icono como viewBox y queda oculto para lectores', () => {
    const svg = renderizar({
      prefix: 'fab',
      iconName: 'facebook-f',
      icon: [320, 512, [], 'f39e', 'M0 0h10'],
    });

    expect(svg.getAttribute('viewBox')).toBe('0 0 320 512');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.querySelector('path')?.getAttribute('d')).toBe('M0 0h10');
  });

  it('une los trazos cuando el icono trae varios', () => {
    const svg = renderizar({
      prefix: 'fab',
      iconName: 'youtube',
      icon: [576, 512, [], 'f167', ['M0 0h1', 'M2 2h1']],
    });

    expect(svg.querySelector('path')?.getAttribute('d')).toBe('M0 0h1 M2 2h1');
  });
});
