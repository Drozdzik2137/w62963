import { catchError, map, throwError } from 'rxjs';
import { IServerResponse } from 'src/app/models/product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICategoryServerResponse } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private SERVER_URL = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  getAllCategories(){
    return this.http.get<ICategoryServerResponse>(this.SERVER_URL + '/categories')
  }

  getProductsFromCategory(category: string){
    let params = new HttpParams();

    params = params.append('category', String(category));

    return this.http.get<IServerResponse>(this.SERVER_URL + '/category/', {params}).pipe(
      map((prods: IServerResponse) => prods),
      catchError(err => throwError(err))
    );
  }

}
