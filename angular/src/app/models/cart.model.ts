import { IProductModelServer } from './../models/product.model';

export interface ICartModelServer{
  total: number;
  data: [{
    product: IProductModelServer,
    numInCart: number
  }];
}

export interface ICartModelPublic{
  total: number;
  productData: [{
    id: number,
    inCart: number
  }]
}
