import { Injectable, computed, inject, signal } from '@angular/core';
import { AlmacenLocalService } from '../../../core/almacen/almacen-local.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ProductoDiagrama } from '../../productos/models/producto.model';
import { LineaCarrito } from '../models/linea-carrito.model';

const CLAVE_CARRITO = 'ra-carrito-v1';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly almacen = inject(AlmacenLocalService);
  private readonly auth = inject(AuthService);

  private readonly lineas = signal<readonly LineaCarrito[]>(this.cargar());

  readonly items = this.lineas.asReadonly();
  readonly cantidadTotal = computed(() =>
    this.lineas().reduce((total, linea) => total + linea.cantidad, 0),
  );
  readonly subtotal = computed(() =>
    this.lineas().reduce((total, linea) => total + linea.cantidad * linea.producto.precio, 0),
  );
  readonly vacio = computed(() => this.lineas().length === 0);

  agregar(producto: ProductoDiagrama): void {
    const actuales = this.lineas();
    const indice = actuales.findIndex((linea) => linea.productoId === producto.id);
    let siguientes: LineaCarrito[];
    if (indice >= 0) {
      siguientes = actuales.map((linea, i) =>
        i === indice ? { ...linea, cantidad: linea.cantidad + 1 } : linea,
      );
    } else {
      siguientes = [...actuales, { productoId: producto.id, cantidad: 1, producto }];
    }
    this.persistir(siguientes);
  }

  quitar(productoId: string): void {
    this.persistir(this.lineas().filter((linea) => linea.productoId !== productoId));
  }

  actualizarCantidad(productoId: string, cantidad: number): void {
    if (cantidad < 1) {
      this.quitar(productoId);
      return;
    }
    this.persistir(
      this.lineas().map((linea) =>
        linea.productoId === productoId ? { ...linea, cantidad } : linea,
      ),
    );
  }

  vaciar(): void {
    this.persistir([]);
  }

  private persistir(lineas: readonly LineaCarrito[]): void {
    this.lineas.set(lineas);
    this.almacen.guardarJson(this.claveCarrito(), lineas);
  }

  private cargar(): LineaCarrito[] {
    return this.almacen.leerJson<LineaCarrito[]>(this.claveCarrito(), []);
  }

  private claveCarrito(): string {
    const usuario = this.auth.usuario();
    return usuario ? `${CLAVE_CARRITO}-${usuario.id}` : `${CLAVE_CARRITO}-invitado`;
  }
}
