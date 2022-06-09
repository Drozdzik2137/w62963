import { ICategoryServerResponse, ICategoryModelServer } from './../../models/category.model';
import { CategoryService } from './../../services/category.service';
import { CartService } from './../../services/cart.service';
import { ProductService } from './../../services/product.service';
import { IProductModelServer, IServerResponse } from './../../models/product.model';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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
  productsLimit: number = 0;
  productsCount: number = 0;
  productsTotalCount: number = 0;
  page: number = 1;
  totalPages: number = 0;
  products: IProductModelServer[] = [];
  pageEvent!: PageEvent ;
  categories: ICategoryModelServer[] = [];
  countCategories: number = 0;
  loading: boolean = false;
  orderProductsBySelectedValue: number = 1;



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


  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );//tree

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  ); //tree

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private categoryService: CategoryService) {
    this.dataSource.data = TREE_DATA; // tree
  }


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable; // tree

  // @ViewChild(MatPaginator, { static: true })
  // paginator!: MatPaginator;


  initAllProducts(page: number, limit?: number, orderBy?: string, orderType?: string){
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

  initAllCategories(){
    this.categoryService.getAllCategories().subscribe((categories: ICategoryServerResponse) => {
      this.categories = categories.categories;
      this.countCategories = categories.count;
    })
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

  SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

}
