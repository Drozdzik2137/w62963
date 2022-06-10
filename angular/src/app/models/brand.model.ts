export interface IBrandModelServer{
  id: number;
  name: string;
}

export interface IBrandServerResponse{
  count: number,
  brands: IBrandModelServer[];
}
