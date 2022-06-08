export interface IProductModelServer{
  id: number;
  name: string;
  img: string;
  images: string;
  price: number;
  quantity: number;
  shortdesc: string;
  description: string;
  size: string;
  category_id: number;
  category: string;
  brand_id: number;
  brand: string;
  freshness: string;
}

export interface IServerResponse{
  count: number;
  limit: number;
  totalProducts: number;
  currentPage: number;
  totalPages: number;
  products: IProductModelServer[];
}
