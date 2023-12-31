import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {Router} from "@angular/router";
import {SnackbarService} from "../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {GlobalConstants} from "../shared/global-constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  hide = true
  loginForm: any = FormGroup
  responseMessage: any

  constructor(
    private fb:FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService
  ) {
  }


  ngOnInit(): void {
    this.loginForm = this.fb.group(
      {
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required]]
      }
    )
  }

  handleSubmit(){
    this.ngxService.start()
    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password,
    }
    this.userService.login(data).subscribe({
      next: (response: any) => {
        this.ngxService.stop()
        this.dialogRef.close()
        localStorage.setItem('token', response.token)
        this.router.navigate(['/cafe/dashboard']).then(r => {})
      },
      error: (error) =>{
        this.ngxService.stop()
        if (error.error?.message){
          this.responseMessage = error.error?.message
        }else{
          this.responseMessage = GlobalConstants.genericError
        }
        this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error)
      }
    })
  }


}
