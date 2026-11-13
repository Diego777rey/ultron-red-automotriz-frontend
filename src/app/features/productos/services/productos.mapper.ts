import { resolveUploadsUrl } from '../../../config/api.config';
import {
  CategoriaCatalogo,
  CategoriaCatalogoGql,
  PresentacionCatalogo,
  ProductoCatalogo,
  ProductoCatalogoGql,
} from '../models/producto.model';

function aNumero(valor: number | string | null | undefined, fallback = 0): number {
  if (valor == null || valor === '') {
    return fallback;
  }
  const n = typeof valor === 'number' ? valor : Number(valor);
  return Number.isFinite(n) ? n : fallback;
}

function mapCategoria(
  raw: ProductoCatalogoGql['categoriaProducto'] | CategoriaCatalogoGql | null | undefined,
): CategoriaCatalogo | null {
  if (!raw) {
    return null;
  }
  return {
    id: aNumero(raw.id_categoria_producto),
    nombre: raw.nombre,
    padre: raw.categoriaPadre
      ? {
          id: aNumero(raw.categoriaPadre.id_categoria_producto),
          nombre: raw.categoriaPadre.nombre,
        }
      : null,
  };
}

function mapPresentacion(
  raw: NonNullable<ProductoCatalogoGql['presentaciones']>[number],
): PresentacionCatalogo {
  return {
    id: aNumero(raw.id_presentacion_producto),
    descripcion: raw.descripcion,
    codigoBarras: raw.codigoBarras ?? null,
    cantidad: aNumero(raw.cantidad, 1),
    precio: raw.precio == null || raw.precio === '' ? null : aNumero(raw.precio),
  };
}

export function mapProductoCatalogo(raw: ProductoCatalogoGql): ProductoCatalogo {
  const imagen = raw.imagen?.trim() || null;
  return {
    id: aNumero(raw.id_producto),
    codigo: raw.codigo,
    nombre: raw.nombre,
    descripcion: raw.descripcion ?? null,
    precioVenta: aNumero(raw.precioVenta),
    imagen,
    imagenUrl: resolveUploadsUrl(imagen),
    tipoIva: raw.tipoIva ?? null,
    categoria: mapCategoria(raw.categoriaProducto),
    presentaciones: (raw.presentaciones ?? []).map(mapPresentacion),
  };
}

export function mapCategoriaCatalogo(raw: CategoriaCatalogoGql): CategoriaCatalogo {
  return mapCategoria(raw)!;
}

/** Precio a mostrar: presentación elegida o precio de venta del producto. */
export function precioUnitario(
  producto: ProductoCatalogo,
  presentacionId?: number | null,
): number {
  if (presentacionId != null) {
    const presentacion = producto.presentaciones.find((p) => p.id === presentacionId);
    if (presentacion?.precio != null && presentacion.precio > 0) {
      return presentacion.precio;
    }
  }
  return producto.precioVenta;
}

export function formatearGs(monto: number): string {
  return `Gs. ${Math.round(monto).toLocaleString('es-PY')}`;
}
