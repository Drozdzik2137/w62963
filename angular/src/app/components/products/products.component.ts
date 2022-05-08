import { ICategoryServerResponse, ICategoryModelServer } from './../../models/category.model';
import { CategoryService } from './../../services/category.service';
import { CartService } from './../../services/cart.service';
import { ProductService } from './../../services/product.service';
import { IProductModelServer, IServerResponse } from './../../models/product.model';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

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
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  encapsulation: ViewEncapsulation.None
})


export class ProductsComponent implements OnInit {

  productsLimit: number = 0;
  productsCount: number = 0;
  productsTotalCount: number = 0;
  currentPage: number = 0;
  totalPages: number = 0;
  products: IProductModelServer[] = [];
  pageEvent!: PageEvent ;
  categories: ICategoryModelServer[] = [];
  countCategories: number = 0;
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };


  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private productService: ProductService, private router: Router, private cartService: CartService, private categoryService: CategoryService) {
    this.dataSource.data = TREE_DATA;
  }


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;


  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  ngOnInit(): void {
    this.initAllCategories();
    this.initAllProducts();
    this.paginator._intl.itemsPerPageLabel = 'Produkty na stronę:';
  }

  initAllProducts(){
    this.productService.getAllProducts(1,12).subscribe((prods: IServerResponse) => {
      this.productsLimit = prods.limit;
      this.productsCount = prods.count;
      this.productsTotalCount = prods.totalProducts;
      this.currentPage = prods.currentPage;
      this.totalPages = prods.totalPages;
      this.products = prods.products;
    })
  }

  initAllCategories(){
    this.categoryService.getAllCategories().subscribe((categories: ICategoryServerResponse) => {
      this.categories = categories.categories;
      this.countCategories = categories.count;
    })
  }

  onPageChange(event: PageEvent){
    let page = event.pageIndex;
    let limit = event.pageSize;

    page = page + 1;
    this.productService.getAllProducts(page,limit).subscribe((prods: IServerResponse) => this.products = prods.products);
    window.scroll(0,0);
  }

  SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  AddToCart(id: number){
    this.cartService.AddProductToCart(id);
  }

}
