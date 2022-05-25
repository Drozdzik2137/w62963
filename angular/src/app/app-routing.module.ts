import { RoleGuard } from './guard/role.guard';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { UserOrderDetailsComponent } from './components/user-order-details/user-order-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ThankYouForTheOrderComponent } from './components/thank-you-for-the-order/thank-you-for-the-order.component';
import { UserComplaintsReturnsComponent } from './components/user-complaints-returns/user-complaints-returns.component';
import { UserOrderHistoryComponent } from "./components/user-order-history/user-order-history.component";
import { ProfileGuard } from './guard/profile.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CartComponent } from './components/cart/cart.component';
import { ContactComponent } from './components/contact/contact.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';

import { SingleProductComponent } from './components/single-product/single-product.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';

const routes: Routes = [
  {
    path:'', component: HomeComponent
  },
  {
    path: 'product/:id', component: SingleProductComponent
  },
  {
    path: 'products', component: ProductsComponent
  },
  {
    path: 'categories', component: CategoriesComponent
  },
  {
    path: 'contact', component: ContactComponent
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'profile', component: ProfileComponent, canActivate:[ProfileGuard]
  },
  {
    path: 'orders', component: UserOrderHistoryComponent, canActivate:[ProfileGuard]
  },
  {
    path: 'returns', component: UserComplaintsReturnsComponent, canActivate:[ProfileGuard]
  },
  {
    path: 'checkout', component: CheckoutComponent, canActivate:[ProfileGuard]
  },
  {
    path: 'thankyou', component: ThankYouForTheOrderComponent, canActivate:[ProfileGuard]
  },
  {
    path: 'details', component: UserOrderDetailsComponent, canActivate:[ProfileGuard]
  },
  {
    path: 'admin', component: AdminPanelComponent, canActivate: [RoleGuard]
  },
  { path: '**',
  redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
