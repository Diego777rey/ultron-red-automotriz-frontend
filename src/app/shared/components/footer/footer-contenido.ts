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
      { etiqueta: 'Diagramas de ECU', ruta: '/diagramas/ecu' },
      { etiqueta: 'Tableros', ruta: '/diagramas/tableros' },
      { etiqueta: 'Inmovilizadores', ruta: '/diagramas/inmovilizadores' },
      { etiqueta: 'Airbag', ruta: '/diagramas/airbag' },
      { etiqueta: 'Pinouts', ruta: '/diagramas/pinouts' },
      { etiqueta: 'Más vendidos', ruta: '/mas-vendidos' },
      { etiqueta: 'Mis pedidos', ruta: '/mis-pedidos' },
    ],
  },
  {
    titulo: 'Marcas',
    enlaces: [
      { etiqueta: 'Toyota', ruta: '/marcas/toyota' },
      { etiqueta: 'Hyundai', ruta: '/marcas/hyundai' },
      { etiqueta: 'Kia', ruta: '/marcas/kia' },
      { etiqueta: 'Chevrolet', ruta: '/marcas/chevrolet' },
      { etiqueta: 'Nissan', ruta: '/marcas/nissan' },
      { etiqueta: 'Volkswagen', ruta: '/marcas/volkswagen' },
      { etiqueta: 'Ford', ruta: '/marcas/ford' },
      { etiqueta: 'Ver todas', ruta: '/' },
    ],
  },
  {
    titulo: 'Info',
    enlaces: [
      { etiqueta: 'Preguntas frecuentes', ruta: '/preguntas-frecuentes' },
      { etiqueta: 'Acerca de', ruta: '/acerca-de' },
      { etiqueta: 'Atención al cliente', ruta: '/atencion-al-cliente' },
      { etiqueta: 'Panel del vendedor (prototipo)', ruta: '/vendedor' },
      { etiqueta: 'Sucursales', ruta: '/sucursales' },
    ],
  },
  {
    titulo: 'Mi cuenta',
    enlaces: [
      { etiqueta: 'Mi carrito', ruta: '/carrito' },
      { etiqueta: 'Mis pedidos', ruta: '/mis-pedidos' },
      { etiqueta: 'Mi perfil', ruta: '/cuenta' },
    ],
  },
];

export const ENLACES_LEGALES: readonly EnlaceFooter[] = [
  { etiqueta: 'Términos y condiciones', ruta: '/terminos-y-condiciones' },
  { etiqueta: 'Política de privacidad', ruta: '/politica-de-privacidad' },
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
