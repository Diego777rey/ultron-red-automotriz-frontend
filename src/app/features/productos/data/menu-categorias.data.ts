import { CategoriaCatalogo } from '../models/producto.model';

/**
 * Menú fijo de la tienda (familia → subcategorías).
 * No depende del backend ni de la base de datos.
 */
export const MENU_CATEGORIAS_TIENDA: readonly CategoriaCatalogo[] = [
  {
    id: 1,
    nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES',
    subcategorias: [
      { id: 101, nombre: 'ACEITES Y LUBRICANTES', padre: { id: 1, nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES' } },
      { id: 102, nombre: 'FILTROS', padre: { id: 1, nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES' } },
      { id: 103, nombre: 'MODULO ABS', padre: { id: 1, nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES' } },
      { id: 104, nombre: 'MOTOR Y DISTRIBUCION', padre: { id: 1, nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES' } },
      { id: 105, nombre: 'NEUMATICOS Y RUEDAS', padre: { id: 1, nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES' } },
      { id: 106, nombre: 'SISTEMA DE FRENOS', padre: { id: 1, nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES' } },
      {
        id: 107,
        nombre: 'SISTEMA ELECTRICO E ILUMINACION',
        padre: { id: 1, nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES' },
      },
      { id: 108, nombre: 'SUSPENSION Y DIRECCION', padre: { id: 1, nombre: 'VEHICULOS LIVIANOS / AUTOMOVILES' } },
    ],
  },
  {
    id: 2,
    nombre: 'MOTOS Y MOTOCICLETAS',
    subcategorias: [
      { id: 201, nombre: 'ACEITES Y LUBRICANTES', padre: { id: 2, nombre: 'MOTOS Y MOTOCICLETAS' } },
      { id: 202, nombre: 'FILTROS', padre: { id: 2, nombre: 'MOTOS Y MOTOCICLETAS' } },
      { id: 203, nombre: 'MOTOR Y DISTRIBUCION', padre: { id: 2, nombre: 'MOTOS Y MOTOCICLETAS' } },
      { id: 204, nombre: 'NEUMATICOS Y RUEDAS', padre: { id: 2, nombre: 'MOTOS Y MOTOCICLETAS' } },
      { id: 205, nombre: 'SISTEMA DE FRENOS', padre: { id: 2, nombre: 'MOTOS Y MOTOCICLETAS' } },
      {
        id: 206,
        nombre: 'SISTEMA ELECTRICO E ILUMINACION',
        padre: { id: 2, nombre: 'MOTOS Y MOTOCICLETAS' },
      },
    ],
  },
  {
    id: 3,
    nombre: 'CAMIONETAS Y UTILITARIOS (4X4)',
    subcategorias: [
      {
        id: 301,
        nombre: 'ACEITES Y LUBRICANTES',
        padre: { id: 3, nombre: 'CAMIONETAS Y UTILITARIOS (4X4)' },
      },
      { id: 302, nombre: 'FILTROS', padre: { id: 3, nombre: 'CAMIONETAS Y UTILITARIOS (4X4)' } },
      { id: 303, nombre: 'MOTOR Y DISTRIBUCION', padre: { id: 3, nombre: 'CAMIONETAS Y UTILITARIOS (4X4)' } },
      { id: 304, nombre: 'SISTEMA DE FRENOS', padre: { id: 3, nombre: 'CAMIONETAS Y UTILITARIOS (4X4)' } },
      {
        id: 305,
        nombre: 'SUSPENSION Y DIRECCION',
        padre: { id: 3, nombre: 'CAMIONETAS Y UTILITARIOS (4X4)' },
      },
    ],
  },
  {
    id: 4,
    nombre: 'ALARMA',
    subcategorias: [
      { id: 401, nombre: 'KITS DE ALARMA', padre: { id: 4, nombre: 'ALARMA' } },
      { id: 402, nombre: 'SENSORES', padre: { id: 4, nombre: 'ALARMA' } },
      { id: 403, nombre: 'CONTROLES', padre: { id: 4, nombre: 'ALARMA' } },
    ],
  },
  {
    id: 5,
    nombre: 'ECU',
    subcategorias: [
      { id: 501, nombre: 'ECU MOTOR', padre: { id: 5, nombre: 'ECU' } },
      { id: 502, nombre: 'BODY COMPUTER', padre: { id: 5, nombre: 'ECU' } },
      { id: 503, nombre: 'CABLEADOS', padre: { id: 5, nombre: 'ECU' } },
    ],
  },
  {
    id: 6,
    nombre: 'REPARACION DE ECU',
    subcategorias: [
      { id: 601, nombre: 'DIAGNOSTICO', padre: { id: 6, nombre: 'REPARACION DE ECU' } },
      { id: 602, nombre: 'REPROGRAMACION', padre: { id: 6, nombre: 'REPARACION DE ECU' } },
    ],
  },
];

/** Busca una categoría del menú fijo por id (familia o subcategoría). */
export function buscarCategoriaMenu(id: number | null | undefined): CategoriaCatalogo | null {
  if (id == null) {
    return null;
  }
  for (const familia of MENU_CATEGORIAS_TIENDA) {
    if (familia.id === id) {
      return familia;
    }
    const sub = familia.subcategorias?.find((item) => item.id === id);
    if (sub) {
      return sub;
    }
  }
  return null;
}
