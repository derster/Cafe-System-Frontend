import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {SnackbarService} from "../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {GlobalConstants} from "../shared/global-constants";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{
  forgotPasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService,
              private snackbarService: SnackbarService,
              private dialogRef: MatDialogRef<ForgotPasswordComponent>,
              private ngxService: NgxUiLoaderService)
  {
  }


  ngOnInit(){
    this.forgotPasswordForm = this.fb.group({
      email:[null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
    })
  }

  handleSubmit(){
    this.ngxService.start()
    const formData = this.forgotPasswordForm.value
    const data = {
      email: formData.email
    }

    this.userService.forgotPassword(data).subscribe({
      next : (response:any)=>{
        this.ngxService.stop()
        this.responseMessage = response?.message
        this.dialogRef.close()
        this.snackbarService.openSnackBar(this.responseMessage, '')
      },
      error: (error)=>{
        console.log(error)
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
