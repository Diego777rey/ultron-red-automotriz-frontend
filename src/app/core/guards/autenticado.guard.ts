import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/** Exige sesión de cliente o administrador en rutas de compra. */
export const autenticadoGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.autenticado()) {
    return true;
  }
  return router.createUrlTree(['/cuenta/iniciar-sesion'], {
    queryParams: { returnUrl: state.url },
  });
};
