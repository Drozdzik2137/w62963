import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    emailFormControl: new FormControl('', [Validators.required, Validators.email]),
    passwordFormControl: new FormControl('', [Validators.required])
  })
  hide = true;
  loginMessage!: string;


  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userService.authState$.subscribe(authState => {
      if (authState) {
        this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl || '/profile');

      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  login(){
    const email = this.loginForm.get('emailFormControl')!.value;
    const password = this.loginForm.get('passwordFormControl')!.value;

    this.userService.loginUser(email, password);
    this.userService.loginMessage$.subscribe(msg => {
      this.loginMessage = msg;
      setTimeout(()=>{
        this.loginMessage = '';
      }, 10000);
    });
    this.loginForm.reset();
  }
}
