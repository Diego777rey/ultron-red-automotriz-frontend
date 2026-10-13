const PRECIO = new Intl.NumberFormat('es-PY', {
  style: 'currency',
  currency: 'PYG',
  maximumFractionDigits: 0,
});

export function formatearPrecio(precio: number): string {
  return PRECIO.format(precio);
}
