import { Injectable, computed, inject, signal } from '@angular/core';
import { SITIO } from '../../config/sitio.config';
import { AlmacenLocalService } from '../almacen/almacen-local.service';
import { SesionActiva } from '../models/sesion.model';
import { esAdministrador } from '../models/rol-usuario';
import {
  RegistroAdministrador,
  RegistroCliente,
  Usuario,
  UsuarioAlmacenado,
} from '../models/usuario.model';
import { crearSal, generarTokenSesion, hashContrasena, verificarContrasena } from './contrasena.util';

const CLAVE_USUARIOS = 'ra-usuarios-v1';
const CLAVE_SESION = 'ra-sesion-v1';

export type ResultadoAuth =
  | { ok: true; usuario: Usuario }
  | { ok: false; mensaje: string };

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly almacen = inject(AlmacenLocalService);

  private readonly sesion = signal<SesionActiva | null>(this.cargarSesion());

  readonly usuario = computed(() => this.sesion()?.usuario ?? null);
  readonly autenticado = computed(() => this.usuario() !== null);
  readonly esAdministrador = computed(() => {
    const usuario = this.usuario();
    return usuario !== null && esAdministrador(usuario.rol);
  });

  constructor() {
    this.sembrarAdministradorInicial();
  }

  async iniciarSesion(email: string, contrasena: string): Promise<ResultadoAuth> {
    const normalizado = email.trim().toLowerCase();
    const usuarios = this.leerUsuarios();
    const registro = usuarios.find((u) => u.email === normalizado);
    if (!registro) {
      return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
    }
    const valida = await verificarContrasena(contrasena, registro.salContrasena, registro.hashContrasena);
    if (!valida) {
      return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };
    }
    const usuario = this.aUsuarioPublico(registro);
    this.establecerSesion(usuario);
    return { ok: true, usuario };
  }

  async registrarCliente(datos: RegistroCliente): Promise<ResultadoAuth> {
    return this.registrar({ ...datos, rol: 'cliente' });
  }

  async registrarAdministrador(datos: RegistroAdministrador): Promise<ResultadoAuth> {
    if (datos.claveInstalacion.trim() !== SITIO.claveInstalacionAdmin) {
      return { ok: false, mensaje: 'Clave de instalación inválida.' };
    }
    if (this.hayAdministrador()) {
      return { ok: false, mensaje: 'Ya existe un administrador. Usá iniciar sesión.' };
    }
    return this.registrar({ email: datos.email, nombre: datos.nombre, contrasena: datos.contrasena, rol: 'administrador' });
  }

  cerrarSesion(): void {
    this.sesion.set(null);
    this.almacen.quitar(CLAVE_SESION, 'session');
  }

  listarClientes(): readonly Usuario[] {
    return this.leerUsuarios()
      .filter((u) => u.rol === 'cliente')
      .map((u) => this.aUsuarioPublico(u))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  private async registrar(
    datos: {
      email: string;
      nombre: string;
      contrasena: string;
      rol: Usuario['rol'];
    },
    opciones?: { iniciarSesion: boolean },
  ): Promise<ResultadoAuth> {
    const email = datos.email.trim().toLowerCase();
    if (!email.includes('@')) {
      return { ok: false, mensaje: 'Ingresá un correo válido.' };
    }
    if (datos.contrasena.length < 8) {
      return { ok: false, mensaje: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    const usuarios = this.leerUsuarios();
    if (usuarios.some((u) => u.email === email)) {
      return { ok: false, mensaje: 'Ese correo ya está registrado.' };
    }
    const sal = await crearSal();
    const hash = await hashContrasena(datos.contrasena, sal);
    const nuevo: UsuarioAlmacenado = {
      id: `usr-${Date.now().toString(36)}`,
      email,
      nombre: datos.nombre.trim(),
      rol: datos.rol,
      creadoEn: new Date().toISOString(),
      salContrasena: sal,
      hashContrasena: hash,
    };
    this.guardarUsuarios([...usuarios, nuevo]);
    const usuario = this.aUsuarioPublico(nuevo);
    if (opciones?.iniciarSesion !== false) {
      this.establecerSesion(usuario);
    }
    return { ok: true, usuario };
  }

  private sembrarAdministradorInicial(): void {
    if (this.hayAdministrador()) {
      return;
    }
    void this.registrar(
      {
        email: SITIO.adminInicial.email,
        nombre: SITIO.adminInicial.nombre,
        contrasena: SITIO.adminInicial.contrasena,
        rol: 'administrador',
      },
      { iniciarSesion: false },
    );
  }

  private hayAdministrador(): boolean {
    return this.leerUsuarios().some((u) => u.rol === 'administrador');
  }

  private establecerSesion(usuario: Usuario): void {
    const activa: SesionActiva = {
      token: generarTokenSesion(),
      usuario,
      iniciadaEn: new Date().toISOString(),
    };
    this.sesion.set(activa);
    this.almacen.guardarJson(CLAVE_SESION, activa, 'session');
  }

  private cargarSesion(): SesionActiva | null {
    return this.almacen.leerJson<SesionActiva | null>(CLAVE_SESION, null, 'session');
  }

  private leerUsuarios(): UsuarioAlmacenado[] {
    return this.almacen.leerJson<UsuarioAlmacenado[]>(CLAVE_USUARIOS, []);
  }

  private guardarUsuarios(usuarios: readonly UsuarioAlmacenado[]): void {
    this.almacen.guardarJson(CLAVE_USUARIOS, usuarios);
  }

  private aUsuarioPublico(registro: UsuarioAlmacenado): Usuario {
    return {
      id: registro.id,
      email: registro.email,
      nombre: registro.nombre,
      rol: registro.rol,
      creadoEn: registro.creadoEn,
    };
  }
}
