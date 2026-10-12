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
      { etiqueta: 'Ofertas', ruta: '/ofertas' },
      { etiqueta: 'Repuestos', ruta: '/repuestos' },
      { etiqueta: 'Accesorios', ruta: '/accesorios' },
      { etiqueta: 'Lubricantes', ruta: '/lubricantes' },
      { etiqueta: 'Neumáticos', ruta: '/neumaticos' },
      { etiqueta: 'Más vendidos', ruta: '/mas-vendidos' },
      { etiqueta: 'Mis pedidos', ruta: '/mis-pedidos' },
    ],
  },
  {
    titulo: 'Categorías',
    enlaces: [
      { etiqueta: 'Motor', ruta: '/categorias/motor' },
      { etiqueta: 'Frenos', ruta: '/categorias/frenos' },
      { etiqueta: 'Suspensión', ruta: '/categorias/suspension' },
      { etiqueta: 'Sistema eléctrico', ruta: '/categorias/sistema-electrico' },
      { etiqueta: 'Filtros', ruta: '/categorias/filtros' },
      { etiqueta: 'Iluminación', ruta: '/categorias/iluminacion' },
      { etiqueta: 'Carrocería', ruta: '/categorias/carroceria' },
      { etiqueta: 'Herramientas', ruta: '/categorias/herramientas' },
    ],
  },
  {
    titulo: 'Info',
    enlaces: [
      { etiqueta: 'Preguntas frecuentes', ruta: '/preguntas-frecuentes' },
      { etiqueta: 'Acerca de', ruta: '/acerca-de' },
      { etiqueta: 'Atención al cliente', ruta: '/atencion-al-cliente' },
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
