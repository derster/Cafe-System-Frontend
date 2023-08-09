import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  public isAuthenticated():boolean{
    const token = localStorage.getItem("token")
    if(!token){
      this.router.navigate(["/"]).then(r => {})
      return false
    }
    return true
  }
}
