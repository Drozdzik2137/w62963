export interface IUserResponseModel{
  token: string;
  auth: boolean;
  userId: number;
  email: string;
  fname: string;
  lname: string;
  photoUrl: string;
  type: string;
  isAdmin: boolean;
  createdAt: Date;
  phoneNumber: string;
}
export interface IUserAdminResponseModel{
  id: number;
  email: string;
  fname: string;
  lname: string;
  photo_url: string;
  type: string;
  is_admin: boolean;
  created_at: Date;
  phone_number: string;
}

export interface IUserAdminResponseServer{
  count: number;
  users: IUserAdminResponseModel[]
}

