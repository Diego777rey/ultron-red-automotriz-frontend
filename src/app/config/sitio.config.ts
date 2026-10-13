import {
  faFacebookF,
  faInstagram,
  faXTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { RedSocial } from '../shared/models/footer.model';

/** Datos de contacto del sitio. Valores provisorios hasta tener los reales (ver README). */
export const SITIO = {
  nombre: 'Red Automotriz',
  /**
   * Credenciales iniciales del administrador (dueño de la tienda) hasta conectar el backend.
   * Reemplazar en producción por alta segura en servidor.
   */
  adminInicial: {
    email: 'admin@redautomotriz.com.py',
    nombre: 'Administrador Red Automotriz',
    contrasena: 'Admin.Red2026!',
  },
  /** Clave para el primer registro de administrador desde `/admin/registro`. */
  claveInstalacionAdmin: 'RED-AUTOMOTRIZ-INSTALAR-2026',
  telefono: {
    visible: '+595 21 000 000',
    enlace: 'tel:+59521000000',
  },
  redes: [
    { nombre: 'Facebook', url: 'https://www.facebook.com/', icono: faFacebookF },
    { nombre: 'Instagram', url: 'https://www.instagram.com/', icono: faInstagram },
    { nombre: 'X', url: 'https://x.com/', icono: faXTwitter },
    { nombre: 'YouTube', url: 'https://www.youtube.com/', icono: faYoutube },
  ] satisfies readonly RedSocial[],
};
