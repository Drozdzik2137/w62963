import { CartService } from './../../services/cart.service';
import { IProductModelServer, IServerResponse } from './../../models/product.model';
import { Component, OnInit, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SingleProductComponent implements OnInit {
  products: IProductModelServer[] = [];
  id!: number;
  images: any[] = [];
  product: any;

  @ViewChild('quantity') quantityInput: any;

  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute, private cartService: CartService) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map((param: ParamMap) => {
        //@ts-ignore
        return param.params.id;
      })
    ).subscribe(id =>{
      this.id = id;
      this.productService.getSingleProduct(this.id).subscribe(prod =>{
        this.product = prod;
        if(prod.images !== null){
          this.images = prod.images.split(';');
        }
      })
    });

  this.productService.getNewProducts().subscribe((prods: IServerResponse) => {
    this.products = prods.products;
  });
}

SelectProduct(id: number){
  this.router.navigate(['/product', id]).then();
}

Increase(){
  let value = parseInt(this.quantityInput.nativeElement.value)
  if(this.product.quantity >= 1){
    value++;

    if(value > this.product.quantity){
      value = this.product.quantity
    }
  }else{
    return;
  }
  this.quantityInput.nativeElement.value = value.toString();
}

Decrease(){
  let value = parseInt(this.quantityInput.nativeElement.value)
  if(this.product.quantity > 0){
    value--

    if(value <= 1){
      value = 1;
    }
  }else{
    return;
  }
  this.quantityInput.nativeElement.value = value.toString();
}

AddToCartQuantity(id: number) {
  this.cartService.AddProductToCart(id, this.quantityInput.nativeElement.value);
}
AddToCart(id:number){
  this.cartService.AddProductToCart(id);
}



}



