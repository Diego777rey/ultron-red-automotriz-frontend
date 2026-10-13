import { Injectable } from '@angular/core';
import { DatosTarjeta, ResultadoPago } from '../models/pago.model';

/**
 * Capa de pagos del frontend. En producción reemplazar por tokenización
 * (p. ej. Stripe Elements / Payment Intents) sin enviar PAN al servidor propio.
 */
@Injectable({ providedIn: 'root' })
export class PagosService {
  async cobrarConTarjeta(monto: number, tarjeta: DatosTarjeta): Promise<ResultadoPago> {
    const numero = tarjeta.numero.replace(/\D/g, '');
    const ultimosCuatro = numero.slice(-4);
    const error = this.validarTarjeta(tarjeta, numero);
    if (error) {
      return {
        aprobado: false,
        transaccionId: '',
        mensaje: error,
        ultimosCuatro,
      };
    }
    await this.esperar(900);
    if (numero.endsWith('0000')) {
      return {
        aprobado: false,
        transaccionId: '',
        mensaje: 'El emisor rechazó el pago. Probá con otra tarjeta.',
        ultimosCuatro,
      };
    }
    return {
      aprobado: true,
      transaccionId: `txn-${Date.now().toString(36)}`,
      mensaje: `Pago de Gs. ${monto.toLocaleString('es-PY')} aprobado.`,
      ultimosCuatro,
    };
  }

  private validarTarjeta(tarjeta: DatosTarjeta, numero: string): string | null {
    if (tarjeta.titular.trim().length < 3) {
      return 'Ingresá el nombre del titular como figura en la tarjeta.';
    }
    if (numero.length < 13 || numero.length > 19) {
      return 'Número de tarjeta inválido.';
    }
    if (!/^\d{2}\/\d{2}$/.test(tarjeta.vencimiento.trim())) {
      return 'Vencimiento inválido. Usá formato MM/AA.';
    }
    if (!/^\d{3,4}$/.test(tarjeta.cvc.trim())) {
      return 'CVC inválido.';
    }
    return null;
  }

  private esperar(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
