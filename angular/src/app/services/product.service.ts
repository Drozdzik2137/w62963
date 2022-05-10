import { IProductModelServer, IServerResponse } from 'src/app/models/product.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private SERVER_URL = 'http://localhost:4000/api';
  constructor(private http: HttpClient) { }

  getNewProducts(): Observable<IServerResponse>{
    return this.http.get<IServerResponse>(this.SERVER_URL + '/newProducts');
  }

  getSingleProduct(id: number): Observable<IProductModelServer>{
    return this.http.get<IProductModelServer>(this.SERVER_URL + '/product/' + id);
  }

  getAllProducts(page: number, limit: number, orderBy: string, orderType: string): Observable<IServerResponse> {
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    params = params.append('orderBy', String(orderBy));
    params = params.append('orderType', String(orderType));

    return this.http.get<IServerResponse>(this.SERVER_URL + '/products', {params}).pipe(
      map((prods: IServerResponse) => prods),
      catchError(err=> throwError(err))
    );
  }
}
