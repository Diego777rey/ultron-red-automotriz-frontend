import { Service, afterNextRender, signal } from '@angular/core';
import { DIAGRAMAS_PROTOTIPO } from '../data/diagramas.data';
import { Diagrama, NuevoDiagrama, esTipoDiagrama } from '../models/diagrama.model';

/** Diagramas que carga el vendedor. El prototipo los guarda en el navegador. */
export const CLAVE_DIAGRAMAS_VENDEDOR = 'red-automotriz.diagramas-vendedor';

@Service()
export class CatalogoDiagramasService {
  private readonly diagramas = signal<readonly Diagrama[]>(DIAGRAMAS_PROTOTIPO);

  readonly todos = this.diagramas.asReadonly();

  constructor() {
    afterNextRender(() => this.incorporarGuardados());
  }

  cargar(nuevo: NuevoDiagrama): Diagrama {
    const diagrama: Diagrama = {
      ...nuevo,
      titulo: nuevo.titulo.trim(),
      modelo: nuevo.modelo.trim(),
      descripcion: nuevo.descripcion.trim(),
      id: crearId(),
      origen: 'vendedor',
    };
    this.diagramas.update((actuales) => [...actuales, diagrama]);
    this.persistir();
    return diagrama;
  }

  quitar(id: string): void {
    const diagrama = this.diagramas().find((item) => item.id === id);
    if (diagrama?.origen !== 'vendedor') {
      return;
    }
    this.diagramas.update((actuales) => actuales.filter((item) => item.id !== id));
    this.persistir();
  }

  private incorporarGuardados(): void {
    const guardados = leerGuardados();
    if (guardados.length === 0) {
      return;
    }
    this.diagramas.update((actuales) => {
      const ids = new Set(actuales.map((item) => item.id));
      const nuevos = guardados.filter((item) => !ids.has(item.id));
      return nuevos.length === 0 ? actuales : [...actuales, ...nuevos];
    });
  }

  private persistir(): void {
    const almacenamiento = leerAlmacenamiento();
    if (!almacenamiento) {
      return;
    }
    const propios = this.diagramas().filter((item) => item.origen === 'vendedor');
    almacenamiento.setItem(CLAVE_DIAGRAMAS_VENDEDOR, JSON.stringify(propios));
  }
}

function crearId(): string {
  const aleatorio = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`;
  return `vendedor-${aleatorio}`;
}

function leerAlmacenamiento(): Storage | null {
  if (typeof globalThis.localStorage === 'undefined') {
    return null;
  }
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function leerGuardados(): Diagrama[] {
  const almacenamiento = leerAlmacenamiento();
  if (!almacenamiento) {
    return [];
  }
  try {
    const crudo = almacenamiento.getItem(CLAVE_DIAGRAMAS_VENDEDOR);
    if (!crudo) {
      return [];
    }
    const datos: unknown = JSON.parse(crudo);
    if (!Array.isArray(datos)) {
      return [];
    }
    return datos.filter(esDiagramaVendedor);
  } catch {
    return [];
  }
}

function esDiagramaVendedor(valor: unknown): valor is Diagrama {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const candidato = valor as Partial<Diagrama>;
  return (
    candidato.origen === 'vendedor' &&
    typeof candidato.id === 'string' &&
    typeof candidato.marcaSlug === 'string' &&
    typeof candidato.titulo === 'string' &&
    typeof candidato.modelo === 'string' &&
    typeof candidato.anio === 'number' &&
    Number.isInteger(candidato.anio) &&
    typeof candidato.precio === 'number' &&
    Number.isInteger(candidato.precio) &&
    candidato.precio > 0 &&
    typeof candidato.descripcion === 'string' &&
    typeof candidato.tipo === 'string' &&
    esTipoDiagrama(candidato.tipo)
  );
}
