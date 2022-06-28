import { UserService } from './../../services/user.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ICartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private cartData!: ICartModelServer;
  private cartTotal!: number;
  private isLoggedIn!: boolean;

  private searchForm = new FormGroup({
    searchValue: new FormControl('')
  });


  constructor(public cartService: CartService, private router: Router, public userService: UserService) { }

  private logout(){
    this.userService.logout();
  }

  private onSubmit(){
    let searchInput = this.searchForm.controls['searchValue'].value;
    const navigationExtras: NavigationExtras = {
      state: {
        searchInput: searchInput
      }
    }
    //this.router.navigate(['/search'], navigationExtras);
    this.router.navigate(['/home'], {skipLocationChange: true}).then(() => {
      this.router.navigate(['/search'], navigationExtras);
    })
    this.searchForm.reset();
  }

  private SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total=>{
      this.cartTotal = total;
    });

    this.cartService.cartData$.subscribe(data=> this.cartData = data);

    this.userService.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }
}
