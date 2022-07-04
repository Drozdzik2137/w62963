import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IUserAdminResponseServer, IUserResponseModel } from './../models/user.model';
import { BehaviorSubject, catchError, of} from 'rxjs';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _isAdmin$= new BehaviorSubject<boolean>(false);
  _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  helper = new JwtHelperService();
  SERVER_URL = 'http://localhost:4000/api';
  isAdmin$ = this._isAdmin$.asObservable();
  isLoggedIn$ = this._isLoggedIn$.asObservable();
  // @ts-ignore
  userData$ = new BehaviorSubject<IUserResponseModel>(null);
  // @ts-ignore
  loginMessage$ = new BehaviorSubject<string>(null);
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
    this.isAdmin()
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
        this._isAdmin$.next(data.isAdmin);
        this.userData$.next(data);
        if(data.isAdmin == true){
          this.router.navigateByUrl('/admin');
        }
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
    this.isAdmin();
  }

  registerUser(email: string, password: string, fname: string, lname: string, phoneNumber: string, photoUrl?: string, type?: string){
    return this.http.post(`${this.SERVER_URL}/auth/register`, {email, password, fname, lname, phoneNumber, photoUrl, type}, {observe: 'response'})
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
        });
      }
    }
    return this._isLoggedIn$.next(false);
  }
  isAdmin(){
    const token = localStorage.getItem('authToken');
    if(token){
      const role = this.helper.decodeToken(token)
      if(role.isAdmin == true){
        this._isAdmin$.next(true);
      }else{
        this._isAdmin$.next(false);
      }
    }
  }

  getUser(id: number){
    return this.http.get<IUserResponseModel>(`${this.SERVER_URL}/user/` + id);
  }

  changeUserData(id: number, fname: string, lname: string){
    return this.http.patch(`${this.SERVER_URL}/user/` + id, {fname, lname}, {observe: 'response'});
  }

  changeUserPassword(id: number, oldPassword: string, newPassword: string){
    return this.http.patch(`${this.SERVER_URL}/user/` + id, {oldPassword, newPassword}, {observe: 'response'});
  }

  changeUserPhone(id: number, phoneNumber: string){
    return this.http.patch(`${this.SERVER_URL}/user/` + id, {phoneNumber}, {observe: 'response'});
  }

  deleteUserAccount(id:number){
    return this.http.delete(`${this.SERVER_URL}/user/` + id, {observe: 'response'});
  }

  getAllUsers(){
    return this.http.get<IUserAdminResponseServer>(`${this.SERVER_URL}/allUsers`);
  }

}



