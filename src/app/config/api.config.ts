/**
 * Configuración central de acceso al backend de gestión de activos.
 *
 * Prioridad:
 * 1. localStorage `ra-api-base-url` (override manual)
 * 2. http://localhost:8081
 */
const STORAGE_KEY = 'ra-api-base-url';
const DEFAULT_BASE_URL = 'http://localhost:8081';

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/$/, '');
}

function readStoredBaseUrl(): string | undefined {
  if (typeof localStorage === 'undefined') {
    return undefined;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)?.trim();
    return stored ? normalizeBaseUrl(stored) : undefined;
  } catch {
    return undefined;
  }
}

export function resolveApiBaseUrl(): string {
  return readStoredBaseUrl() ?? DEFAULT_BASE_URL;
}

/** Arma la URL pública de una ruta relativa de uploads (p. ej. `productos/uuid.jpg`). */
export function resolveUploadsUrl(path: string | null | undefined): string {
  const trimmed = path?.trim();
  if (!trimmed) {
    return '';
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const relative = trimmed.replace(/^\/+/, '').replace(/^uploads\//i, '');
  const encoded = relative.split('/').map(encodeURIComponent).join('/');
  return `${API_CONFIG.uploadsBaseUrl}/${encoded}`;
}

export const API_CONFIG = {
  storageKey: STORAGE_KEY,
  get baseUrl(): string {
    return resolveApiBaseUrl();
  },
  get graphqlEndpoint(): string {
    return `${resolveApiBaseUrl()}/graphql`;
  },
  get uploadsBaseUrl(): string {
    return `${resolveApiBaseUrl()}/uploads`;
  },
};
