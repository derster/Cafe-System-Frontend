import { Component, AfterViewInit } from '@angular/core';
import {GlobalConstants} from "../shared/global-constants";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {DashboardService} from "../services/dashboard.service";
import {SnackbarService} from "../services/snackbar.service";
import {Details} from "../models/details";
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit{
  responseMessage: any;
  data!: Details;
  ngAfterViewInit() {

  }

  constructor(
    private dashboardService: DashboardService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    this.ngxService.start();
    this.dashboardData();
  }


  dashboardData() {
    this.dashboardService.getDetails().subscribe(
      {
        next: (resp: any)=>{
          this.ngxService.stop();
          this.data = resp;
        },
        error: (error) =>{
          this.ngxService.stop();
          console.log(error);
          if (error.error?.message) {
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstants.genericError;
          }
          this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
        }
      }
    );
  }
}
