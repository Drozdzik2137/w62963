import { IUserResponseModel } from './../../models/user.model';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData!: IUserResponseModel;
  helper = new JwtHelperService();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.userData$.pipe(map((user: IUserResponseModel) => {
      return user;
    })).subscribe((data: IUserResponseModel) => {
      if(!data){
        const token = localStorage.getItem('authToken');
        if(token){
          const userToken = this.helper.decodeToken(token)
          this.userService.getUser(userToken.id).subscribe((user: IUserResponseModel) => {
            this.userData = user;
          })
        }
      }else{
        this.userData = data;
      }
    })
  }

  changeUserData(){

  }

  changeUserPassword(){

  }

}
