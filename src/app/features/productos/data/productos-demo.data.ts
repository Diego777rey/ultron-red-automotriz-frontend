import { MARCAS } from '../../marcas/data/marcas.data';
import { CategoriaProducto, Producto } from '../models/producto.model';

interface PlantillaProducto {
  nombre: string;
  modelo: string;
  anio: number;
  categoria: CategoriaProducto;
  descripcion: string;
  precio: number;
}

const PLANTILLAS: readonly PlantillaProducto[] = [
  {
    nombre: 'Diagrama de computadora ECU',
    modelo: 'Línea 2018–2021',
    anio: 2020,
    categoria: 'ECU',
    descripcion: 'Cableado, alimentación, tierras y conectores de la unidad de motor.',
    precio: 12_500,
  },
  {
    nombre: 'Pinout de tablero e instrumentos',
    modelo: 'Línea 2020–2023',
    anio: 2022,
    categoria: 'Tablero',
    descripcion: 'Asignación de pines y señales del cuadro de instrumentos.',
    precio: 9_800,
  },
  {
    nombre: 'Diagrama de inmovilizador y llaves',
    modelo: 'Línea 2022–2025',
    anio: 2024,
    categoria: 'Inmovilizador',
    descripcion: 'Conexiones del inmovilizador, antena, BCM y comunicación con ECU.',
    precio: 14_900,
  },
];

export const PRODUCTOS_DEMO: readonly Producto[] = MARCAS.flatMap((marca) =>
  PLANTILLAS.map((plantilla, indice) => ({
    ...plantilla,
    id: `demo-${marca.slug}-${indice + 1}`,
    marcaSlug: marca.slug,
  })),
);
