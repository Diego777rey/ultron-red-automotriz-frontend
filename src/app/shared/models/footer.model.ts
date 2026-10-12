import { IconDefinition } from '@fortawesome/free-brands-svg-icons';

export interface EnlaceFooter {
  etiqueta: string;
  ruta: string;
}

export interface ColumnaFooter {
  titulo: string;
  enlaces: readonly EnlaceFooter[];
}

export interface RedSocial {
  nombre: string;
  url: string;
  icono: IconDefinition;
}

export interface MetodoPago {
  nombre: string;
  icono: IconDefinition;
}
