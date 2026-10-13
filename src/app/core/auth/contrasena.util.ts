/** Utilidades de contraseña con Web Crypto (compatible con migración a backend Argon2/bcrypt). */

function bytesToBase64(bytes: Uint8Array): string {
  let binario = '';
  for (const byte of bytes) {
    binario += String.fromCharCode(byte);
  }
  return btoa(binario);
}

function base64ToBytes(base64: string): Uint8Array {
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }
  return bytes;
}

export async function crearSal(): Promise<string> {
  const sal = crypto.getRandomValues(new Uint8Array(16));
  return bytesToBase64(sal);
}

export async function hashContrasena(contrasena: string, salBase64: string): Promise<string> {
  const encoder = new TextEncoder();
  const material = encoder.encode(`${salBase64}:${contrasena}`);
  const digest = await crypto.subtle.digest('SHA-256', material);
  return bytesToBase64(new Uint8Array(digest));
}

export async function verificarContrasena(
  contrasena: string,
  salBase64: string,
  hashEsperado: string,
): Promise<boolean> {
  const hash = await hashContrasena(contrasena, salBase64);
  return hash === hashEsperado;
}

export function generarTokenSesion(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
