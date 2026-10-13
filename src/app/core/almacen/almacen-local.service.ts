import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/**
 * Persistencia local hasta conectar el API. En SSR devuelve el valor por defecto;
 * en el navegador lee/escribe `localStorage` o `sessionStorage`.
 */
@Injectable({ providedIn: 'root' })
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
