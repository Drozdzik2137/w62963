import { HttpClient } from '@angular/common/http';
import { IProductModelServer } from 'src/app/models/product.model';
import { ProductService } from 'src/app/services/product.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private SERVER_URL = 'http://localhost:4000/api';
  products: IProductModelServer[] = [];

  constructor(private http: HttpClient) { }


}
