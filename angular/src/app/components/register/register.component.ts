import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm = new FormGroup({
    emailFormControl: new FormControl('',  [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required, Validators.minLength(6)]),
    fnameFormControl: new FormControl('', [Validators.required]),
    lnameFormCntrol: new FormControl('', [Validators.required])
  });
  hide = true;
  isChecked = false;

  constructor() { }

  ngOnInit(): void {
  }

  registerUser(){
    const email = this.registrationForm.get('emailFormControl')?.value;
    console.log(email);
}

  OnChange(event: any){
    if(this.isChecked == true){
      this.isChecked = false
    }else{
      this.isChecked = true
    }
  }

}
