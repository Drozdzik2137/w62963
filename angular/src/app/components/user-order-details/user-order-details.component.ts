import { OrderService } from './../../services/order.service';
import { IProductModelServer } from './../../models/product.model';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { IUserResponseModel } from 'src/app/models/user.model';
import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-order-details',
  templateUrl: './user-order-details.component.html',
  styleUrls: ['./user-order-details.component.css']
})
export class UserOrderDetailsComponent implements OnInit {
  helper = new JwtHelperService();
  loading: boolean = false;
  orderId: any;
  orderStatus: any;
  products: any;
  total: any
  userData!: IUserResponseModel;
  constructor(private userService: UserService, private router: Router, private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      products: IProductModelServer[],
      orderId: number,
      status: string
    };
    if(state !== undefined){
      this.products = state.products;
      this.orderId = state.orderId;
      this.orderStatus = state.status;
    }else{
      this.router.navigateByUrl('/orders');
    }
   }

  ngOnInit(): void {
    this.userService.userData$.pipe(map((user: IUserResponseModel) => {
      return user;
    })).subscribe((data: IUserResponseModel) => {
      if (!data) {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userToken = this.helper.decodeToken(token);
          this.userService.getUser(userToken.id).subscribe((user: IUserResponseModel) => {
            this.userData = user;
          });
        }
      } else {
        this.userData = data;
      }
    });
    this.orderService.getSingleOrderTotal(this.orderId).subscribe(total => this.total = total);
  }



}
