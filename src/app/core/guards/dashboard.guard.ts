import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DashboardGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUrl = state.url;

    // Check for specific sessionStorage key
    const hasValidSession = sessionStorage.getItem('user') !== null;

    if (currentUrl.startsWith('') && !hasValidSession) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: currentUrl },
      });
      return false;
    }

    return true;
  }
}
