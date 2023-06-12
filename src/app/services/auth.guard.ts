import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  constructor(private _authService: AuthService, private _router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (state.url.includes('login')){
      return !this._authService.isAuthenticated()
    }

    if (this._authService.isAuthenticated()){
      return true;
    }

    this._router.navigate(['/login']);
    return false;
  }
}
