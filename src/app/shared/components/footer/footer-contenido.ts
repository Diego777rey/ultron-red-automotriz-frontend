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
      { etiqueta: 'Productos', ruta: '/productos' },
      { etiqueta: 'Categorías', ruta: '/' },
      { etiqueta: 'Carrito', ruta: '/carrito' },
      { etiqueta: 'Cuenta', ruta: '/cuenta' },
      { etiqueta: 'Métodos de pago', ruta: '/metodos-de-pago' },
    ],
  },
  {
    titulo: 'Compra',
    enlaces: [
      { etiqueta: 'Catálogo', ruta: '/productos' },
      { etiqueta: 'Mi carrito', ruta: '/carrito' },
      { etiqueta: 'Checkout', ruta: '/checkout' },
      { etiqueta: 'Crear cuenta', ruta: '/cuenta/registro' },
    ],
  },
  {
    titulo: 'Ayuda',
    enlaces: [
      { etiqueta: 'Métodos de pago', ruta: '/metodos-de-pago' },
      { etiqueta: 'Iniciar sesión', ruta: '/cuenta/iniciar-sesion' },
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
