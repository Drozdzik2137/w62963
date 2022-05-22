import { OrderService } from './../../services/order.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs';
import { IUserResponseModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { IOrderModelServer, IOrderServerResponse } from './../../models/order.model';


@Component({
  selector: 'app-user-order-history',
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.css']
})
export class UserOrderHistoryComponent implements OnInit {
  userData!: IUserResponseModel;
  helper = new JwtHelperService();
  ordersLimit: number = 0;
  ordersCount: number = 0;
  ordersTotalCount: number = 0;
  page: number = 1;
  totalPage: number = 0;
  orders: IOrderModelServer[] = [];

  loading: boolean = false;
  orderOrdersBySelectedValue: number = 1;


  constructor(private userService: UserService, private orderService: OrderService) { }

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
            this.initUserOrders(this.page)
          });
        }
      } else {
        this.userData = data;
        this.initUserOrders(this.page)
      }
    });



  }

  initUserOrders(page: number, ordersLimit?: number, orderType?: string) {
    if (ordersLimit !== undefined && orderType !== undefined) {
      if (this.orderOrdersBySelectedValue === 1) {
        this.orderService.getUserOrders(this.userData.userId, page, ordersLimit, orderType).subscribe((orders: IOrderServerResponse) => {
          this.ordersLimit = orders.limit;
          this.ordersCount = orders.count;
          this.ordersTotalCount = orders.totalOrders;
          this.page = orders.currentPage;
          this.totalPage = orders.totalPages;
          this.orders = orders.orders;
        });
      } else if (this.orderOrdersBySelectedValue === 2) {
        this.orderService.getUserOrders(this.userData.userId, page, ordersLimit, orderType).subscribe((orders: IOrderServerResponse) => {
          this.ordersLimit = orders.limit;
          this.ordersCount = orders.count;
          this.ordersTotalCount = orders.totalOrders;
          this.page = orders.currentPage;
          this.totalPage = orders.totalPages;
        });
      }
    }else {
      let orderType = 'DESC';
      console.log(this.userData.userId, page, 5, orderType)
      this.orderService.getUserOrders(this.userData.userId, page, 5, orderType).subscribe((orders: IOrderServerResponse) => {
        this.ordersLimit = orders.limit;
        this.ordersCount = orders.count;
        this.ordersTotalCount = orders.totalOrders;
        this.page = orders.currentPage;
        this.totalPage = orders.totalPages;
        this.orders = orders.orders;
      });
    }

  }

  getPage(page: number){
    this.loading = true;
    this.page = page;
    if(this.orderOrdersBySelectedValue === 2){
      let orderType = 'ASC';
      console.log(this.userData.userId, this.page, this.ordersLimit, orderType)

      const getProducts = () =>{
        this.initUserOrders(this.page, this.ordersLimit, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }else{
      let orderType = 'DESC';
      console.log(this.userData.userId, this.page, this.ordersLimit, orderType)
      const getProducts = () =>{
        this.initUserOrders(this.page, this.ordersLimit, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }
    window.scroll(0,0);
  }


}
