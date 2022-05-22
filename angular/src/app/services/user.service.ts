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
  private SERVER_URL = 'http://localhost:4000/api';
  _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  // @ts-ignore
  userData$ = new BehaviorSubject<IUserResponseModel>(null);
  // @ts-ignore
  loginMessage$ = new BehaviorSubject<string>(null);
  isAdmin$= new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router, private toast: ToastrService) {
    // const token = localStorage.getItem('authToken');
    // this._isLoggedIn$.next(!!token);
    // console.log(!!token, !token);
    // if(!token){
    //   console.log('pustka')
    //   this._isLoggedIn$.next(!token);
    // }else{
    //   if(this.tokenExpired(token)){
    //     console.log('autoryzacja')
    //     this._isLoggedIn$.next(!!token);
    //   }else{
    //     console.log('wygasly')
    //     localStorage.removeItem('authToken');
    //     this._isLoggedIn$.next(!token);
    //   }
    // }
    this.isLoggedIn();
   }

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
        localStorage.setItem('authToken', data.token);
        this._isLoggedIn$.next(true);
        this.isAdmin$.next(data.isAdmin);
        this.userData$.next(data);
      }
    })
    // return this.http.post(`${this.SERVER_URL}/auth/login`, {email, password}, {observe: 'response'})
  }

  logout(){
    this._isLoggedIn$.next(false);
    localStorage.removeItem('authToken');
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

  isLoggedIn(){
    const token = localStorage.getItem('authToken');
    if(token){
      const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
      const currentTime = Math.round((new Date().getTime() / 1000));
      if(expiry > currentTime){
        return this._isLoggedIn$.next(true);
      }else{
        this._isLoggedIn$.next(false);
        localStorage.removeItem('authToken');
        this.toast.info(`Skończył się czas twojej autoryzacji. Zaloguj się ponownie.`, 'Wylogowano', {
          timeOut: 5000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
    }
    return this._isLoggedIn$.next(false);
  }

  getUser(id: number){
    return this.http.get<IUserResponseModel>(`${this.SERVER_URL}/user/` + id);
  }
}



