import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { Component, OnInit } from '@angular/core';
import { ICartModelServer } from 'src/app/models/cart.model';
import { ProductService } from 'src/app/services/product.service';
import { IProductModelServer, IServerResponse } from 'src/app/models/product.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartData!: ICartModelServer;
  cartTotal!: number;
  subTotal!: number;
  products: IProductModelServer[] = [];

  constructor(public cartService: CartService, private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);
    this.productService.getNewProducts().subscribe((prods: IServerResponse) => {
      this.products = prods.products;
    });
  }

  ChangeQuantity(id: number, increaseQuantity: boolean) {
    this.cartService.UpdateProductQuantityFromCart(id, increaseQuantity);
  }

  SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id:number){
    this.cartService.AddProductToCart(id);
  }
}
