import { Diagrama, TipoDiagrama, etiquetaTipo } from '../models/diagrama.model';

type Semilla = readonly [modelo: string, anio: number, tipo: TipoDiagrama, precio: number];

/**
 * Prototipos de diagramas por marca. El mismo modelo en varios años permite
 * filtrar hasta un artículo. Cuando haya backend, esta lista sale de ahí.
 */
const SEMILLAS: Record<string, readonly Semilla[]> = {
  'alfa-romeo': [
    ['Giulia', 2018, 'ecu', 240000],
    ['Giulia', 2021, 'tablero', 210000],
    ['Stelvio', 2020, 'airbag', 260000],
  ],
  audi: [
    ['A3', 2016, 'ecu', 220000],
    ['A3', 2020, 'tablero', 190000],
    ['A4', 2018, 'inmovilizador', 250000],
    ['Q5', 2022, 'pinout', 180000],
  ],
  bmw: [
    ['Serie 3', 2017, 'ecu', 280000],
    ['Serie 3', 2021, 'tablero', 240000],
    ['X1', 2019, 'airbag', 230000],
    ['X5', 2020, 'pinout', 270000],
  ],
  byd: [
    ['Dolphin', 2023, 'ecu', 200000],
    ['Dolphin', 2025, 'pinout', 170000],
    ['Yuan Plus', 2024, 'tablero', 190000],
  ],
  cadillac: [
    ['Escalade', 2018, 'ecu', 300000],
    ['Escalade', 2022, 'airbag', 280000],
    ['CTS', 2016, 'tablero', 240000],
  ],
  changan: [
    ['CS35', 2019, 'ecu', 150000],
    ['CS35', 2022, 'tablero', 140000],
    ['Alsvin', 2021, 'inmovilizador', 160000],
  ],
  chery: [
    ['Tiggo 2', 2018, 'ecu', 140000],
    ['Tiggo 2', 2021, 'airbag', 150000],
    ['Tiggo 7', 2023, 'pinout', 170000],
  ],
  chevrolet: [
    ['Onix', 2017, 'ecu', 160000],
    ['Onix', 2020, 'tablero', 150000],
    ['Onix', 2024, 'inmovilizador', 180000],
    ['Cruze', 2018, 'airbag', 190000],
    ['S10', 2019, 'pinout', 200000],
  ],
  chrysler: [
    ['300C', 2015, 'ecu', 210000],
    ['300C', 2019, 'tablero', 190000],
    ['Pacifica', 2021, 'airbag', 230000],
  ],
  citroen: [
    ['C3', 2017, 'ecu', 150000],
    ['C3', 2022, 'tablero', 160000],
    ['C4', 2019, 'pinout', 170000],
  ],
  daewoo: [
    ['Lanos', 2002, 'ecu', 90000],
    ['Lanos', 2006, 'tablero', 80000],
    ['Matiz', 2008, 'pinout', 85000],
  ],
  daihatsu: [
    ['Terios', 2008, 'ecu', 120000],
    ['Terios', 2014, 'tablero', 110000],
    ['Charade', 2005, 'inmovilizador', 100000],
  ],
  dodge: [
    ['Journey', 2014, 'ecu', 180000],
    ['Journey', 2018, 'airbag', 190000],
    ['Durango', 2020, 'pinout', 220000],
  ],
  dongfeng: [
    ['AX7', 2018, 'ecu', 140000],
    ['AX7', 2021, 'tablero', 150000],
    ['Rich', 2019, 'pinout', 160000],
  ],
  fiat: [
    ['Cronos', 2019, 'ecu', 150000],
    ['Cronos', 2023, 'tablero', 160000],
    ['Toro', 2020, 'inmovilizador', 190000],
    ['Argo', 2021, 'airbag', 155000],
  ],
  ford: [
    ['Ranger', 2016, 'ecu', 210000],
    ['Ranger', 2020, 'inmovilizador', 240000],
    ['Ranger', 2024, 'airbag', 230000],
    ['Focus', 2015, 'tablero', 160000],
    ['Ka', 2018, 'pinout', 130000],
  ],
  foton: [
    ['Tunland', 2018, 'ecu', 170000],
    ['Tunland', 2022, 'pinout', 160000],
    ['Aumark', 2019, 'tablero', 180000],
  ],
  freightliner: [
    ['Cascadia', 2016, 'ecu', 320000],
    ['Cascadia', 2021, 'pinout', 280000],
    ['M2', 2018, 'tablero', 260000],
  ],
  geely: [
    ['Coolray', 2021, 'ecu', 170000],
    ['Coolray', 2024, 'tablero', 180000],
    ['Emgrand', 2020, 'airbag', 160000],
  ],
  gmc: [
    ['Sierra', 2017, 'ecu', 250000],
    ['Sierra', 2022, 'airbag', 270000],
    ['Terrain', 2019, 'tablero', 210000],
  ],
  'great-wall': [
    ['Wingle', 2016, 'ecu', 150000],
    ['Wingle', 2020, 'pinout', 160000],
    ['Poer', 2022, 'inmovilizador', 190000],
  ],
  haval: [
    ['H6', 2019, 'ecu', 180000],
    ['H6', 2023, 'tablero', 190000],
    ['Jolion', 2022, 'airbag', 175000],
  ],
  hino: [
    ['Dutro', 2015, 'ecu', 200000],
    ['Dutro', 2020, 'pinout', 190000],
    ['300', 2018, 'tablero', 210000],
  ],
  honda: [
    ['Civic', 2016, 'ecu', 190000],
    ['Civic', 2020, 'tablero', 180000],
    ['Civic', 2023, 'inmovilizador', 210000],
    ['CR-V', 2018, 'airbag', 200000],
    ['Fit', 2015, 'pinout', 140000],
  ],
  hyundai: [
    ['Tucson', 2016, 'ecu', 190000],
    ['Tucson', 2020, 'tablero', 185000],
    ['Tucson', 2024, 'airbag', 220000],
    ['Accent', 2018, 'inmovilizador', 160000],
    ['Creta', 2021, 'pinout', 175000],
  ],
  international: [
    ['4300', 2014, 'ecu', 280000],
    ['4300', 2019, 'pinout', 250000],
    ['LT', 2021, 'tablero', 300000],
  ],
  isuzu: [
    ['D-Max', 2016, 'ecu', 190000],
    ['D-Max', 2021, 'inmovilizador', 210000],
    ['NPR', 2018, 'pinout', 200000],
  ],
  iveco: [
    ['Daily', 2016, 'ecu', 230000],
    ['Daily', 2021, 'tablero', 220000],
    ['Tector', 2018, 'pinout', 240000],
  ],
  jac: [
    ['S2', 2018, 'ecu', 140000],
    ['S2', 2021, 'tablero', 145000],
    ['T8', 2022, 'airbag', 180000],
  ],
  jaguar: [
    ['XF', 2016, 'ecu', 290000],
    ['XF', 2020, 'tablero', 270000],
    ['F-Pace', 2019, 'airbag', 310000],
  ],
  jeep: [
    ['Renegade', 2017, 'ecu', 190000],
    ['Renegade', 2021, 'inmovilizador', 210000],
    ['Compass', 2020, 'tablero', 200000],
    ['Wrangler', 2018, 'pinout', 230000],
  ],
  jetour: [
    ['X70', 2022, 'ecu', 180000],
    ['X70', 2025, 'tablero', 190000],
    ['Dashing', 2024, 'pinout', 185000],
  ],
  jmc: [
    ['Grand Avenue', 2018, 'ecu', 170000],
    ['Grand Avenue', 2022, 'pinout', 175000],
    ['Vigus', 2019, 'tablero', 160000],
  ],
  kenworth: [
    ['T680', 2016, 'ecu', 340000],
    ['T680', 2021, 'pinout', 310000],
    ['T800', 2014, 'tablero', 300000],
  ],
  kia: [
    ['Sportage', 2016, 'ecu', 185000],
    ['Sportage', 2020, 'tablero', 190000],
    ['Sportage', 2024, 'airbag', 215000],
    ['Rio', 2018, 'inmovilizador', 150000],
    ['Cerato', 2019, 'pinout', 165000],
  ],
  'land-rover': [
    ['Discovery', 2017, 'ecu', 320000],
    ['Discovery', 2021, 'airbag', 340000],
    ['Evoque', 2019, 'tablero', 300000],
  ],
  lexus: [
    ['RX', 2017, 'ecu', 280000],
    ['RX', 2022, 'tablero', 270000],
    ['ES', 2019, 'inmovilizador', 260000],
  ],
  lifan: [
    ['320', 2012, 'ecu', 90000],
    ['320', 2016, 'tablero', 85000],
    ['X60', 2015, 'pinout', 100000],
  ],
  mack: [
    ['Granite', 2015, 'ecu', 300000],
    ['Granite', 2020, 'pinout', 280000],
    ['Anthem', 2019, 'tablero', 310000],
  ],
  mahindra: [
    ['Scorpio', 2017, 'ecu', 160000],
    ['Scorpio', 2022, 'airbag', 180000],
    ['Pik Up', 2019, 'pinout', 170000],
  ],
  man: [
    ['TGX', 2016, 'ecu', 330000],
    ['TGX', 2021, 'pinout', 300000],
    ['TGS', 2018, 'tablero', 290000],
  ],
  mazda: [
    ['3', 2016, 'ecu', 180000],
    ['3', 2021, 'tablero', 175000],
    ['CX-5', 2019, 'airbag', 200000],
    ['BT-50', 2020, 'pinout', 185000],
  ],
  'mercedes-benz': [
    ['Sprinter', 2016, 'ecu', 260000],
    ['Sprinter', 2020, 'inmovilizador', 280000],
    ['Sprinter', 2024, 'airbag', 270000],
    ['Clase C', 2018, 'tablero', 290000],
    ['Actros', 2017, 'pinout', 340000],
  ],
  mg: [
    ['MG3', 2018, 'ecu', 150000],
    ['MG3', 2023, 'tablero', 155000],
    ['ZS', 2021, 'airbag', 170000],
  ],
  mini: [
    ['Cooper', 2016, 'ecu', 220000],
    ['Cooper', 2021, 'tablero', 210000],
    ['Countryman', 2019, 'pinout', 230000],
  ],
  mitsubishi: [
    ['L200', 2016, 'ecu', 190000],
    ['L200', 2020, 'inmovilizador', 210000],
    ['L200', 2024, 'airbag', 220000],
    ['ASX', 2018, 'tablero', 170000],
    ['Outlander', 2019, 'pinout', 185000],
  ],
  nissan: [
    ['Frontier', 2016, 'ecu', 195000],
    ['Frontier', 2020, 'inmovilizador', 220000],
    ['Frontier', 2023, 'airbag', 215000],
    ['Versa', 2018, 'tablero', 150000],
    ['Sentra', 2019, 'pinout', 165000],
  ],
  opel: [
    ['Corsa', 2016, 'ecu', 150000],
    ['Corsa', 2021, 'tablero', 160000],
    ['Astra', 2018, 'pinout', 155000],
  ],
  peugeot: [
    ['208', 2017, 'ecu', 160000],
    ['208', 2022, 'tablero', 170000],
    ['308', 2019, 'inmovilizador', 185000],
    ['Partner', 2018, 'pinout', 165000],
  ],
  porsche: [
    ['Cayenne', 2016, 'ecu', 420000],
    ['Cayenne', 2021, 'airbag', 450000],
    ['Macan', 2019, 'tablero', 400000],
  ],
  ram: [
    ['1500', 2017, 'ecu', 260000],
    ['1500', 2022, 'airbag', 280000],
    ['2500', 2019, 'pinout', 270000],
  ],
  renault: [
    ['Duster', 2016, 'ecu', 160000],
    ['Duster', 2021, 'tablero', 170000],
    ['Logan', 2018, 'inmovilizador', 140000],
    ['Kangoo', 2019, 'pinout', 150000],
  ],
  scania: [
    ['R450', 2016, 'ecu', 360000],
    ['R450', 2021, 'pinout', 340000],
    ['P360', 2018, 'tablero', 320000],
  ],
  seat: [
    ['Ibiza', 2016, 'ecu', 160000],
    ['Ibiza', 2021, 'tablero', 165000],
    ['Leon', 2018, 'airbag', 180000],
  ],
  skoda: [
    ['Octavia', 2017, 'ecu', 175000],
    ['Octavia', 2022, 'tablero', 185000],
    ['Fabia', 2019, 'pinout', 155000],
  ],
  ssangyong: [
    ['Actyon', 2014, 'ecu', 160000],
    ['Actyon', 2018, 'tablero', 150000],
    ['Rexton', 2020, 'airbag', 190000],
  ],
  subaru: [
    ['Forester', 2016, 'ecu', 200000],
    ['Forester', 2021, 'airbag', 220000],
    ['Impreza', 2018, 'tablero', 185000],
  ],
  suzuki: [
    ['Swift', 2016, 'ecu', 140000],
    ['Swift', 2021, 'tablero', 150000],
    ['Vitara', 2019, 'inmovilizador', 170000],
    ['Jimny', 2022, 'pinout', 180000],
  ],
  tesla: [
    ['Model 3', 2019, 'ecu', 320000],
    ['Model 3', 2023, 'pinout', 300000],
    ['Model Y', 2022, 'tablero', 310000],
  ],
  toyota: [
    ['Corolla', 2016, 'ecu', 180000],
    ['Corolla', 2018, 'tablero', 150000],
    ['Corolla', 2022, 'inmovilizador', 210000],
    ['Hilux', 2016, 'airbag', 190000],
    ['Hilux', 2020, 'ecu', 230000],
    ['Hilux', 2024, 'pinout', 140000],
    ['RAV4', 2019, 'tablero', 160000],
    ['Yaris', 2021, 'ecu', 170000],
  ],
  volkswagen: [
    ['Gol', 2016, 'ecu', 140000],
    ['Gol', 2020, 'tablero', 135000],
    ['Amarok', 2017, 'inmovilizador', 220000],
    ['Amarok', 2022, 'airbag', 240000],
    ['Polo', 2019, 'pinout', 155000],
  ],
  volvo: [
    ['FH', 2016, 'ecu', 350000],
    ['FH', 2021, 'pinout', 330000],
    ['XC60', 2018, 'tablero', 280000],
    ['S60', 2019, 'airbag', 270000],
  ],
};

function idPrototipo(slug: string, modelo: string, anio: number, tipo: TipoDiagrama): string {
  const modeloSlug = modelo
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${slug}-${modeloSlug}-${anio}-${tipo}`;
}

export const DIAGRAMAS_PROTOTIPO: readonly Diagrama[] = Object.entries(SEMILLAS).flatMap(
  ([marcaSlug, semillas]) =>
    semillas.map(([modelo, anio, tipo, precio]) => {
      const etiqueta = etiquetaTipo(tipo);
      return {
        id: idPrototipo(marcaSlug, modelo, anio, tipo),
        marcaSlug,
        modelo,
        anio,
        tipo,
        precio,
        titulo: `Diagrama de ${etiqueta} ${modelo} ${anio}`,
        descripcion: `Prototipo del diagrama de ${etiqueta} para ${modelo} ${anio}, con pines y referencias de conexión.`,
        origen: 'prototipo' as const,
      };
    }),
);
