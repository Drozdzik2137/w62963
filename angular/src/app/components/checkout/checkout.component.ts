import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
import { OrderService } from './../../services/order.service';
import { CartService } from 'src/app/services/cart.service';
import { ICartModelServer } from './../../models/cart.model';
import { Component, OnInit } from '@angular/core';
import { IUserResponseModel } from 'src/app/models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartData!: ICartModelServer;
  cartTotal!: number;
  userData!: IUserResponseModel;
  helper = new JwtHelperService();
  userId!: number;

  constructor(private cartService: CartService, private orderService: OrderService, private router: Router, private spinner: NgxSpinnerService, private userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.userService.userData$.pipe(map((user: IUserResponseModel) => {
      return user;
    })).subscribe((data: IUserResponseModel) => {
      if (!data) {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userToken = this.helper.decodeToken(token);
          this.userService.getUser(userToken.id).subscribe((user: IUserResponseModel) => {
            this.userData = user;
            this.userId = user.userId;
          });
        }
      } else {
        this.userData = data;
        this.userId = data.userId;
      }
    });
  }

  onCheckout(){
    if(this.cartTotal > 0) {
      this.spinner.show().then(p => {
        this.cartService.CheckoutFromCart(this.userId);
      });
    }else{
      return;
    }
  }

}
