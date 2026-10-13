import { RolUsuario } from './rol-usuario';

/** Usuario registrado (sin datos sensibles). */
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  creadoEn: string;
}

/** Registro persistido con hash de contraseña (nunca se expone al resto de la app). */
export interface UsuarioAlmacenado extends Usuario {
  hashContrasena: string;
  salContrasena: string;
}

export interface RegistroCliente {
  email: string;
  nombre: string;
  contrasena: string;
}

export interface RegistroAdministrador extends RegistroCliente {
  /** Clave de instalación inicial; en producción la emite el backend. */
  claveInstalacion: string;
}
