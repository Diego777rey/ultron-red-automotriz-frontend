export interface Marca {
  nombre: string;
  slug: string;
  /** Ruta relativa a `public/`. Si falta o no carga, la tarjeta muestra las iniciales. */
  logo?: string;
}
