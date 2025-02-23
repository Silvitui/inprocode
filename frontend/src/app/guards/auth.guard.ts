import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  //  Guardamos  la URL para redirigir después del login!
  authService.redirectUrl = route.url.map(segment => segment.path).join('/');
  router.navigate(['/login']);
  return false;
};
