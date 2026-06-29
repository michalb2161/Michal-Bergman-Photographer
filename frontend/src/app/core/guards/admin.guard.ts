import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAdmin()) {
    return true;
  }
  if (auth.isLoggedIn()) {
    return auth.refreshProfile().pipe(
      map((res) => (res.user.role === 'admin' ? true : router.createUrlTree(['/login']))),
      catchError(() => of(router.createUrlTree(['/login'])))
    );
  }
  return router.createUrlTree(['/login']);
};
