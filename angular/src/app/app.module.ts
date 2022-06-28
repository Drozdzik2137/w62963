import { HttpClientJsonpModule, HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { SingleProductComponent } from './components/single-product/single-product.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { ContactComponent } from './components/contact/contact.component';
import { CartComponent } from './components/cart/cart.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatPaginatorModule} from '@angular/material/paginator';
import { StylePaginatorDirective } from './components/products/style-paginator.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTreeModule } from '@angular/material/tree';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent, EditDataDialog, EditPasswordDialog, DeleteUserDialog, EditPhoneDialog } from './components/profile/profile.component';
import { JwtModule } from "@auth0/angular-jwt";
import { UserComplaintsReturnsComponent } from './components/user-complaints-returns/user-complaints-returns.component';
import { ThankYouForTheOrderComponent } from './components/thank-you-for-the-order/thank-you-for-the-order.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { UserOrderDetailsComponent } from './components/user-order-details/user-order-details.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { MatListModule } from '@angular/material/list';
import { AdminProductsComponent, ProductDialog, DeleteDialog } from './components/admin-products/admin-products.component';
import { AdminCategoriesComponent, CategoryDialog, DeleteCategoryDialog } from './components/admin-categories/admin-categories.component';
import { AdminOrdersComponent, EditOrderStatusDialog, ShowOrderDetailsDialog } from './components/admin-orders/admin-orders.component';
import { AdminUsersComponent, DeleteUserAdminDialog } from './components/admin-users/admin-users.component';
import { MatSortModule } from '@angular/material/sort';
import { SearchProductsComponent } from './components/search-products/search-products.component';
import { ProductsByCategoryComponent } from './components/products-by-category/products-by-category.component';
import { UserOrderHistoryComponent } from './components/user-order-history/user-order-history.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    SingleProductComponent,
    ScrollToTopComponent,
    ProductsComponent,
    CategoriesComponent,
    ContactComponent,
    CartComponent,
    StylePaginatorDirective,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    UserComplaintsReturnsComponent,
    ThankYouForTheOrderComponent,
    CheckoutComponent,
    UserOrderDetailsComponent,
    UserOrderHistoryComponent,
    EditDataDialog,
    EditPasswordDialog,
    DeleteUserDialog,
    AdminPanelComponent,
    AdminProductsComponent,
    AdminCategoriesComponent,
    AdminOrdersComponent,
    AdminUsersComponent,
    ProductDialog,
    DeleteDialog,
    CategoryDialog,
    DeleteCategoryDialog,
    EditOrderStatusDialog,
    EditPhoneDialog,
    DeleteUserAdminDialog,
    ShowOrderDetailsDialog,
    SearchProductsComponent,
    ProductsByCategoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatBadgeModule,
    GoogleMapsModule,
    HttpClientJsonpModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatTableModule,
    MatTreeModule,
    NgxPaginationModule,
    MatSelectModule,
    MatDialogModule,
    MatCardModule,
    MatListModule,
    MatSortModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
