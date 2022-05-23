export interface IOrderModelServer{
  id: any;
  brand: string;
  name: string;
  price: number;
  quantity: number;
  created_at: Date;
  email: string;
  user_id: number;
  img: string;
  total: number;
}

export interface IOrderServerResponse{
  count: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  orders: IOrderModelServer[];
}

export interface ICheckoutOrderResponseModel{
  id: number;
  brand: string;
  name: string;
  price: number;
  quantity: number;
  img: string;
  created_at: Date;
  email: string;
}
