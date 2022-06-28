import { CartService } from './../../services/cart.service';
import { IProductModelServer, IServerResponse } from './../../models/product.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: IProductModelServer[] = [];

  constructor(private productService: ProductService, private router: Router, private cartService: CartService) { }

  ngOnInit(): void {
    this.productService.getNewProducts().subscribe((prods: IServerResponse) => {
      this.products = prods.products;
    })
  }

  SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

}
