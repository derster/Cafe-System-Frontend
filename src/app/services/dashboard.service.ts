import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Details} from "../models/details";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  url= environment.apiUrl

  constructor(private httpClient:HttpClient) { }

  getDetails(): Observable<Details>{
    return this.httpClient.get<Details>(this.url+"/dashboard/details")
  }
}
