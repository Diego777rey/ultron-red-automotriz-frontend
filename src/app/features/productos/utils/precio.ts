export function formatearPrecio(valor: number): string {
  return `Gs. ${valor.toLocaleString('es-PY', { maximumFractionDigits: 0 })}`;
}

export function formatearAnios(desde: number, hasta: number): string {
  return desde === hasta ? String(desde) : `${desde} – ${hasta}`;
}
