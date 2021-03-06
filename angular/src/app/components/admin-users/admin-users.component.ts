import { HttpErrorResponse } from '@angular/common/http';
import { IUserAdminResponseServer, IUserAdminResponseModel } from './../../models/user.model';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';
import { map, catchError, of } from 'rxjs';
import { IUserResponseModel } from 'src/app/models/user.model';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  helper=  new JwtHelperService();
  userData!: IUserResponseModel;
  isFontsLoaded!: boolean;
  displayedColumns: string[] = ['id', 'email', 'phone', 'fname', 'lname', 'createdAt', 'isAdmin', 'manage'];
  dataSource!: MatTableDataSource<IUserAdminResponseModel>;
  usersCount: number = 0;
  users: IUserAdminResponseModel[] = [];

  constructor(private userService: UserService, private dialog: MatDialog, private router: Router, private toast: ToastrService) {
  }

  ngOnInit(): void {
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

    this.userService.getAllUsers().subscribe((users: IUserAdminResponseServer) => {
      this.dataSource = new MatTableDataSource<IUserAdminResponseModel>(users.users);
      this.users = users.users;
      this.usersCount = users.count;
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

  deleteUser(row: any){
    const dialogRef =  this.dialog.open(DeleteUserAdminDialog, {
      width: '350px',
      data: row
    });

    let userId = row.id;
    let userEmail = row.email;

    dialogRef.afterClosed().subscribe(data => {
      if(data == true){
        if(confirm(`Na pewno chcesz usun???? konto u??ytkownika ${userEmail} o ID: ${userId}`)){
         this.userService.deleteUserAccount(userId).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
           let userAdminDeleteStatus = data.status;
           if(userAdminDeleteStatus == 200){
            this.toast.success(`Pomy??lnie usuni??to konto u??ytkownika`, 'Uadane', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-users']);
            });
           }else{
            this.toast.error(`Nie uda??o si?? usun???? konta u??ytkownika: ${userEmail}`, 'Niepowodzenie', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            });
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/admin-users']);
            });
           }
         })
        }
      }
    })

  }

}


@Component({
  selector: 'delete-user-dialog',
  templateUrl: 'delete-user-dialog.html'
})
export class DeleteUserAdminDialog {
  dataForm = new FormGroup({
    confirm: new FormControl('', [Validators.required, Validators.pattern('na pewno')])
  });


  constructor(public dialogRef: MatDialogRef<DeleteUserAdminDialog>,
     @Inject(MAT_DIALOG_DATA) public data: IUserAdminResponseModel){}


  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(){
    if(this.dataForm.valid){
      this.dialogRef.close(true);
    }
  }
}

