export interface DatosTarjeta {
  titular: string;
  numero: string;
  vencimiento: string;
  cvc: string;
}

export interface ResultadoPago {
  aprobado: boolean;
  transaccionId: string;
  mensaje: string;
  ultimosCuatro: string;
}
