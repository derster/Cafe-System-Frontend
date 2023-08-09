import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {SnackbarService} from "../../../services/snackbar.service";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {GlobalConstants} from "../../../shared/global-constants";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit{
  oldPassword= true
  newPassword= true
  confirmPassword= true
  responseMessage: any
  changePasswordForm:any= FormGroup
  constructor(private fb:FormBuilder,
              private userService: UserService,
              public dialogRef: MatDialogRef<ChangePasswordComponent>,
              private ngxService: NgxUiLoaderService,
              private snackBar: SnackbarService) {

  }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }

  validateSubmit(){
    return this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value;
  }

  handleSubmit() {
    this.ngxService.start();
    let formData = this.changePasswordForm.value;
    let data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };

    this.userService.changePassword(data).subscribe({
          next: (response: any) => {
            this.ngxService.stop();
            this.responseMessage = response?.message;
            this.dialogRef.close();
            this.snackBar.openSnackBar(this.responseMessage, 'success');
          },
          error: (error:any) => {
            this.ngxService.stop();
            console.log(error);
            if (error.error?.message) {
              this.responseMessage = error.error?.message;
            } else {
              this.responseMessage = GlobalConstants.genericError;
            }
            this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
          }
        }
    );
  }
}
