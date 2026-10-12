import { Component, computed, input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-brands-svg-icons';

/**
 * Logos de marcas (redes sociales, tarjetas) que Material Icons no trae.
 * Es decorativo: el nombre accesible lo pone quien lo usa.
 */
@Component({
  selector: 'app-svg-icon',
  template: `
    <svg [attr.viewBox]="viewBox()" aria-hidden="true" focusable="false">
      <path [attr.d]="trazo()" fill="currentColor" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: 1em;
      height: 1em;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  `,
})
export class SvgIconComponent {
  readonly icono = input.required<IconDefinition>();

  protected readonly viewBox = computed(() => {
    const [ancho, alto] = this.icono().icon;
    return `0 0 ${ancho} ${alto}`;
  });

  protected readonly trazo = computed(() => {
    const trazo = this.icono().icon[4];
    return Array.isArray(trazo) ? trazo.join(' ') : trazo;
  });
}
