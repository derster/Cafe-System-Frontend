import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {ActivatedRouteSnapshot, Router} from "@angular/router";
import {SnackbarService} from "./snackbar.service";
import jwt_decode from 'jwt-decode';
import {GlobalConstants} from "../shared/global-constants";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth: AuthService, public router: Router,
              private snackbarService: SnackbarService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean{

    let expectedRoleArray: any = route.data;
    expectedRoleArray = expectedRoleArray.expectedRole;

    const token: string = localStorage.getItem('token')!;
    let tokenPayload: any;

    try {
      tokenPayload = jwt_decode(token);
    } catch (error) {
      localStorage.clear();
      this.router.navigate(['/']).then(r => {});
    }

    let checkRole = false;

    for (let role of expectedRoleArray) {
      if (role === tokenPayload.role) {
        checkRole = true;
      }
    }

    if (tokenPayload.role === 'user' || tokenPayload.role === 'admin') {
      if (this.auth.isAuthenticated() && checkRole) {
        return true;
      }

      this.snackbarService.openSnackBar(
        GlobalConstants.unauthorized,
        GlobalConstants.error
      );

      this.router.navigate(['/']).then(r => {});
      return false;
    } else {
      this.router.navigate(['/']).then(r => {})
      localStorage.clear();
      return false;
    }
  }
}
