import { computed, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { AlmacenLocalService } from '../almacen/almacen-local.service';
import { GraphqlRequestError, GraphqlService } from '../graphql/graphql.service';
import {
  CLAVE_SESION_CLIENTE,
  LoginClienteWebInput,
  RegistroClienteWebInput,
  SesionClienteWeb,
  SesionClienteWebGql,
} from './cliente-sesion.model';

interface RegistroData {
  registrarCuentaClienteWeb: SesionClienteWebGql;
}

interface LoginData {
  loginClienteWeb: SesionClienteWebGql;
}

interface MiCuentaData {
  miCuentaClienteWeb: SesionClienteWebGql | null;
}

const REGISTRAR_CUENTA_MUTATION = `
  mutation RegistrarCuentaClienteWeb($input: RegistroClienteWebInput!) {
    registrarCuentaClienteWeb(input: $input) {
      token
      idCliente
      idCuenta
      email
      nombre
      apellido
      documento
      ruc
      telefono
      direccion
      mensaje
    }
  }
`;

const LOGIN_MUTATION = `
  mutation LoginClienteWeb($input: LoginClienteWebInput!) {
    loginClienteWeb(input: $input) {
      token
      idCliente
      idCuenta
      email
      nombre
      apellido
      documento
      ruc
      telefono
      direccion
      mensaje
    }
  }
`;

const MI_CUENTA_QUERY = `
  query MiCuentaClienteWeb {
    miCuentaClienteWeb {
      token
      idCliente
      idCuenta
      email
      nombre
      apellido
      documento
      ruc
      telefono
      direccion
      mensaje
    }
  }
`;

/**
 * Sesión de cliente de la tienda (opcional).
 * El catálogo sigue siendo público sin registro.
 */
@Service()
export class AuthService {
  private readonly graphql = inject(GraphqlService);
  private readonly almacen = inject(AlmacenLocalService);

  private readonly sesion = signal<SesionClienteWeb | null>(
    this.almacen.leerJson<SesionClienteWeb | null>(CLAVE_SESION_CLIENTE, null),
  );

  readonly perfil = this.sesion.asReadonly();
  readonly estaAutenticado = computed(() => Boolean(this.sesion()?.token));
  readonly token = computed(() => this.sesion()?.token ?? null);
  readonly nombreVisible = computed(() => {
    const actual = this.sesion();
    if (!actual) {
      return null;
    }
    const partes = [actual.nombre, actual.apellido].filter(Boolean);
    return partes.length > 0 ? partes.join(' ') : actual.email;
  });

  registrar(input: RegistroClienteWebInput): Observable<SesionClienteWeb> {
    return this.graphql
      .mutate<RegistroData>(REGISTRAR_CUENTA_MUTATION, { input: normalizarRegistro(input) })
      .pipe(
        map((data) => mapSesion(data.registrarCuentaClienteWeb)),
        tap((sesion) => this.guardarSesion(sesion)),
      );
  }

  login(input: LoginClienteWebInput): Observable<SesionClienteWeb> {
    return this.graphql
      .mutate<LoginData>(LOGIN_MUTATION, {
        input: {
          email: input.email.trim().toLowerCase(),
          password: input.password,
        },
      })
      .pipe(
        map((data) => mapSesion(data.loginClienteWeb)),
        tap((sesion) => this.guardarSesion(sesion)),
      );
  }

  /** Refresca el perfil con el token actual (opcional). */
  refrescarCuenta(): Observable<SesionClienteWeb | null> {
    if (!this.token()) {
      return of(null);
    }
    return this.graphql.query<MiCuentaData>(MI_CUENTA_QUERY).pipe(
      map((data) => (data.miCuentaClienteWeb ? mapSesion(data.miCuentaClienteWeb) : null)),
      tap((sesion) => {
        if (sesion) {
          // Conserva el token local si el backend no lo reenvía.
          const token = sesion.token || this.token()!;
          this.guardarSesion({ ...sesion, token });
        }
      }),
      catchError((err: unknown) => {
        if (err instanceof GraphqlRequestError) {
          this.cerrarSesion();
        }
        return throwError(() => err);
      }),
    );
  }

  cerrarSesion(): void {
    this.sesion.set(null);
    this.almacen.quitar(CLAVE_SESION_CLIENTE);
  }

  private guardarSesion(sesion: SesionClienteWeb): void {
    if (!sesion.token) {
      throw new Error('La sesión no incluye un token válido');
    }
    this.sesion.set(sesion);
    this.almacen.guardarJson(CLAVE_SESION_CLIENTE, sesion);
  }
}

function aNumero(valor: number | string | null | undefined): number | null {
  if (valor == null || valor === '') {
    return null;
  }
  const n = typeof valor === 'number' ? valor : Number(valor);
  return Number.isFinite(n) ? n : null;
}

function mapSesion(raw: SesionClienteWebGql): SesionClienteWeb {
  return {
    token: raw.token?.trim() ?? '',
    idCliente: aNumero(raw.idCliente),
    idCuenta: aNumero(raw.idCuenta),
    email: raw.email?.trim() ?? '',
    nombre: raw.nombre?.trim() ?? '',
    apellido: raw.apellido?.trim() || null,
    documento: raw.documento?.trim() || null,
    ruc: raw.ruc?.trim() || null,
    telefono: raw.telefono?.trim() || null,
    direccion: raw.direccion?.trim() || null,
    mensaje: raw.mensaje ?? null,
  };
}

function normalizarRegistro(input: RegistroClienteWebInput): RegistroClienteWebInput {
  return {
    nombre: input.nombre.trim(),
    apellido: input.apellido?.trim() || null,
    documento: input.documento.trim(),
    ruc: input.ruc?.trim() || null,
    email: input.email.trim().toLowerCase(),
    telefono: input.telefono?.trim() || null,
    direccion: input.direccion?.trim() || null,
    password: input.password,
    passwordConfirmacion: input.passwordConfirmacion,
  };
}
