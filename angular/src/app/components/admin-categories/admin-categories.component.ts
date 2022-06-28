import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CategoryService } from './../../services/category.service';
import { ICategoryModelServer, ICategoryServerResponse } from './../../models/category.model';
import { UserService } from 'src/app/services/user.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUserResponseModel } from 'src/app/models/user.model';
import { map, catchError, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
  categories: ICategoryModelServer[] = [];
  categoriesCount: number = 0;
  dataSource!: MatTableDataSource<ICategoryModelServer>;
  displayedColumns: string[] = ['id', 'name', 'manage'];
  helper=  new JwtHelperService();
  isFontsLoaded!: boolean;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userData!: IUserResponseModel;
  constructor(private userService: UserService, private categoryService: CategoryService, private dialog: MatDialog, private toast: ToastrService, private router: Router) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCategory(row: any){
    const dialogRef =  this.dialog.open(DeleteCategoryDialog, {
      width: '350px',
      data: row
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== undefined){
        if(confirm('Na pewno chcesz usunąć kategorie? Zabiej jest nieodwracalny!')){
          this.categoryService.deleteCategory(data).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
            let categoryDeleteStatus = data.status;
            if(categoryDeleteStatus == 200){
              this.toast.success(`Pomyślnie usunięto kategorie`, 'Uadane', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              });
              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/admin-categories']);
              });
            }else{
              this.toast.error(`Nie udało się usunąć kategorii`, 'Niepowodzenie', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              });
              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/admin-categories']);
              });
            }
          })
        }
      }
    })
  }

  editCategory(row: any){
    const dialogRef = this.dialog.open(CategoryDialog, {
      width: '350px',
      data: row
    });

    let categoryId = row.id;

    dialogRef.afterClosed().subscribe(data => {
      if(data !== undefined){
        this.categoryService.updateCategory(categoryId, data.categoryName).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          let categoryUpdateStatus = data.status;
          if(categoryUpdateStatus == 200){
            //@ts-ignore
            let successMessage = data.body.message;
            this.toast.success(`${successMessage}`, 'Udane', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-categories']);
            });

          }else{
            this.toast.error(`Nie udało się edytować kategorii`, 'Niepowodzenie', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-categories']);
            });
          }
        })
      }
    })

  }

  openDialog(){
    const dialogRef = this.dialog.open(CategoryDialog, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(data => {
      if(data !== undefined){
        this.categoryService.addCategory(data.categoryName).pipe(catchError((err:HttpErrorResponse) => of(err))).subscribe(data => {
          let addCategoryStatus = data.status;
          if(addCategoryStatus == 200){
            //@ts-ignore
            let successMessage = data.body.message;
            this.toast.success(`${successMessage}`, 'Udane', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-categories']);
            });

          }else{
            // @ts-ignore
            let errorCategoryMessage = data.error.message;
            this.toast.error(`${errorCategoryMessage}`, 'Nieudane', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-categories']);
            });
          }
        })
      }
    })

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

    this.categoryService.getAllCategories().subscribe((categories: ICategoryServerResponse) => {
      this.dataSource = new MatTableDataSource<ICategoryModelServer>(categories.categories);
      this.categories = categories.categories;
      this.categoriesCount = categories.count;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
}

@Component({
  selector: 'category-dialog',
  templateUrl: 'category-dialog.html'
})
export class CategoryDialog {
  actionBtn: string = 'Dodaj';
  actionLabel: string = 'Dodawanie'
  dataForm = new FormGroup({
    categoryName: new FormControl('', [Validators.required])
  });

  constructor(public dialogRef: MatDialogRef<CategoryDialog>,
     @Inject(MAT_DIALOG_DATA) public data: ICategoryModelServer){}

  ngOnInit(): void {
    if(this.data){
      this.actionBtn = "Zmień"
      this.actionLabel = 'Edytowanie'
      this.dataForm.controls['categoryName'].setValue(this.data.name);
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

@Component({
  selector: 'delete-category-dialog',
  templateUrl: 'delete-category-dialog.html'
})
export class DeleteCategoryDialog {
  dataForm = new FormGroup({
    confirm: new FormControl('', [Validators.required, Validators.pattern('na pewno')])
  });


  constructor(public dialogRef: MatDialogRef<CategoryDialog>,
     @Inject(MAT_DIALOG_DATA) public data: ICategoryModelServer){}


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(){
    if(this.dataForm.valid){
      this.dialogRef.close(this.data.id);
    }
  }
}

