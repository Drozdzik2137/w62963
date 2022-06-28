import { NavigationExtras, Router } from '@angular/router';
import { OrderService } from './../../services/order.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs';
import { IUserResponseModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { IOrderModelServer, IOrderServerResponse } from './../../models/order.model';


@Component({
  selector: 'app-user-order-history',
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserOrderHistoryComponent implements OnInit {
  helper = new JwtHelperService();
  loading: boolean = false;
  orderOrdersBySelectedValue: number = 1;
  orders: IOrderModelServer[] = [];
  ordersCount: number = 0;
  ordersLimit: number = 0;
  ordersTotalCount: number = 0;
  page: number = 1;
  totalPage: number = 0;
  userData!: IUserResponseModel;
  constructor(private userService: UserService, private orderService: OrderService, private router: Router) { }

  getPage(page: number){
    this.loading = true;
    this.page = page;
    let orderType = 'DESC'
    if(this.orderOrdersBySelectedValue === 1){
      const getProducts = () => {
        this.initUserOrders(this.page, this.ordersLimit, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }else{
      orderType = 'ASC'
      const getProducts = () => {
        this.initUserOrders(this.page, this.ordersLimit, orderType)
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }
    // let orderType = "ASC";
    // if(this.orderOrdersBySelectedValue === 1){
    //   orderType = "DESC";
    //   const getProducts = () =>{
    //     console.log(this.page,this.ordersLimit, orderType)
    //     this.initUserOrders(1, this.ordersLimit, orderType);
    //     this.loading = false;
    //   }
    //   window.setTimeout(getProducts, 500);
    // }else{
    //   const getProducts = () =>{
    //     console.log(this.page,this.ordersLimit, orderType)
    //     this.initUserOrders(1, this.ordersLimit, orderType);
    //     this.loading = false;
    //   }
    //   window.setTimeout(getProducts, 500);
    // }
    // this.initUserOrders(page, this.ordersLimit)
    window.scroll(0,0);
  }

  initUserOrders(page: number, ordersLimit?: number, orderType?: string) {
    if (ordersLimit !== undefined && orderType !== undefined) {
      if (this.orderOrdersBySelectedValue === 1) {
        // console.log(page, ordersLimit, orderType)
        this.orderService.getUserOrders(this.userData.userId, page, ordersLimit, orderType).subscribe((orders: IOrderServerResponse) => {
          this.ordersLimit = orders.limit;
          this.ordersCount = orders.count;
          this.ordersTotalCount = orders.totalOrders;
          this.page = orders.currentPage;
          this.totalPage = orders.totalPages;
          this.orders = orders.orders;
        });
      } else if (this.orderOrdersBySelectedValue === 2) {
        // console.log(page, ordersLimit, orderType)
        this.orderService.getUserOrders(this.userData.userId, page, ordersLimit, orderType).subscribe((orders: IOrderServerResponse) => {
          this.ordersLimit = orders.limit;
          this.ordersCount = orders.count;
          this.ordersTotalCount = orders.totalOrders;
          this.page = orders.currentPage;
          this.totalPage = orders.totalPages;
          this.orders = orders.orders;
        });
      }
    }else {
      let orderType = 'DESC';
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

  SelectOrder(id: number, status: string){
    console.log(id,status);
    this.orderService.getSingleOrder(id).subscribe(prods => {
      const navigationExtras: NavigationExtras = {
        state: {
          products: prods,
          orderId: id,
          status: status
        }
      }
      this.router.navigate(['/details'], navigationExtras);
    })

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
            this.initUserOrders(this.page)
          });
        }
      } else {
        this.userData = data;
        this.initUserOrders(this.page)
      }
    });



  }
}
