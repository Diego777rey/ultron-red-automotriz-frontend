import { Service, signal } from '@angular/core';

/** Panel de categorías de la tienda, abierto desde el ícono de menú. */
@Service()
export class MenuLateralService {
  readonly abierto = signal(false);

  abrir(): void {
    this.abierto.set(true);
  }

  cerrar(): void {
    this.abierto.set(false);
  }

  alternar(): void {
    this.abierto.update((abierto) => !abierto);
  }
}
