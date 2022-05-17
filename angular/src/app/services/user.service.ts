import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUserResponseModel } from './../models/user.model';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth: boolean = false;
  private SERVER_URL = 'http://localhost:4000/api';
  user: any;
  authState$ = new BehaviorSubject<boolean>(this.auth);
  // @ts-ignore
  userData$ = new BehaviorSubject<IUserResponseModel>(null);
  // @ts-ignore
  loginMessage$ = new BehaviorSubject<string>(null);
  isAdmin!: boolean;

  constructor(private http: HttpClient, private router: Router) { }

  loginUser(email: string, password: string){
    this.http.post(`${this.SERVER_URL}/auth/login`, {email, password}).pipe(catchError((err: HttpErrorResponse) => of(err.error.message))).subscribe((data: IUserResponseModel) => {
      if(typeof(data) === 'string'){
        this.loginMessage$.next(data);
      }else{
        this.auth = data.auth;
        this.isAdmin = data.isAdmin;
        this.authState$.next(this.auth);
        this.userData$.next(data);
      }
    })
  }

  logout(){
    this.auth = false;
    this.authState$.next(this.auth);
  }
}
