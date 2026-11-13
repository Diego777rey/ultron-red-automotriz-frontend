export interface PagoTarjetaInput {
  titular: string;
  numero: string;
  vencimiento: string;
  cvc: string;
}

export interface DetallePedidoWebInput {
  idProducto: number;
  idPresentacionProducto?: number | null;
  cantidad: number;
}

export interface PedidoWebInput {
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string | null;
  clienteDocumento?: string | null;
  direccionEnvio?: string | null;
  ciudad?: string | null;
  notas?: string | null;
  formaPago?: string | null;
  pagoTarjeta?: PagoTarjetaInput | null;
  detalles: DetallePedidoWebInput[];
}

export interface DetallePedidoWeb {
  id_detalle_pedido_web: number;
  idProducto: number;
  idPresentacionProducto?: number | null;
  nombreProducto: string;
  presentacion?: string | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoWeb {
  id_pedido_web: number;
  codigo: string;
  estado: string;
  formaPago: string;
  moneda: string;
  total: number;
  clienteNombre: string;
  clienteEmail: string;
  clienteTelefono?: string | null;
  clienteDocumento?: string | null;
  direccionEnvio?: string | null;
  ciudad?: string | null;
  notas?: string | null;
  pagoTransaccionId?: string | null;
  pagoUltimosCuatro?: string | null;
  pagoMensaje?: string | null;
  creadoEn?: string | null;
  detalles: DetallePedidoWeb[];
}
