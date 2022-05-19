import { ToastrService } from 'ngx-toastr';
import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router, private toast: ToastrService){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.userService.isLoggedIn$.pipe(
        tap((isLoggedIn) => {
          if(!isLoggedIn){
            this.router.navigateByUrl('/login');
          }
        })
      )
      // let url: string = state.url;
      // return this.checkLogin(url);
  }

  // checkLogin(url: string): boolean {
  //   if(this.userService.isLoggedIn()){
  //     return true;
  //   }
  //   this.toast.error(`Musisz się zalogować!`, 'Brak uprawnień', {
  //     timeOut: 5000,
  //     progressBar: true,
  //     progressAnimation: 'increasing',
  //     positionClass: 'toast-top-right'
  //   });
  //   this.router.navigateByUrl('/login');
  //   return false;
  // }

}
