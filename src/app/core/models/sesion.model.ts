import { Usuario } from './usuario.model';

export interface SesionActiva {
  token: string;
  usuario: Usuario;
  iniciadaEn: string;
}
