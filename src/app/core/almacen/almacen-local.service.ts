import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Service, inject } from '@angular/core';

/**
 * Persistencia en `localStorage` / `sessionStorage`.
 * En SSR devuelve el valor por defecto sin tocar el almacenamiento del navegador.
 */
@Service()
export class AlmacenLocalService {
  private readonly platformId = inject(PLATFORM_ID);

  leerJson<T>(clave: string, porDefecto: T, tipo: 'local' | 'session' = 'local'): T {
    if (!isPlatformBrowser(this.platformId)) {
      return porDefecto;
    }
    const almacen = tipo === 'session' ? sessionStorage : localStorage;
    const crudo = almacen.getItem(clave);
    if (!crudo) {
      return porDefecto;
    }
    try {
      return JSON.parse(crudo) as T;
    } catch {
      return porDefecto;
    }
  }

  guardarJson(clave: string, valor: unknown, tipo: 'local' | 'session' = 'local'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const almacen = tipo === 'session' ? sessionStorage : localStorage;
    almacen.setItem(clave, JSON.stringify(valor));
  }

  quitar(clave: string, tipo: 'local' | 'session' = 'local'): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const almacen = tipo === 'session' ? sessionStorage : localStorage;
    almacen.removeItem(clave);
  }
}
