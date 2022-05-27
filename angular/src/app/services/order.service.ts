import { Observable, catchError, throwError, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IProductModelServer } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Injectable } from '@angular/core';
import { ICheckoutOrderResponseModel, IOrderServerResponse } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private SERVER_URL = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  getUserOrders(id: number, page: number, limit: number, orderType: string){
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    params = params.append('orderType', String(orderType));

    return this.http.get<IOrderServerResponse>(`${this.SERVER_URL}/order/user/` + id, {params}).pipe(
      map((orders: IOrderServerResponse) => orders),
      catchError(err => throwError(err))
    );
  }

  getSingleOrder(orderId: number){
    return this.http.get<ICheckoutOrderResponseModel[]>(`${this.SERVER_URL}/order/${orderId}`).toPromise();
  }

  getSingleOrderTotal(orderId: number){
    return this.http.get(`${this.SERVER_URL}/orderTotal/` + orderId);
  }

  getAllOrders(){
    return this.http.get<IOrderServerResponse>(`${this.SERVER_URL}/allOrders`);
  }

  updateOrderStatus(id:number, orderStatus: string){
    return this.http.patch(`${this.SERVER_URL}/order/` + id, {orderStatus}, {observe: 'response'});
  }
}
