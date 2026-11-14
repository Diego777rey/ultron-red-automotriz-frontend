/** Perfil + token de la sesión de cliente web (tienda). */
export interface SesionClienteWeb {
  token: string;
  idCliente: number | null;
  idCuenta: number | null;
  email: string;
  nombre: string;
  apellido: string | null;
  documento: string | null;
  ruc: string | null;
  telefono: string | null;
  direccion: string | null;
  mensaje?: string | null;
}

/** Forma cruda que devuelve GraphQL. */
export interface SesionClienteWebGql {
  token?: string | null;
  idCliente?: number | string | null;
  idCuenta?: number | string | null;
  email?: string | null;
  nombre?: string | null;
  apellido?: string | null;
  documento?: string | null;
  ruc?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  mensaje?: string | null;
}

export interface RegistroClienteWebInput {
  nombre: string;
  apellido?: string | null;
  documento: string;
  ruc?: string | null;
  email: string;
  telefono?: string | null;
  direccion?: string | null;
  password: string;
  passwordConfirmacion: string;
}

export interface LoginClienteWebInput {
  email: string;
  password: string;
}

export const CLAVE_SESION_CLIENTE = 'ra-cliente-sesion-v1';
