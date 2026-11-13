import {
  faCcAmex,
  faCcDinersClub,
  faCcDiscover,
  faCcJcb,
  faCcMastercard,
  faCcPaypal,
  faCcVisa,
} from '@fortawesome/free-brands-svg-icons';
import { ColumnaFooter, EnlaceFooter, MetodoPago } from '../../models/footer.model';

export const COLUMNAS_FOOTER: readonly ColumnaFooter[] = [
  {
    titulo: 'Menú',
    enlaces: [
      { etiqueta: 'Inicio', ruta: '/' },
      { etiqueta: 'Productos', ruta: '/productos' },
      { etiqueta: 'Carrito', ruta: '/carrito' },
      { etiqueta: 'Pagar', ruta: '/checkout' },
    ],
  },
  {
    titulo: 'Compra',
    enlaces: [
      { etiqueta: 'Catálogo', ruta: '/productos' },
      { etiqueta: 'Mi carrito', ruta: '/carrito' },
      { etiqueta: 'Checkout', ruta: '/checkout' },
    ],
  },
  {
    titulo: 'Ayuda',
    enlaces: [
      { etiqueta: 'Métodos de pago', ruta: '/metodos-de-pago' },
      { etiqueta: 'Suscripción a ofertas', ruta: '/' },
    ],
  },
];

export const ENLACES_LEGALES: readonly EnlaceFooter[] = [
  { etiqueta: 'Métodos de pago', ruta: '/metodos-de-pago' },
];

export const METODOS_PAGO: readonly MetodoPago[] = [
  { nombre: 'Mastercard', icono: faCcMastercard },
  { nombre: 'American Express', icono: faCcAmex },
  { nombre: 'JCB', icono: faCcJcb },
  { nombre: 'Discover', icono: faCcDiscover },
  { nombre: 'Visa', icono: faCcVisa },
  { nombre: 'PayPal', icono: faCcPaypal },
  { nombre: 'Diners Club', icono: faCcDinersClub },
];
