import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { IUserResponseModel } from './../../models/user.model';
import { UserService } from './../../services/user.service';
import { Component, Inject, OnInit } from '@angular/core';
import { map, catchError, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface EditDataDialog{
  fname: string;
  lname: string;
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userData!: IUserResponseModel;
  helper = new JwtHelperService();
  fname!: string;
  lname!: string;
  password!: string;

  constructor(private userService: UserService, public dialog: MatDialog, private toast: ToastrService, private router: Router) { }

  ngOnInit(): void {
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
  }

  openDataDialog(): void {
    const dialogRef = this.dialog.open(EditDataDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.fnameForm !== undefined && result.lnameForm !== undefined){
        this.userService.changeUserData(this.userData.userId, result.fnameForm, result.lnameForm).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          let userChangeDataStatus = data.status;
          if(userChangeDataStatus == 200){
            // @ts-ignore
            let successMessage = data.body.message;
            this.toast.success(`${successMessage}`, 'Udane', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/profile']);
            })
          }else{
            //@ts-ignore
            let errorMessage = data.error.message;
            if(errorMessage != null)
            this.toast.error(`${errorMessage}`, 'Niepowodzenie', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })
          }
        })
      }
    })

  }

  openPasswordDialog(): void {
    const dialogRef = this.dialog.open(EditPasswordDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.oldPassword !== undefined && result.newPassword !== undefined){
        this.userService.changeUserPassword(this.userData.userId, result.oldPassword, result.newPassword).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
          let userChangePasswordStatus = data.status;
          if(userChangePasswordStatus == 200){
            // @ts-ignore
            let successMessage = data.body.message;
            this.toast.success(`${successMessage}`, 'Udane', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })
            this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
              this.router.navigate(['/profile']);
            })
          }else{
            //@ts-ignore
            let errorMessage = data.error.message;
            if(errorMessage != null)
            this.toast.error(`${errorMessage}`, 'Niepowodzenie', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })
          }
        })
      }
    })
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteUserDialog, {
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(next => {
      if(next == true){
        if(confirm('Na pewno chcesz usunąć konto? Zabieg jest nieodwracalny!')){
          this.userService.deleteUserAccount(this.userData.userId).pipe(catchError((err: HttpErrorResponse) => of(err))).subscribe(data => {
            let userDeleteStatus = data.status;
            if(userDeleteStatus == 200){
              // @ts-ignore
              let successMessage = data.body.message;
              this.toast.success(`${successMessage}`, 'Pomyślnie usunięto konto', {
                timeOut: 5000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              })
              this.userService.logout();
              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/register']);
              })
            }else{
            this.toast.error(`Nie udało się usunąć konta`, 'Niepowodzenie', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })
            }
          })
        }
      }
    })

  }

}

@Component({
  selector: 'edit-data-dialog',
  templateUrl: 'edit-data-dialog.html'
})
export class EditDataDialog {
  fname: string = '';
  lname: string = '';
  editDataForm = new FormGroup({
    fnameForm: new FormControl(this.fname, [Validators.required]),
    lnameForm: new FormControl(this.lname, [Validators.required])
  });


  constructor(public dialogRef: MatDialogRef<EditDataDialog>,
     @Inject(MAT_DIALOG_DATA) public data: EditDataDialog){}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(){
    if(this.editDataForm.valid){
      this.dialogRef.close(this.editDataForm.value)
    }
  }
}

@Component({
  selector: 'edit-password-dialog',
  templateUrl: 'edit-password-dialog.html'
})
export class EditPasswordDialog {
  editPasswordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });


  constructor(public dialogRef: MatDialogRef<EditPasswordDialog>,
     @Inject(MAT_DIALOG_DATA) public data: EditPasswordDialog){}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(){
    if(this.editPasswordForm.valid){
      this.dialogRef.close(this.editPasswordForm.value);
    }
  }
}

@Component({
  selector: 'delete-user-dialog',
  templateUrl: 'delete-user-dialog.html'
})
export class DeleteUserDialog {
  confirmForm = new FormGroup({
    confirm: new FormControl('', [Validators.required, Validators.pattern('na pewno')])
  })


  constructor(public dialogRef: MatDialogRef<EditPasswordDialog>,
     @Inject(MAT_DIALOG_DATA) public data: EditPasswordDialog){}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(){
    if(this.confirmForm.valid){
      this.dialogRef.close(true);
    }
  }
}

