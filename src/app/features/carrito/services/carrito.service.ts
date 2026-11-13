import { computed, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { AlmacenLocalService } from '../../../core/almacen/almacen-local.service';
import { PresentacionCatalogo, ProductoCatalogo } from '../../productos/models/producto.model';
import { precioUnitario } from '../../productos/services/productos.mapper';
import { LineaCarrito, claveLineaCarrito } from '../models/linea-carrito.model';

const CLAVE_CARRITO = 'ra-carrito-v1';

@Service()
export class CarritoService {
  private readonly almacen = inject(AlmacenLocalService);
  private readonly lineas = signal<readonly LineaCarrito[]>(this.cargar());
  private readonly panel = signal(false);

  readonly items = this.lineas.asReadonly();
  readonly panelAbierto = this.panel.asReadonly();
  readonly cantidadTotal = computed(() =>
    this.lineas().reduce((total, linea) => total + linea.cantidad, 0),
  );
  readonly subtotal = computed(() =>
    this.lineas().reduce((total, linea) => total + linea.cantidad * linea.precio, 0),
  );
  readonly vacio = computed(() => this.lineas().length === 0);

  abrirPanel(): void {
    this.panel.set(true);
  }

  cerrarPanel(): void {
    this.panel.set(false);
  }

  agregar(
    producto: ProductoCatalogo,
    opciones?: {
      presentacion?: PresentacionCatalogo | null;
      cantidad?: number;
      abrirPanel?: boolean;
    },
  ): void {
    const presentacion = opciones?.presentacion ?? null;
    const cantidad = Math.max(1, opciones?.cantidad ?? 1);
    const presentacionId = presentacion?.id ?? null;
    const precio = precioUnitario(producto, presentacionId);
    const clave = claveLineaCarrito(producto.id, presentacionId);
    const actuales = this.lineas();
    const indice = actuales.findIndex(
      (linea) => claveLineaCarrito(linea.productoId, linea.presentacionId) === clave,
    );

    let siguientes: LineaCarrito[];
    if (indice >= 0) {
      siguientes = actuales.map((linea, i) =>
        i === indice ? { ...linea, cantidad: linea.cantidad + cantidad } : linea,
      );
    } else {
      siguientes = [
        ...actuales,
        {
          productoId: producto.id,
          presentacionId,
          cantidad,
          nombre: producto.nombre,
          precio,
          imagenUrl: producto.imagenUrl,
          presentacionDescripcion: presentacion?.descripcion ?? null,
        },
      ];
    }
    this.persistir(siguientes);
    if (opciones?.abrirPanel !== false) {
      this.abrirPanel();
    }
  }

  quitar(productoId: number, presentacionId?: number | null): void {
    const clave = claveLineaCarrito(productoId, presentacionId);
    this.persistir(
      this.lineas().filter(
        (linea) => claveLineaCarrito(linea.productoId, linea.presentacionId) !== clave,
      ),
    );
  }

  actualizarCantidad(productoId: number, presentacionId: number | null | undefined, cantidad: number): void {
    if (cantidad < 1) {
      this.quitar(productoId, presentacionId);
      return;
    }
    const clave = claveLineaCarrito(productoId, presentacionId);
    this.persistir(
      this.lineas().map((linea) =>
        claveLineaCarrito(linea.productoId, linea.presentacionId) === clave
          ? { ...linea, cantidad }
          : linea,
      ),
    );
  }

  vaciar(): void {
    this.persistir([]);
  }

  private persistir(lineas: readonly LineaCarrito[]): void {
    this.lineas.set(lineas);
    this.almacen.guardarJson(CLAVE_CARRITO, lineas);
  }

  private cargar(): LineaCarrito[] {
    return this.almacen.leerJson<LineaCarrito[]>(CLAVE_CARRITO, []);
  }
}
