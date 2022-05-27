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
  category: string;
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
