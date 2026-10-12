import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  template: `
    <h1>Red Automotriz</h1>
    <p>Repuestos y servicios para tu vehículo.</p>
  `,
  styles: `
    h1 {
      margin: 0 0 8px;
      font-size: 2rem;
      font-weight: 600;
    }

    p {
      margin: 0;
      color: var(--text-secondary);
    }
  `,
})
export class InicioComponent {}
