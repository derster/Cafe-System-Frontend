import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {SnackbarService} from "../services/snackbar.service";
import {MatDialogRef} from "@angular/material/dialog";
import {NgxUiLoaderService} from "ngx-ui-loader";
import {GlobalConstants} from "../shared/global-constants";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent  implements OnInit{
  password = true
  confirmPassword= true
  signupForm:any = FormGroup
  responseMessage: any
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private snackbarService: SnackbarService,
              private dialogRef: MatDialogRef<SignupComponent>,
              private ngxService: NgxUiLoaderService
              ) {}
   ngOnInit(){
      this.signupForm = this.formBuilder.group({
        name:[null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
        email:[null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
        contactNumber:[null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
        password: [null, [Validators.required]],
        confirmPassword: [null, [Validators.required]]
      })
   }
   validateSubmit(){
      return this.signupForm.controls['password'].value != this.signupForm.controls['confirmPassword'].value;
   }
   handleSubmit(){
    this.ngxService.start()
     const formData = this.signupForm.value;
     const data = {
       name: formData.name,
       contactNumber: formData.contactNumber,
       email: formData.email,
       password: formData.password,
     }
     this.userService.signup(data).subscribe({
       next: (response: any) => {
         this.ngxService.stop()
         this.dialogRef.close()
         this.responseMessage = response?.message
         this.snackbarService.openSnackBar(this.responseMessage, '')
         this.router.navigate(['/']).then(r => {})
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
