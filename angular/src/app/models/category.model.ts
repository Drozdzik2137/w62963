export interface ICategoryModelServer{
  id: number;
  name: string;
}

export interface ICategoryServerResponse{
  count: number,
  categories: ICategoryModelServer[];
}
