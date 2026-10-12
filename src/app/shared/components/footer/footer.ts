import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITIO } from '../../../config/sitio.config';
import { SvgIconComponent } from '../svg-icon/svg-icon';
import { COLUMNAS_FOOTER, ENLACES_LEGALES, METODOS_PAGO } from './footer-contenido';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, SvgIconComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  host: {
    class: 'app-footer',
  },
})
export class FooterComponent {
  protected readonly sitio = SITIO;
  protected readonly columnas = COLUMNAS_FOOTER;
  protected readonly enlacesLegales = ENLACES_LEGALES;
  protected readonly metodosPago = METODOS_PAGO;
  protected readonly anio = new Date().getFullYear();
}
