import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IUserResponseModel } from './../models/user.model';
import { BehaviorSubject, catchError, of} from 'rxjs';
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

  constructor(private http: HttpClient, private router: Router, private toast: ToastrService) { }

  loginUser(email: string, password: string){
    this.http.post(`${this.SERVER_URL}/auth/login`, {email, password}).pipe(catchError((err: HttpErrorResponse) => of(err.error.message))).subscribe((data: IUserResponseModel) => {
      if(typeof(data) === 'string'){
        this.loginMessage$.next(data);
        this.toast.error(`${data}`, 'Logowanie nieudane', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }else{
        this.toast.success(`Logowanie zakończone pomyślnie`, 'Zalogowano', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
        console.log(data)
        this.auth = data.auth;
        this.isAdmin = data.isAdmin;
        this.authState$.next(this.auth);
        this.userData$.next(data);
      }
    })
    // return this.http.post(`${this.SERVER_URL}/auth/login`, {email, password}, {observe: 'response'})
  }

  logout(){
    this.auth = false;
    this.authState$.next(this.auth);
    this.toast.info(`Zostałeś pomyślnie wylogowany`, 'Wylogowano', {
      timeOut: 5000,
      progressBar: true,
      progressAnimation: 'increasing',
      positionClass: 'toast-top-right'
    })
  }

  registerUser(email: string, password: string, fname: string, lname: string, photoUrl?: string, type?: string){
    return this.http.post(`${this.SERVER_URL}/auth/register`, {email, password, fname, lname, photoUrl, type}, {observe: 'response'})
  }
}

