import { IProductModelServer } from 'src/app/models/product.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrderService } from './order.service';
import { ProductService } from 'src/app/services/product.service';
import { HttpClient } from '@angular/common/http';
import { ICartModelServer, ICartModelPublic } from './../models/cart.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private SERVER_URL = 'http://localhost:4000/api';

  // Data variable to store the cart info on the local storage (in browser)
  private cartDataClient: ICartModelPublic = {
    total: 0,
    productData: [{
      inCart: 0,
      id: 0
    }]
  };

  // Data variable to store the cart info on the server
  private cartDataServer: ICartModelServer = {
    total: 0,
    data: [{
      //@ts-ignore
      product: undefined,
      numInCart: 0
    }]
  };

  // Observables for the components to "subscribe"
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<ICartModelServer>(this.cartDataServer);

  constructor(private http: HttpClient, private productService: ProductService, private orderService: OrderService, private toast: ToastrService, private spinner: NgxSpinnerService, private router: Router) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartData$.next(this.cartDataServer);

    // Get info from local storage if there are
    const info: ICartModelPublic = JSON.parse(localStorage.getItem('cart')!);

    // Check if the info variable is null or has some data
    if(info !== null && info !== undefined && info.productData[0].inCart !== 0){
      // Local storge has some info
      this.cartDataClient = info;

      // Loop through each entry put it in the cartDataServer object
      this.cartDataClient.productData.forEach(p => {
        this.productService.getSingleProduct(p.id).subscribe((actualProductInfo: IProductModelServer) => {
          if(this.cartDataServer.data[0].numInCart === 0){
            this.cartDataServer.data[0].numInCart = p.inCart;
            this.cartDataServer.data[0].product = actualProductInfo;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }else{
            // CartDataServer already has some entry in it
            this.cartDataServer.data.push({
              numInCart: p.inCart,
              product: actualProductInfo
            });
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartData$.next({...this.cartDataServer});
        })
      });
    }
  }

  AddProductToCart(id: number, quantity?: number){
    this.productService.getSingleProduct(id).subscribe(prod => {
      // If the cart is empty
      if(this.cartDataServer.data[0].product === undefined){
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = quantity !== undefined ? quantity : 1;
        this.CalculateTotal();
        this.cartDataClient.productData[0].id = prod.id;
        this.cartDataClient.productData[0].inCart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartData$.next({...this.cartDataServer});
        this.toast.success(`${prod.brand} ${prod.name} został dodany do koszyka`, 'Dodano produkt', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }else{
        // Result -1 or positive value
        const index = this.cartDataServer.data.findIndex(p => p.product.id === prod.id);

        // If these item is already in the cart then index return positive value
        if(index !== -1){
          if (quantity !== undefined && quantity <= prod.quantity) {
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.quantity ? quantity : prod.quantity;
            this.cartDataClient.productData[index].inCart = this.cartDataServer.data[index].numInCart;
            this.CalculateTotal();
            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
            this.toast.info(`Zmieniono ilość ${prod.name} w koszyku.`, 'Zaktualizowano ilość', {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })
          } else {
            if(this.cartDataServer.data[index].numInCart < prod.quantity)
            {
              this.cartDataServer.data[index].numInCart < prod.quantity ? this.cartDataServer.data[index].numInCart++ : prod.quantity;
              this.cartDataClient.productData[index].inCart = this.cartDataServer.data[index].numInCart;
              this.CalculateTotal();
              this.cartDataClient.total = this.cartDataServer.total;
              localStorage.setItem('cart', JSON.stringify(this.cartDataClient));

              this.toast.info(`Zmieniono ilość ${prod.brand} ${prod.name} w koszyku.`, 'Zaktualizowano ilość', {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              })
            }else{
              this.toast.error(`Nie można dodać wiecej sztuk ${prod.brand} ${prod.name} do koszyka.`, 'Zapasy wyczerpane', {
                timeOut: 2000,
                progressBar: true,
                progressAnimation: 'increasing',
                positionClass: 'toast-top-right'
              })
            }
          }
        } // END OF IF

        // If the item is not in the cart but cart not empty
        else{
          if(quantity !== undefined)
          {
            this.cartDataServer.data.push({
              numInCart: quantity,
              product: prod
            });

            this.cartDataClient.productData.push({
              inCart: quantity,
              id: prod.id
            });

            this.toast.success(`${prod.brand} ${prod.name} dodany do koszyka.`, `Dodano produkt`, {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })

            this.CalculateTotal();

            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
            this.cartData$.next({...this.cartDataServer});

          }else{
            this.cartDataServer.data.push({
              numInCart: 1,
              product: prod
            });

            this.cartDataClient.productData.push({
              inCart: 1,
              id: prod.id
            });

            this.toast.success(`${prod.brand} ${prod.name} dodany do koszyka.`, `Dodano produkt`, {
              timeOut: 2000,
              progressBar: true,
              progressAnimation: 'increasing',
              positionClass: 'toast-top-right'
            })

            this.CalculateTotal();

            this.cartDataClient.total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient))
            this.cartData$.next({...this.cartDataServer});
          }
        } // END OF ELSE
      }
    });
  }

  DeleteProductFromCart(index: number){
    if(window.confirm('Czy na pewno chcesz usunąć produkt z koszyka?')){
      // If user click 'yes'
        this.cartDataServer.data.splice(index, 1);
        this.cartDataClient.productData.splice(index, 1);
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;

        if(this.cartDataClient.total === 0) {
          this.cartDataClient = {
            total: 0,
            productData: [{
              id: 0,
              inCart: 0
            }]
          };
          localStorage.removeItem('cart');
        }else{
          localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        }

        if(this.cartDataServer.total == 0){
          this.cartDataServer = {
            total: 0,
            data: [{
              numInCart: 0,
              product: undefined!
            }]
          };
          this.cartData$.next({...this.cartDataServer});
        }else{
          this.cartData$.next({...this.cartDataServer});
        }
        this.toast.success(`Usunięto produkt z koszyka.`, 'Powodzenie', {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })

    }else{
      // If user click 'no'
      if(this.cartDataServer.data[index].numInCart <= 1){
        this.cartDataServer.data[index].numInCart = 1
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  UpdateProductQuantityFromCart(index: number, increase: boolean){
    let data = this.cartDataServer.data[index];

    if(increase) {
      data.numInCart < data.product.quantity ? data.numInCart++ : data.product?.quantity;
      this.cartDataClient.productData[index].inCart = data.numInCart;
      this.CalculateTotal();
      this.cartDataClient.total = this.cartDataServer.total
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      this.cartData$.next({...this.cartDataServer});
      if(data.numInCart === data.product.quantity){
        this.toast.error(`Nie możesz zwiększyć ilości produktu w koszyku.`, 'Ups...', {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        })
      }
    }else{
      data.numInCart--;

      if (data.numInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartData$.next({ ...this.cartDataServer });
      } else {
        this.cartData$.next({ ...this.cartDataServer });
        this.cartDataClient.productData[index].inCart = data.numInCart;
        this.CalculateTotal();
        this.cartDataClient.total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }
    }
  }

  CheckoutFromCart(userId: number){
    this.http.post(`${this.SERVER_URL}/order/payment`, null).subscribe((res: {success?: boolean}) => {
      if(res.success){
        this.resetServerData();
        this.http.post(`${this.SERVER_URL}/order/new`, {
          userId: userId,
          products: this.cartDataClient.productData,
          total: this.cartDataClient.total
        }).subscribe((data: any) => {
        this.orderService.getSingleOrder(data.order_id).then(prods => {
          if(data) {
            const navigationExtras: NavigationExtras = {
              state: {
                message: data.message,
                products: prods,
                orderId: data.order_id,
                total: this.cartDataClient.total
              }
            };

            this.spinner.hide().then();
            this.router.navigate(['/thankyou'], navigationExtras).then(p=> {
              this.cartDataClient = {
                total: 0,
                productData: [{ inCart: 0, id: 0 }]
              };
              this.cartTotal$.next(0);
              localStorage.removeItem('cart');
            });
          }
        })});

      }else{
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error('Ups, nie udało się złożyć zamówienia', 'Niepowodzenie',{
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }


  private CalculateTotal() {
    let total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {price} = p.product;

      total += numInCart * price;
    });
    this.cartDataServer.total = total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  SubTotal(index: number){
    let subTotal = 0;

    const p = this.cartDataServer.data[index];
    subTotal = p.product.price * p.numInCart;
    return subTotal
  }

  private resetServerData() {
    this.cartDataServer = {
      total: 0,
      data: [{
        numInCart: 0,
        product: undefined!
      }]
    };
    this.cartData$.next({...this.cartDataServer});
  }

}
