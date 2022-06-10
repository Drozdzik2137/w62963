import { IProductModelServer } from './../../models/product.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thank-you-for-the-order',
  templateUrl: './thank-you-for-the-order.component.html',
  styleUrls: ['./thank-you-for-the-order.component.css']
})
export class ThankYouForTheOrderComponent implements OnInit {
  message: any;
  orderId: any;
  products: any;
  cartTotal: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      message: string,
      products: IProductModelServer[],
      orderId: number,
      total: number
    };
    if(state !== undefined){
      this.message = state.message;
      this.products = state.products;
      this.orderId = state.orderId;
      this.cartTotal = state.total;
    }else{
      this.router.navigateByUrl('/orders');
    }
  }

  ngOnInit(): void {
  }
}
