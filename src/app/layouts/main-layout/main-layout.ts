import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../shared/components/footer/footer';
import { HeaderComponent } from '../../shared/components/header/header';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <button type="button" class="main-layout__saltar" (click)="contenido.focus()">
      Saltar al contenido
    </button>
    <app-header />
    <main #contenido class="main-layout__contenido" tabindex="-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
  styleUrl: './main-layout.scss',
  host: {
    class: 'app-main-layout',
  },
})
export class MainLayoutComponent {}
