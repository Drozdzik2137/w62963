import { IBrandServerResponse } from './../models/brand.model';
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

  getAllProductsAdmin(): Observable<IServerResponse>{
    return this.http.get<IServerResponse>(this.SERVER_URL + '/allProducts').pipe(
      map((prods: IServerResponse) => prods),
      catchError(err => throwError(err))
    );
  }

  addProduct(prodName: string, prodImg: string, prodPrice: string, prodQuantity: number,
    prodShortDesc: string, prodDescription: string, prodSize: string, prodBrand: number, prodCategory: number,
    prodImages: string, prodFreshness: string){
    return this.http.post(`${this.SERVER_URL}/product`, {prodName, prodImg, prodPrice, prodQuantity, prodShortDesc, prodDescription,
      prodSize, prodBrand, prodCategory, prodImages, prodFreshness},  {observe: 'response'});

  }

  updateProduct(id: number, prodName: string, prodImg: string, prodPrice: string, prodQuantity: number,
    prodShortDesc: string, prodDescription: string, prodSize: string, prodBrand: number, prodCategory: number,
    prodImages: string, prodFreshness: string){
    return this.http.patch(`${this.SERVER_URL}/product/` + id, {prodName, prodImg, prodPrice, prodQuantity, prodShortDesc, prodDescription,
      prodSize, prodBrand, prodCategory, prodImages, prodFreshness},  {observe: 'response'});
  }

  deleteProduct(id: number){
    return this.http.delete(`${this.SERVER_URL}/product/` + id, {observe: 'response'});
  }

  getAllBrands(){
    return this.http.get<IBrandServerResponse>(`${this.SERVER_URL}/brands`);
  }

}
