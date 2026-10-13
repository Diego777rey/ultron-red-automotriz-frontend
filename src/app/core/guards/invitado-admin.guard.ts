import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/** Pantalla de acceso admin: redirige si ya hay sesión de administrador. */
export const invitadoAdminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.esAdministrador()) {
    return router.createUrlTree(['/admin']);
  }
  return true;
};
