import { MARCAS } from '../../marcas/data/marcas.data';
import { ProductoDiagrama, TipoDiagrama } from '../models/producto.model';

/** Diagramas con datos más realistas para marcas frecuentes. */
const PRODUCTOS_DETALLE: readonly ProductoDiagrama[] = [
  {
    id: 'toyota-hilux-ecu-2015',
    marcaSlug: 'toyota',
    modelo: 'Hilux',
    anioDesde: 2015,
    anioHasta: 2022,
    tipo: 'ECU',
    titulo: 'Diagrama ECU Toyota Hilux 2.8',
    precio: 180000,
  },
  {
    id: 'toyota-corolla-tablero-2019',
    marcaSlug: 'toyota',
    modelo: 'Corolla',
    anioDesde: 2019,
    anioHasta: 2024,
    tipo: 'Tablero',
    titulo: 'Diagrama tablero Toyota Corolla',
    precio: 150000,
  },
  {
    id: 'toyota-etios-inmovilizador-2017',
    marcaSlug: 'toyota',
    modelo: 'Etios',
    anioDesde: 2017,
    anioHasta: 2021,
    tipo: 'Inmovilizador',
    titulo: 'Diagrama inmovilizador Toyota Etios',
    precio: 165000,
  },
  {
    id: 'hyundai-hb20-ecu-2020',
    marcaSlug: 'hyundai',
    modelo: 'HB20',
    anioDesde: 2020,
    anioHasta: 2024,
    tipo: 'ECU',
    titulo: 'Diagrama ECU Hyundai HB20 1.6',
    precio: 175000,
  },
  {
    id: 'hyundai-tucson-airbag-2018',
    marcaSlug: 'hyundai',
    modelo: 'Tucson',
    anioDesde: 2018,
    anioHasta: 2023,
    tipo: 'Airbag',
    titulo: 'Diagrama airbag Hyundai Tucson',
    precio: 155000,
  },
  {
    id: 'kia-picanto-pinout-2019',
    marcaSlug: 'kia',
    modelo: 'Picanto',
    anioDesde: 2019,
    anioHasta: 2024,
    tipo: 'Pinout',
    titulo: 'Pinout ECU Kia Picanto 1.2',
    precio: 120000,
  },
  {
    id: 'kia-sportage-ecu-2017',
    marcaSlug: 'kia',
    modelo: 'Sportage',
    anioDesde: 2017,
    anioHasta: 2022,
    tipo: 'ECU',
    titulo: 'Diagrama ECU Kia Sportage 2.0',
    precio: 185000,
  },
  {
    id: 'chevrolet-onix-tablero-2021',
    marcaSlug: 'chevrolet',
    modelo: 'Onix',
    anioDesde: 2021,
    anioHasta: 2024,
    tipo: 'Tablero',
    titulo: 'Diagrama tablero Chevrolet Onix',
    precio: 145000,
  },
  {
    id: 'chevrolet-s10-inmovilizador-2016',
    marcaSlug: 'chevrolet',
    modelo: 'S10',
    anioDesde: 2016,
    anioHasta: 2021,
    tipo: 'Inmovilizador',
    titulo: 'Diagrama inmovilizador Chevrolet S10',
    precio: 170000,
  },
  {
    id: 'nissan-frontier-ecu-2018',
    marcaSlug: 'nissan',
    modelo: 'Frontier',
    anioDesde: 2018,
    anioHasta: 2023,
    tipo: 'ECU',
    titulo: 'Diagrama ECU Nissan Frontier 2.5',
    precio: 182000,
  },
  {
    id: 'nissan-versa-airbag-2020',
    marcaSlug: 'nissan',
    modelo: 'Versa',
    anioDesde: 2020,
    anioHasta: 2024,
    tipo: 'Airbag',
    titulo: 'Diagrama airbag Nissan Versa',
    precio: 152000,
  },
  {
    id: 'volkswagen-gol-pinout-2019',
    marcaSlug: 'volkswagen',
    modelo: 'Gol',
    anioDesde: 2019,
    anioHasta: 2022,
    tipo: 'Pinout',
    titulo: 'Pinout ECU Volkswagen Gol 1.6',
    precio: 118000,
  },
  {
    id: 'volkswagen-amarok-ecu-2017',
    marcaSlug: 'volkswagen',
    modelo: 'Amarok',
    anioDesde: 2017,
    anioHasta: 2023,
    tipo: 'ECU',
    titulo: 'Diagrama ECU Volkswagen Amarok 2.0 TDI',
    precio: 190000,
  },
  {
    id: 'ford-ranger-tablero-2019',
    marcaSlug: 'ford',
    modelo: 'Ranger',
    anioDesde: 2019,
    anioHasta: 2023,
    tipo: 'Tablero',
    titulo: 'Diagrama tablero Ford Ranger',
    precio: 158000,
  },
  {
    id: 'honda-civic-ecu-2018',
    marcaSlug: 'honda',
    modelo: 'Civic',
    anioDesde: 2018,
    anioHasta: 2022,
    tipo: 'ECU',
    titulo: 'Diagrama ECU Honda Civic 1.5 Turbo',
    precio: 188000,
  },
];

const MARCAS_CON_DETALLE = new Set(PRODUCTOS_DETALLE.map((producto) => producto.marcaSlug));

const MODELOS_DEMO = ['Compacto', 'SUV', 'Pick-up'] as const;
const TIPOS_DEMO: readonly TipoDiagrama[] = ['ECU', 'Tablero', 'Pinout'];

/** Tres diagramas demo por marca para poder probar cualquier logo del inicio. */
function productosDemoMarca(marcaSlug: string, nombreMarca: string): ProductoDiagrama[] {
  return MODELOS_DEMO.map((modelo, indice) => ({
    id: `demo-${marcaSlug}-${indice}`,
    marcaSlug,
    modelo,
    anioDesde: 2018 + indice,
    anioHasta: 2022 + indice,
    tipo: TIPOS_DEMO[indice],
    titulo: `Diagrama ${TIPOS_DEMO[indice]} ${nombreMarca} ${modelo} (demo)`,
    precio: 125000 + indice * 15000,
  }));
}

const PRODUCTOS_DEMO = MARCAS.filter((marca) => !MARCAS_CON_DETALLE.has(marca.slug)).flatMap((marca) =>
  productosDemoMarca(marca.slug, marca.nombre),
);

/**
 * Catálogo inicial del prototipo. Cuando exista backend, estos
 * diagramas se van a cargar desde ahí (ver README de marcas).
 */
export const PRODUCTOS_INICIALES: readonly ProductoDiagrama[] = [...PRODUCTOS_DETALLE, ...PRODUCTOS_DEMO];
