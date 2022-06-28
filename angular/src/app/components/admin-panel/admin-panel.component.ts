import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { IUserResponseModel } from 'src/app/models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  helper=  new JwtHelperService();
  isFontsLoaded!: boolean;
  userData!: IUserResponseModel;
  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    document.fonts.ready.then(() => (this.isFontsLoaded = true));

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

}
