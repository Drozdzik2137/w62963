import { IProductModelServer } from 'src/app/models/product.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { IOrderModelServer } from './../../models/order.model';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderService } from './../../services/order.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map, catchError, of } from 'rxjs';
import { IOrderServerResponse } from 'src/app/models/order.model';
import { IUserResponseModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  helper=  new JwtHelperService();
  userData!: IUserResponseModel;
  isFontsLoaded!: boolean;
  displayedColumns: string[] = ['id', 'email', 'phone', 'createdAt', 'status', 'manage'];
  dataSource!: MatTableDataSource<IOrderModelServer>;
  ordersCount: number = 0;
  orders: IOrderModelServer[] = [];


  constructor(private userService: UserService, private orderService: OrderService, private dialog: MatDialog, private router: Router, private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel="Kategorie na stronę: ";

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

    this.orderService.getAllOrders().subscribe((orders: IOrderServerResponse) => {
      this.dataSource = new MatTableDataSource<IOrderModelServer>(orders.orders);
      this.orders = orders.orders;
      this.ordersCount = orders.count;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showOrder(row: any){
    const dialogRef = this.dialog.open(ShowOrderDetailsDialog, {
      width: '1000px',
      data: row
    });
    // this.orderService.getSingleOrder(id)
  }

  editOrder(row: any){
    const dialogRef = this.dialog.open(EditOrderStatusDialog, {
      width: '350px',
      data: row
    });

    let orderId = row.id;

    dialogRef.afterClosed().subscribe(data => {
      if(data !== undefined){
        this.orderService.updateOrderStatus(orderId, data.orderStatus).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          let updatedOrderStatus = data.status;
          if(updatedOrderStatus == 200){
            //@ts-ignore
            let successMessage = data.body.message;
            this.toast.success(`${successMessage}`, 'Udane', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-orders']);
            });
          }else{
            this.toast.error(`Nie udało się zmienić statusu zamówienia`, 'Niepowodzenie', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-orders']);
            });
          }
        })
      }
    })

  }


}

@Component({
  selector: 'show-order-details',
  templateUrl: 'show-order-details.html',
  styleUrls: ['./show-order-details.css']
})
export class ShowOrderDetailsDialog {
  orderId: any;
  orderStatus: any;
  products: any;
  total: any

  constructor(public dialogRef: MatDialogRef<EditOrderStatusDialog>, private orderService: OrderService, private productService: ProductService,
     @Inject(MAT_DIALOG_DATA) public data: IOrderModelServer){}

  ngOnInit(): void {
    this.orderService.getSingleOrderTotal(this.data.id).subscribe(total => this.total = total);
    this.orderService.getSingleOrder(this.data.id).then(prods => {
      console.log(this.data.id, this.data, prods);
      this.products = prods;
      this.orderId = this.data.id;
      this.orderStatus = this.data.status;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}



@Component({
  selector: 'edit-order-status',
  templateUrl: 'edit-order-status.html'
})
export class EditOrderStatusDialog {
  dataForm = new FormGroup({
    orderStatus: new FormControl('', [Validators.required])
  });

  constructor(public dialogRef: MatDialogRef<EditOrderStatusDialog>,
     @Inject(MAT_DIALOG_DATA) public data: IOrderModelServer){}

  ngOnInit(): void {
    if(this.data){
      this.dataForm.controls['orderStatus'].setValue(this.data.status);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(){
    if(this.dataForm.valid){
      this.dialogRef.close(this.dataForm.value);
    }

  }
}


