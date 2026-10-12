import { Marca } from '../models/marca.model';

function marca(nombre: string, slug: string): Marca {
  return { nombre, slug, logo: `marcas/${slug}.webp` };
}

export const MARCAS: readonly Marca[] = [
  marca('Audi', 'audi'),
  marca('BMW', 'bmw'),
  marca('BYD', 'byd'),
  marca('Chery', 'chery'),
  marca('Chevrolet', 'chevrolet'),
  marca('Citroën', 'citroen'),
  marca('Fiat', 'fiat'),
  marca('Ford', 'ford'),
  marca('Great Wall', 'great-wall'),
  marca('Honda', 'honda'),
  marca('Hyundai', 'hyundai'),
  marca('Isuzu', 'isuzu'),
  marca('JAC', 'jac'),
  marca('Jeep', 'jeep'),
  marca('Kia', 'kia'),
  marca('Mazda', 'mazda'),
  marca('Mercedes-Benz', 'mercedes-benz'),
  marca('Mitsubishi', 'mitsubishi'),
  marca('Nissan', 'nissan'),
  marca('Peugeot', 'peugeot'),
  marca('Renault', 'renault'),
  marca('Suzuki', 'suzuki'),
  marca('Toyota', 'toyota'),
  marca('Volkswagen', 'volkswagen'),
];
