import { UserService } from './../../services/user.service';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICartModelServer } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  cartData!: ICartModelServer;
  cartTotal!: number;
  isLoggedIn!: boolean;


  constructor(public cartService: CartService, private router: Router, public userService: UserService) { }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total=>{
      this.cartTotal = total;
    });

    this.cartService.cartData$.subscribe(data=> this.cartData = data);

    this.userService.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
  }

  SelectProduct(id: number){
    this.router.navigate(['/product', id]).then();
  }

  logout(){
    this.userService.logout();
  }

}
