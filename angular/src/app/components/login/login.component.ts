import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private hide = true;
  private loginForm = new FormGroup({
    emailFormControl: new FormControl('', [Validators.required]),
    passwordFormControl: new FormControl('', [Validators.required])
  })
  private loginMessage: string | null = null;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private toast: ToastrService) { }

  private login(){
    const email = this.loginForm.get('emailFormControl')!.value;
    const password = this.loginForm.get('passwordFormControl')!.value;

    // this.userService.loginUser(email, password).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
    //   if(data.status == 200){
    //     this.toast.success(`Logowanie zakończone pomyślnie`, 'Zalogowano', {
    //       timeOut: 5000,
    //       progressBar: true,
    //       progressAnimation: 'increasing',
    //       positionClass: 'toast-top-right'
    //     })
    //   }else{
    //     // @ts-ignore
    //     let errorMessage = data.error.message
    //     this.loginMessage = errorMessage;
    //     setTimeout(()=>{
    //       this.loginMessage = '';
    //     }, 20000);
    //     this.toast.error(`${errorMessage}`, 'Logowanie nieudane', {
    //       timeOut: 5000,
    //       progressBar: true,
    //       progressAnimation: 'increasing',
    //       positionClass: 'toast-top-right'
    //     })
    //   }
    // })
    this.userService.loginUser(email, password);
    this.userService.loginMessage$.subscribe(msg => {
      this.loginMessage = msg;
      // setTimeout(()=>{
      //   this.loginMessage = '';
      // }, 20000);
    });
    this.loginForm.reset();
    this.loginMessage = null
  }

  ngOnInit(): void {
    this.userService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl || '/orders');

      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
