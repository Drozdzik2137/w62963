import { IBrandModelServer, IBrandServerResponse } from './../../models/brand.model';
import { CategoryService } from './../../services/category.service';
import { ICategoryModelServer, ICategoryServerResponse } from './../../models/category.model';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product.service';
import { IProductModelServer, IServerResponse } from 'src/app/models/product.model';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, startWith, switchMap, catchError, of } from 'rxjs';
import { IUserResponseModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  private dataSource!: MatTableDataSource<IProductModelServer>;
  private displayedColumns: string[] = ['id', 'img', 'brand', 'name', 'category', 'size', 'quantity', 'price', 'manage'];
  private helper=  new JwtHelperService();
  private isFontsLoaded!: boolean;
  @ViewChild(MatPaginator, { static: true }) private paginator!: MatPaginator;
  private products: IProductModelServer[] = [];
  private productsCount: number = 0;
  @ViewChild(MatSort) private sort!: MatSort;
  private userData!: IUserResponseModel;
  constructor(private router: Router, private userService: UserService, private productService: ProductService, private dialog: MatDialog, private toast: ToastrService) {}

  private applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private deleteProduct(row: any){
    const dialogRef =  this.dialog.open(DeleteDialog, {
      width: '350px',
      data: row
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== undefined){
        if(confirm('Na pewno chcesz usunąć produkt? Zabieg jest nieodwracalny!')){
          this.productService.deleteProduct(data).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
            let prodDeleteStatus = data.status;
            if(prodDeleteStatus == 200){
              this.toast.success(`Pomyślnie usunięto produkt`, 'Udane', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              });
              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/admin-products']);
              });
            }else{
              this.toast.error(`Nie udało się usunąć produktu`, 'Niepowodzenie', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              });
              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/admin-products']);
              });
            }
          })
        }
      }
    });

  }

  private editProduct(row: any){
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '350px',
      data: row
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== undefined){
        this.productService.updateProduct(data.prodId, data.prodName, data.prodImg, parseFloat(data.prodPrice).toFixed(2), data.prodQuantity, data.prodShortDesc,
          data.prodDescription, data.prodSize, data.prodBrand, data.prodCategory, data.prodImages, data.prodFreshness).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
            let productUpdateStatus = data.status;
            if(productUpdateStatus == 200){
              //@ts-ignore
              let successMessage = data.body.message;
              this.toast.success(`${successMessage}`, 'Udane', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              });
              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/admin-products']);
              });
            }else{
              this.toast.error(`Nie udało się zaktualizować produktu`, 'Niepowodzenie', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              });
              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/admin-products']);
              });
            }
          })
      }
    })

  }

  private openDialog(){
    const dialogRef = this.dialog.open(ProductDialog, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== undefined){
        this.productService.addProduct(data.prodName, data.prodImg, parseFloat(data.prodPrice).toFixed(2), data.prodQuantity, data.prodShortDesc,
        data.prodDescription, data.prodSize, data.prodBrand, data.prodCategory, data.prodImages, data.prodFreshness).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          let productAddStatus = data.status;
          if(productAddStatus == 200){
            //@ts-ignore
            let successMessage = data.body.message;
            this.toast.success(`${successMessage}`, 'Udane', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-products']);
            });
          }else{
            this.toast.error(`Nie udało się dodać produktu`, 'Niepowodzenie', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-products']);
            });
          }
        })
      }
    })
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Produkty na stronę: ";
    document.fonts.ready.then(() => (this.isFontsLoaded = true));

    this.userService.userData$.pipe(map((user: IUserResponseModel) => {
      return user;
    })).subscribe((data: IUserResponseModel) => {
      if(!data){
        const token = localStorage.getItem('authToken');
        if(token){
          const userToken = this.helper.decodeToken(token)
          this.userService.getUser(userToken.id).subscribe((user: IUserResponseModel) => {
            this.userData = user;
          })
        }
      }else{
        this.userData = data;
      }
    })

    this.productService.getAllProductsAdmin().subscribe((prods: IServerResponse) => {
      this.dataSource = new MatTableDataSource<IProductModelServer>(prods.products);
      this.products = prods.products;
      this.productsCount = prods.count;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })



  }
}


@Component({
  selector: 'product-dialog',
  templateUrl: 'product-dialog.html'
})
export class ProductDialog {
  private actionBtn: string = 'Dodaj';
  private actionLabel: string = 'Dodawanie'
  private brands: IBrandModelServer[] = [];
  private categories: ICategoryModelServer[] = [];
  private dataForm = new FormGroup({
    prodId: new FormControl(''),
    prodName: new FormControl('', [Validators.required]),
    prodImg: new FormControl('', [Validators.required]),
    prodPrice: new FormControl('', [Validators.required, Validators.pattern('^([0-9]*\.[0-9]{2})')]),
    prodQuantity: new FormControl('', [Validators.required, Validators.pattern('[0-9]*')]),
    prodShortDesc: new FormControl('',),
    prodDescription: new FormControl('', [Validators.required]),
    prodSize: new FormControl('', [Validators.required]),
    prodBrand: new FormControl('', [Validators.required]),
    prodCategory: new FormControl('', [Validators.required]),
    prodImages: new FormControl('', [Validators.required]),
    prodFreshness: new FormControl('', [Validators.required])
  });
  constructor(public dialogRef: MatDialogRef<ProductDialog>, private categoryService: CategoryService, private productService: ProductService,
     @Inject(MAT_DIALOG_DATA) public data: IProductModelServer){}

  private ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((categories: ICategoryServerResponse) => {
      this.categories = categories.categories;
    })

    this.productService.getAllBrands().subscribe((brands: IBrandServerResponse) => {
      this.brands = brands.brands;
    })

    if(this.data){
      this.actionBtn = "Zmień"
      this.actionLabel = 'Edytowanie'

      this.productService.getSingleProduct(this.data.id).subscribe((product: IProductModelServer) => {
        this.dataForm.controls['prodId'].setValue(this.data.id);
        this.dataForm.controls['prodName'].setValue(this.data.name);
        this.dataForm.controls['prodImg'].setValue(this.data.img);
        this.dataForm.controls['prodPrice'].setValue(this.data.price);
        this.dataForm.controls['prodQuantity'].setValue(this.data.quantity);
        this.dataForm.controls['prodShortDesc'].setValue(product.shortdesc);
        this.dataForm.controls['prodDescription'].setValue(product.description);
        this.dataForm.controls['prodSize'].setValue(product.size);
        this.dataForm.controls['prodBrand'].setValue(product.brand_id);
        this.dataForm.controls['prodCategory'].setValue(product.category_id);
        this.dataForm.controls['prodImages'].setValue(product.images);
        this.dataForm.controls['prodFreshness'].setValue(product.freshness);
      })
    }
  }

  private onNoClick(): void {
    this.dialogRef.close();
  }

  private onSaveClick(){
    if(this.dataForm.valid){
      this.dialogRef.close(this.dataForm.value);
    }
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html'
})
export class DeleteDialog {
  private dataForm = new FormGroup({
    confirm: new FormControl('', [Validators.required, Validators.pattern('na pewno')])
  });


  constructor(public dialogRef: MatDialogRef<ProductDialog>,
     @Inject(MAT_DIALOG_DATA) public data: IProductModelServer){}


  private onNoClick(): void {
    this.dialogRef.close();
  }

  private onSaveClick(){
    if(this.dataForm.valid){
      this.dialogRef.close(this.data.id);
    }
  }
}
