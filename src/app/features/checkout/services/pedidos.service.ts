import { Injectable, inject, signal } from '@angular/core';
import { AlmacenLocalService } from '../../../core/almacen/almacen-local.service';
import { LineaCarrito } from '../../carrito/models/linea-carrito.model';

export interface Pedido {
  id: string;
  usuarioId: string;
  lineas: readonly LineaCarrito[];
  total: number;
  transaccionId: string;
  ultimosCuatroTarjeta: string;
  creadoEn: string;
}

const CLAVE_PEDIDOS = 'ra-pedidos-v1';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private readonly almacen = inject(AlmacenLocalService);
  private readonly pedidos = signal<readonly Pedido[]>(this.almacen.leerJson(CLAVE_PEDIDOS, []));

  readonly todos = this.pedidos.asReadonly();

  registrar(pedido: Omit<Pedido, 'id' | 'creadoEn'>): Pedido {
    const completo: Pedido = {
      ...pedido,
      id: `ped-${Date.now().toString(36)}`,
      creadoEn: new Date().toISOString(),
    };
    const siguientes = [...this.pedidos(), completo];
    this.pedidos.set(siguientes);
    this.almacen.guardarJson(CLAVE_PEDIDOS, siguientes);
    return completo;
  }

  porUsuario(usuarioId: string): readonly Pedido[] {
    return this.pedidos().filter((pedido) => pedido.usuarioId === usuarioId);
  }
}
