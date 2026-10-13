/** Rol del usuario en la plataforma. */
export type RolUsuario = 'administrador' | 'cliente';

export function esAdministrador(rol: RolUsuario): boolean {
  return rol === 'administrador';
}
