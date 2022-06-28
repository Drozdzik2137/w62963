import { ICategoryServerResponse, ICategoryModelServer } from './../../models/category.model';
import { CategoryService } from './../../services/category.service';
import { CartService } from './../../services/cart.service';
import { ProductService } from './../../services/product.service';
import { IProductModelServer, IServerResponse } from './../../models/product.model';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { PaginationInstance } from 'ngx-pagination';


interface FoodNode {
  name: string;
  children?: FoodNode[];
}//tree

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{name: 'Apple'}, {name: 'Banana'}, {name: 'Fruit loops'}],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{name: 'Broccoli'}, {name: 'Brussels sprouts'}],
      },
      {
        name: 'Orange',
        children: [{name: 'Pumpkins'}, {name: 'Carrots'}],
      },
    ],
  },
];//tree

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}//tree


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None,
})


export class ProductsComponent implements OnInit {
  private productsLimit: number = 0;
  private productsCount: number = 0;
  private productsTotalCount: number = 0;
  private page: number = 1;
  private totalPages: number = 0;
  private products: IProductModelServer[] = [];
  private pageEvent!: PageEvent ;
  private categories: ICategoryModelServer[] = [];
  private countCategories: number = 0;
  private loading: boolean = false;
  private orderProductsBySelectedValue: number = 1;



  ngOnInit(): void {
    this.initAllCategories();
    // this.initAllProducts();
    this.initAllProducts(this.page);
    // this.paginator._intl.itemsPerPageLabel = 'Produkty na stronę:';
  }

  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };//tree


  private treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );//tree

  private treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  ); //tree

  private dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private categoryService: CategoryService) {
    this.dataSource.data = TREE_DATA; // tree
  }


  private hasChild = (_: number, node: ExampleFlatNode) => node.expandable; // tree

  // @ViewChild(MatPaginator, { static: true })
  // paginator!: MatPaginator;


  private initAllProducts(page: number, limit?: number, orderBy?: string, orderType?: string){
    if(limit !== undefined && orderBy !== undefined && orderType !== undefined)
    {
      if(this.orderProductsBySelectedValue === 1){
        this.productService.getAllProducts(page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
          this.productsLimit = prods.limit;
          this.productsCount = prods.count;
          this.productsTotalCount = prods.totalProducts;
          this.page = prods.currentPage;
          this.totalPages = prods.totalPages;
          this.products = prods.products;
        })

      }else if(this.orderProductsBySelectedValue === 2){

        this.productService.getAllProducts(page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
          this.productsLimit = prods.limit;
          this.productsCount = prods.count;
          this.productsTotalCount = prods.totalProducts;
          this.page = prods.currentPage;
          this.totalPages = prods.totalPages;
          this.products = prods.products;
        })

      }else if(this.orderProductsBySelectedValue === 3){

        this.productService.getAllProducts(page, limit, orderBy, orderType).subscribe((prods: IServerResponse) => {
          this.productsLimit = prods.limit;
          this.productsCount = prods.count;
          this.productsTotalCount = prods.totalProducts;
          this.page = prods.currentPage;
          this.totalPages = prods.totalPages;
          this.products = prods.products;
        })
      }else if(this.orderProductsBySelectedValue === 4){

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

  private initAllCategories(){
    this.categoryService.getAllCategories().subscribe((categories: ICategoryServerResponse) => {
      this.categories = categories.categories;
      this.countCategories = categories.count;
    })
  }

  private getPage(page: number){
    this.loading = true;
    this.page = page;
    let orderBy = "brand";
    let orderType = "ASC";
    if(this.orderProductsBySelectedValue === 2){
      orderBy = "brand";
      orderType = "DESC"

      const getProducts = () =>{
        this.initAllProducts(this.page, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }if(this.orderProductsBySelectedValue === 3){
      orderBy = "price";
      orderType = "ASC"

      const getProducts = () =>{
        this.initAllProducts(this.page, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }if(this.orderProductsBySelectedValue === 4){
      orderBy = "price";
      orderType = "DESC"

      const getProducts = () =>{
        this.initAllProducts(this.page, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }else{
      const getProducts = () =>{
        this.initAllProducts(this.page, this.productsLimit, orderBy, orderType);
        this.loading = false;
      }
      window.setTimeout(getProducts, 500);
    }
    window.scroll(0,0);
  }

  // onPageChange(event: PageEvent){
  //   let page = event.pageIndex;
  //   let limit = event.pageSize;

  //   page = page + 1;
  //   this.productService.getAllProducts(page,limit).subscribe((prods: IServerResponse) => this.products = prods.products);
  //   window.scroll(0,0);
  // }

  private SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  private AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

  private goToCategory(id: number){
    const navigationExtras: NavigationExtras = {
      state: {
        categoryId: id
      }
    }
    // this.router.navigate(['/home'], {skipLocationChange: true}).then(() => {
    //   this.router.navigate(['/category'], navigationExtras);
    // })
    this.router.navigate(['/category'], navigationExtras);
  }

}
