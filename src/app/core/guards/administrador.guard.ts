import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/** Solo el dueño / administrador de la tienda. */
export const administradorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.esAdministrador()) {
    return true;
  }
  if (auth.autenticado()) {
    return router.createUrlTree(['/']);
  }
  return router.createUrlTree(['/admin/acceso']);
};
