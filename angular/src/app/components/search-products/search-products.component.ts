import { IProductModelServer, IServerResponse } from './../../models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.css']
})
export class SearchProductsComponent implements OnInit {
  searchInput: any;
  productsLimit: number = 0;
  productsCount: number = 0;
  productsTotalCount: number = 0;
  page: number = 1;
  totalPages: number = 0;
  products: IProductModelServer[] = [];
  orderProductsBySelectedValue: number = 1;
  loading: boolean = false;

  constructor(private router: Router, private productService: ProductService, private cartService: CartService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      searchInput: string
    };
    if(state !== undefined){
      this.searchInput = state.searchInput;
    }else{
      this.router.navigate(['/products']);
    }
  }

  ngOnInit(): void {
    this.initSearchProducts(this.page);
    // console.log(this.searchInput)
    // let orderBy = "brand";
    // let orderType = "ASC";
    // this.productService.findProducts(this.searchInput, this.page, 12, orderBy, orderType).subscribe((prods: IServerResponse) => {
    //   this.productsLimit = prods.limit;
    //   this.productsCount = prods.count;
    //   this.productsTotalCount = prods.totalProducts;
    //   this.page = prods.currentPage;
    //   this.totalPages = prods.totalPages;
    //   this.products = prods.products;
    // })
  }


  initSearchProducts(page: number, limit?: number, orderBy?: string, orderType?: string){
    if(limit !== undefined && orderBy !== undefined && orderType !== undefined)
    {
      if(this.orderProductsBySelectedValue === 1){
        this.productService.findProducts(this.searchInput, page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
          this.productsLimit = prods.limit;
          this.productsCount = prods.count;
          this.productsTotalCount = prods.totalProducts;
          this.page = prods.currentPage;
          this.totalPages = prods.totalPages;
          this.products = prods.products;
        })

      }else if(this.orderProductsBySelectedValue === 2){

        this.productService.findProducts(this.searchInput, page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
          this.productsLimit = prods.limit;
          this.productsCount = prods.count;
          this.productsTotalCount = prods.totalProducts;
          this.page = prods.currentPage;
          this.totalPages = prods.totalPages;
          this.products = prods.products;
        })

      }else if(this.orderProductsBySelectedValue === 3){

        this.productService.findProducts(this.searchInput, page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
          this.productsLimit = prods.limit;
          this.productsCount = prods.count;
          this.productsTotalCount = prods.totalProducts;
          this.page = prods.currentPage;
          this.totalPages = prods.totalPages;
          this.products = prods.products;
        })
      }else if(this.orderProductsBySelectedValue === 4){

        this.productService.findProducts(this.searchInput, page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
          this.productsLimit = prods.limit;
          this.productsCount = prods.count;
          this.productsTotalCount = prods.totalProducts;
          this.page = prods.currentPage;
          this.totalPages = prods.totalPages;
          this.products = prods.products;
        })
      }

    }else{
      let orderBy = "brand";
      let orderType = "ASC";
      this.productService.findProducts(this.searchInput, page, 12, orderBy, orderType).subscribe((prods: IServerResponse) => {
        this.productsLimit = prods.limit;
        this.productsCount = prods.count;
        this.productsTotalCount = prods.totalProducts;
        this.page = prods.currentPage;
        this.totalPages = prods.totalPages;
        this.products = prods.products;
      })
    }
  }

  getPage(page: number){
    this.loading = true;
    this.page = page;
    let orderBy = "brand";
    let orderType = "ASC";
    if(this.orderProductsBySelectedValue === 2){
      orderBy = "brand";
      orderType = "DESC"

      const getProducts = () =>{
        console.log(this.page, this.productsLimit, orderBy, orderType)
        this.initSearchProducts(this.page, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }if(this.orderProductsBySelectedValue === 3){
      orderBy = "price";
      orderType = "ASC"

      const getProducts = () =>{
        console.log(this.page, this.productsLimit, orderBy, orderType)
        this.initSearchProducts(this.page, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }if(this.orderProductsBySelectedValue === 4){
      orderBy = "price";
      orderType = "DESC"

      const getProducts = () =>{
        console.log(this.page, this.productsLimit, orderBy, orderType)
        this.initSearchProducts(this.page, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }else{
      const getProducts = () =>{
        console.log(this.page, this.productsLimit, orderBy, orderType)
        this.initSearchProducts(this.page, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }
    window.scroll(0,0);
  }

  SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }
}
