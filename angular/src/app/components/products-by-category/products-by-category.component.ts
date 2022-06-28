import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { ICategoryModelServer, ICategoryServerResponse } from 'src/app/models/category.model';
import { IProductModelServer, IServerResponse } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-products-by-category',
  templateUrl: './products-by-category.component.html',
  styleUrls: ['./products-by-category.component.css']
})
export class ProductsByCategoryComponent implements OnInit {
  categories: ICategoryModelServer[] = [];
  categoryId: any;
  countCategories: number = 0;
  loading: boolean = false;
  noProductMessage: any;
  orderProductsBySelectedValue: number = 1;
  page: number = 1;
  products: IProductModelServer[] = [];
  productsCount: number = 0;
  productsLimit: number = 0;
  productsTotalCount: number = 0;
  totalPages: number = 0;
  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private categoryService: CategoryService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      categoryId: number
    };
    if(state !== undefined){
      this.initAllCategories();
      this.SelectedCategory(state.categoryId);

    }else{
      this.initAllCategories();
      this.initAllProducts(this.page);
    }
   }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
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
        this.initAllProducts(this.page, this.categoryId, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }if(this.orderProductsBySelectedValue === 3){
      orderBy = "price";
      orderType = "ASC"

      const getProducts = () =>{
        this.initAllProducts(this.page, this.categoryId, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }if(this.orderProductsBySelectedValue === 4){
      orderBy = "price";
      orderType = "DESC"

      const getProducts = () =>{
        this.initAllProducts(this.page, this.categoryId, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }else{
      const getProducts = () =>{
        this.initAllProducts(this.page, this.categoryId, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }
    window.scroll(0,0);
  }

  initAllCategories(){
    this.categoryService.getAllCategories().subscribe((categories: ICategoryServerResponse) => {
      this.categories = categories.categories;
      this.countCategories = categories.count;
    })
  }

  initAllProducts(page: number, category?: number, limit?: number, orderBy?: string, orderType?: string){
    this.noProductMessage = undefined;
    if(category !== undefined && limit !== undefined && orderBy !== undefined && orderType !== undefined)
    {
      if(this.orderProductsBySelectedValue === 1){
        this.categoryService.getProductsFromCategory(page, category, limit, orderBy, orderType).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          if(data.status == 200){
            // @ts-ignore
            this.productsLimit = data.body.limit;
            // @ts-ignore
            this.productsCount = data.body.count;
            // @ts-ignore
            this.productsTotalCount = data.body.totalProducts;
            // @ts-ignore
            this.page = data.body.currentPage;
            // @ts-ignore
            this.totalPages = data.body.totalPages;
            // @ts-ignore
            this.products = data.body.products;
          }else{
            this.noProductMessage = 'Brak produktów w wybranej kategorii';
          }
        })

      }else if(this.orderProductsBySelectedValue === 2){

        this.categoryService.getProductsFromCategory(page, category, limit, orderBy, orderType).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          if(data.status == 200){
            // @ts-ignore
            this.productsLimit = data.body.limit;
            // @ts-ignore
            this.productsCount = data.body.count;
            // @ts-ignore
            this.productsTotalCount = data.body.totalProducts;
            // @ts-ignore
            this.page = data.body.currentPage;
            // @ts-ignore
            this.totalPages = data.body.totalPages;
            // @ts-ignore
            this.products = data.body.products;
          }else{
            this.noProductMessage = 'Brak produktów w wybranej kategorii';
          }
        })

      }else if(this.orderProductsBySelectedValue === 3){

        this.categoryService.getProductsFromCategory(page, category, limit, orderBy, orderType).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          if(data.status == 200){
            // @ts-ignore
            this.productsLimit = data.body.limit;
            // @ts-ignore
            this.productsCount = data.body.count;
            // @ts-ignore
            this.productsTotalCount = data.body.totalProducts;
            // @ts-ignore
            this.page = data.body.currentPage;
            // @ts-ignore
            this.totalPages = data.body.totalPages;
            // @ts-ignore
            this.products = data.body.products;
          }else{
            this.noProductMessage = 'Brak produktów w wybranej kategorii';
          }
        })
      }else if(this.orderProductsBySelectedValue === 4){

        this.categoryService.getProductsFromCategory(page, category, limit, orderBy, orderType).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          if(data.status == 200){
            // @ts-ignore
            this.productsLimit = data.body.limit;
            // @ts-ignore
            this.productsCount = data.body.count;
            // @ts-ignore
            this.productsTotalCount = data.body.totalProducts;
            // @ts-ignore
            this.page = data.body.currentPage;
            // @ts-ignore
            this.totalPages = data.body.totalPages;
            // @ts-ignore
            this.products = data.body.products;
          }else{
            this.noProductMessage = 'Brak produktów w wybranej kategorii';
          }
        })
      }
    }else{
      if(limit !== undefined){
        if(this.orderProductsBySelectedValue === 2){
          let orderBy = "brand";
          let orderType = "DESC";
          this.productService.getAllProducts(page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
            this.productsLimit = prods.limit;
            this.productsCount = prods.count;
            this.productsTotalCount = prods.totalProducts;
            this.page = prods.currentPage;
            this.totalPages = prods.totalPages;
            this.products = prods.products;
          })
        }else if(this.orderProductsBySelectedValue === 3){
          let orderBy = "price";
          let orderType = "ASC";
          this.productService.getAllProducts(page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
            this.productsLimit = prods.limit;
            this.productsCount = prods.count;
            this.productsTotalCount = prods.totalProducts;
            this.page = prods.currentPage;
            this.totalPages = prods.totalPages;
            this.products = prods.products;
          })
        }else if(this.orderProductsBySelectedValue === 4){
          let orderBy = "price";
          let orderType = "DESC";
          this.productService.getAllProducts(page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
            this.productsLimit = prods.limit;
            this.productsCount = prods.count;
            this.productsTotalCount = prods.totalProducts;
            this.page = prods.currentPage;
            this.totalPages = prods.totalPages;
            this.products = prods.products;
          })
        }else{
          let orderBy = "brand";
          let orderType = "ASC";
          this.productService.getAllProducts(page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
            this.productsLimit = prods.limit;
            this.productsCount = prods.count;
            this.productsTotalCount = prods.totalProducts;
            this.page = prods.currentPage;
            this.totalPages = prods.totalPages;
            this.products = prods.products;
          })
        }
      }else{
        if(this.orderProductsBySelectedValue === 2){
          let orderBy = "brand";
          let orderType = "DESC";
          this.productService.getAllProducts(page, 12, orderBy, orderType).subscribe((prods: IServerResponse) => {
            this.productsLimit = prods.limit;
            this.productsCount = prods.count;
            this.productsTotalCount = prods.totalProducts;
            this.page = prods.currentPage;
            this.totalPages = prods.totalPages;
            this.products = prods.products;
          })
        }else if(this.orderProductsBySelectedValue === 3){
          let orderBy = "price";
          let orderType = "ASC";
          this.productService.getAllProducts(page, 12, orderBy, orderType).subscribe((prods: IServerResponse) => {
            this.productsLimit = prods.limit;
            this.productsCount = prods.count;
            this.productsTotalCount = prods.totalProducts;
            this.page = prods.currentPage;
            this.totalPages = prods.totalPages;
            this.products = prods.products;
          })
        }else if(this.orderProductsBySelectedValue === 4){
          let orderBy = "brand";
          let orderType = "DESC";
          this.productService.getAllProducts(page, 12, orderBy, orderType).subscribe((prods: IServerResponse) => {
            this.productsLimit = prods.limit;
            this.productsCount = prods.count;
            this.productsTotalCount = prods.totalProducts;
            this.page = prods.currentPage;
            this.totalPages = prods.totalPages;
            this.products = prods.products;
          })
        }else{
          let orderBy = "brand";
          let orderType = "ASC";
          this.productService.getAllProducts(page, 12, orderBy, orderType).subscribe((prods: IServerResponse) => {
            this.productsLimit = prods.limit;
            this.productsCount = prods.count;
            this.productsTotalCount = prods.totalProducts;
            this.page = prods.currentPage;
            this.totalPages = prods.totalPages;
            this.products = prods.products;
          })
        }
      }
    }
  }

  SelectedCategory(id: number){
    this.categoryId = id;
    this.getPage(this.page);
  }

  SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  ngOnInit(): void {


  }
}
