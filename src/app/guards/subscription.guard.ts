import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionGuard implements CanActivate {
  constructor(private sharedService: SharedService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // Only allow access to obituary-info for unsubscribed users
    const userToken = this.sharedService.userToken;
    if (!userToken) {
      // Not logged in, redirect to login
      this.router.navigate(['/auth/login']);
      return false;
    }
    const decoded: any = userToken
      ? JSON.parse(atob(userToken.split('.')[1]))
      : {};
    // If user has a plan/subscription, allow access
    if (decoded && decoded.subscription && decoded.subscription !== 'none') {
      return true;
    }
    // Allow access to obituary-info
    if (
      next.routeConfig &&
      next.routeConfig.path &&
      next.routeConfig.path.startsWith('obituary-info')
    ) {
      return true;
    }
    // Otherwise, redirect to subscription plans
    this.router.navigate(['/subscription-plans']);
    return false;
  }
}
