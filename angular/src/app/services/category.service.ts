import { catchError, map, throwError, Observable } from 'rxjs';
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

  getProductsFromCategory(page: number, category: number, limit: number, orderBy: string, orderType: string){
    let params = new HttpParams();

    params = params.append('page', String(page));
    params = params.append('limit', String(limit));
    params = params.append('orderBy', String(orderBy));
    params = params.append('orderType', String(orderType));

    let id = category;

    return this.http.get<IServerResponse>(this.SERVER_URL + '/category/' +  id, {params, observe: 'response'});
  }

  addCategory(categoryName: string){
    return this.http.post(`${this.SERVER_URL}/category`, {categoryName}, {observe: 'response'});
  }

  updateCategory(id: number, categoryName: string){
    return this.http.patch(`${this.SERVER_URL}/category/` + id, {categoryName}, {observe: 'response'});
  }

  deleteCategory(id: number){
    return this.http.delete(`${this.SERVER_URL}/category/` + id, {observe: 'response'});
  }

}
