import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hide = true;
  isChecked = false;
  registrationForm = new FormGroup({
    emailFormControl: new FormControl('',  [Validators.required, Validators.email, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,6}$/)]),
    passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fnameFormControl: new FormControl('', [Validators.required]),
    lnameFormCntrol: new FormControl('', [Validators.required]),
    phoneFormControl: new FormControl('', [Validators.required, Validators.pattern('[5-9]\\d{8}')])
  });
  registrationMessage!: string;
  registrationStatus!: number;

  constructor(private userService: UserService, private toast: ToastrService, private router: Router) { }

  OnChange(event: any){
    if(this.isChecked == true){
      this.isChecked = false
    }else{
      this.isChecked = true
    }
  }

  registerUser(){
    this.userService.registerUser(this.registrationForm.get('emailFormControl')?.value, this.registrationForm
    .get('passwordFormControl')?.value, this.registrationForm.get('fnameFormControl')?.value, this.registrationForm.get('lnameFormCntrol')?.value, this.registrationForm.get('phoneFormControl')?.value).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
      this.registrationStatus = data.status;
      console.log(data.status, data)
      if(this.registrationStatus == 200){
        console.log(data)
        // @ts-ignore
        let successMessage = data.body.message;
        this.toast.success(`${successMessage}`, 'Rejestracja udana', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
        this.router.navigate(['/login']);
      }else{
        // @ts-ignore
        this.registrationMessage = data.error.message;
        setTimeout(()=>{
          this.registrationMessage = '';
        }, 20000);
        if(this.registrationMessage != null)
        this.toast.error(`${this.registrationMessage}`, 'Rejestracja zakończona niepowodzeniem', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
  });

  this.registrationForm.reset();
  this.isChecked = false;
}

  ngOnInit(): void {
  }
}
